from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(
    title="Financial Data Health & Compliance System",
    description="Metadata-only regulatory compliance checking system.",
    version="0.1.0"
)

# CORS Setup
origins = [
    "http://localhost:5173",  # Vite default
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from api.endpoints import router as api_router
app.include_router(api_router, prefix="/api")

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Compliance System API is running"}
