from fastapi import APIRouter, UploadFile, File, HTTPException
import os
from services.ingestion import load_data, profile_dataset
from core.rules_engine import RulesEngine
from services.scoring import calculate_scores
from ai.agent import run_advisory_agent

router = APIRouter()

@router.post("/analyze")
async def analyze_data(file: UploadFile = File(...)):
    # 1. Ingestion & Profiling (Metadata Extraction)
    try:
        df = await load_data(file)
        metadata = profile_dataset(df)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    # 2. Rule Execution (Deterministic)
    engine = RulesEngine(metadata)
    rule_results = engine.run_all()

    # 3. Scoring
    scores = calculate_scores(rule_results)

    # 4. Agent Analysis
    try:
        if os.environ.get("GOOGLE_API_KEY"):
            analysis = await run_advisory_agent(scores, metadata)
        else:
            analysis = {
                "executive_summary": "AI analysis skipped (GOOGLE_API_KEY not set).",
                "risk_assessment": "Configure the API key to enable GenAI insights.",
                "remediation_steps": []
            }
    except Exception as e:
         # Fallback to prevent API failure
         analysis = {
            "executive_summary": "AI analysis failed temporarily.",
            "risk_assessment": str(e),
            "remediation_steps": []
        }

    return {
        "filename": file.filename,
        "metadata": metadata, # Frontend might need this for visualization
        "scores": scores,
        "analysis": analysis
    }
