from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from fastapi.middleware.cors import CORSMiddleware
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
from typing import Dict

# Load the embedding model
model = SentenceTransformer("all-MiniLM-L6-v2")

# Sample charity data with IDs
charities = [
    {
        "id": 1,
        "title": "Access to Clean Water in Rural Areas",
        "description": "Providing clean and safe drinking water to underserved communities.",
    },
    {
        "id": 2,
        "title": "Emergency Relief for Natural Disasters",
        "description": "Delivering immediate aid to victims of natural disasters worldwide.",
    },
    {
        "id": 3,
        "title": "Rebuilding Lives After Earthquakes",
        "description": "Supporting earthquake survivors with shelter and essential supplies.",
    },
    {
        "id": 4,
        "title": "School Meals for Underprivileged Children",
        "description": "Providing nutritious meals to children to support their education.",
    },
    {
        "id": 5,
        "title": "Empowering Education Through Nutrition",
        "description": "Ensuring children have access to meals to focus on their studies.",
    },
    {
        "id": 6,
        "title": "Building a Brighter Future for Students",
        "description": "Providing meals to help students achieve their educational goals.",
    },
    {
        "id": 7,
        "title": "Supporting Education Through Meal Programs",
        "description": "Helping children stay in school by providing daily meals.",
    },
    {
        "id": 8,
        "title": "Nutrition for Academic Success",
        "description": "Providing meals to ensure children can focus on learning.",
    },
]

# Create embeddings
texts = [c["title"] + " " + c["description"] for c in charities]
embeddings = model.encode(texts, convert_to_numpy=True)

# Build FAISS index
dimension = embeddings.shape[1]
index = faiss.IndexFlatL2(dimension)
index.add(embeddings)


def search_charities(query: str) -> List[Dict]:
    query_vec = model.encode([query], convert_to_numpy=True)
    distances, indices = index.search(query_vec, len(charities))

    results = []
    for idx, distance in zip(indices[0], distances[0]):
        if idx < len(charities):
            confidence = max(0.0, 1.0 - (distance / (distance + 1.0)))
            results.append(
                {"id": charities[idx]["id"], "confidence": float(confidence)}
            )
    return results


app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class SearchRequest(BaseModel):
    query: str


class SearchResult(BaseModel):
    id: int
    confidence: float


@app.post("/search", response_model=List[SearchResult])
async def search_endpoint(request: SearchRequest):
    results = search_charities(request.query)
    return results
