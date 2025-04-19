from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from api.chatbot import chatbot_app
from search.search_charities import search_charities
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise ValueError("OPENAI_API_KEY not found in environment variables")

# Initialize main FastAPI app
app = FastAPI(title="DermaNow API")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount chatbot routes
app.mount("/chatbot", chatbot_app)


# Pydantic models for search endpoint
class SearchRequest(BaseModel):
    query: str


class ImpactStat(BaseModel):
    icon: str
    title: str
    subtitle: str


class TimelineStep(BaseModel):
    desc: str
    step: int
    color: str
    title: str


class SearchResponse(BaseModel):
    id: int
    created_at: str
    title: str
    description: Optional[str]
    image: Optional[str]
    funding_percentage: float
    supporters: int
    amount: int
    category: Optional[List[str]] = None
    in_progress: Optional[bool]
    progress_percentage: Optional[float]
    funding_complete: Optional[bool]
    smart_contract_address: Optional[str]
    verified: Optional[bool]
    goal_amount: Optional[int]
    location: Optional[str]
    organization_name: Optional[str]
    document_urls: Optional[List[str]]
    overview: Optional[List[str]]
    objective: Optional[List[str]]
    impact_stats: Optional[List[ImpactStat]]
    timeline: Optional[List[TimelineStep]]
    confidence: float


@app.post("/search", response_model=List[SearchResponse])
async def search_endpoint(request: SearchRequest):
    """
    Semantic search for DermaNow charities based on a user query.

    Args:
        request (SearchRequest): Contains the search query.

    Returns:
        List[SearchResponse]: List of all matching charities with metadata and confidence scores.
    """
    results = search_charities(request.query)
    return results


# Health check
@app.get("/health")
async def health_check():
    return {"status": "healthy"}
