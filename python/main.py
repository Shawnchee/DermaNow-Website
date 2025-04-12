from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
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


class SearchResponse(BaseModel):
    id: int
    title: str
    description: str
    image: str
    funding_percentage: float
    supporters: int
    amount: int
    category: List[str]
    confidence: float
    funding_complete: bool | None = None
    in_progress: bool | None = None
    progress_percentage: float | None = None


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
