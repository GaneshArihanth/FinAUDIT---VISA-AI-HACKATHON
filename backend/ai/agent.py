import os
from typing import TypedDict, List
from langchain_core.messages import SystemMessage, HumanMessage
from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from langgraph.graph import StateGraph, END
import json

# Define the Agent State
class AgentState(TypedDict):
    metadata: dict
    scores: dict
    analysis: dict

# Initialize LLM
# Supports Google Gemini via GOOGLE_API_KEY
llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0.2
)

# --- Nodes ---

def analyze_compliance(state: AgentState):
    """
    Analyzes the compliance scores and generates a summary and remediation steps.
    """
    scores = state["scores"]
    metadata = state["metadata"]
    
    # Prompt Construction
    system_prompt = """You are an expert Financial Data Compliance Officer. 
    Your role is to analyze dataset metadata and compliance scores to provide a plain-English assessment and actionable remediation steps.
    
    You will receive:
    1. A 'Health Score' and 'Compliance Score'.
    2. Dimension-wise breakdown (Completeness, Validity, etc.).
    3. Metadata summary (column names, patterns found).
    
    Output strictly valid JSON with the following structure:
    {
        "executive_summary": "One sentence overview of the data health.",
        "risk_assessment": "Short paragraph explaining key risks (e.g. 'Missing KYC fields', 'PII detected').",
        "remediation_steps": [
            {"issue": "Description of issue", "action": "Exact step to fix it", "priority": "High/Medium/Low"}
        ]
    }
    """
    
    user_message = f"""
    Overall Score: {scores.get('overall_score')}
    Dimension Scores: {scores.get('dimension_scores')}
    Rule Details: {json.dumps(scores.get('rule_results', {}), indent=2)}
    
    Metadata Profile: {json.dumps(metadata, indent=2)}
    """
    
    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=user_message)
    ]
    
    try:
        response = llm.invoke(messages)
        # Parse JSON from the response
        content = response.content
        # Remove potential markdown code blocks
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0]
        elif "```" in content:
             content = content.split("```")[1].split("```")[0]
             
        analysis_json = json.loads(content.strip())
        return {"analysis": analysis_json}
    except Exception as e:
        return {"analysis": {
            "executive_summary": "Analysis failed due to LLM error or configuration.",
            "risk_assessment": f"Error: {str(e)}",
            "remediation_steps": []
        }}

# --- Graph Construction ---

workflow = StateGraph(AgentState)
workflow.add_node("compliance_analyst", analyze_compliance)
workflow.set_entry_point("compliance_analyst")
workflow.add_edge("compliance_analyst", END)

app = workflow.compile()

async def run_advisory_agent(scores: dict, metadata: dict) -> dict:
    """
    Entry point to run the agent.
    """
    initial_state = {
        "scores": scores,
        "metadata": metadata,
        "analysis": {}
    }
    
    # Run the graph
    result = await app.ainvoke(initial_state)
    return result["analysis"]
