from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
from typing import List, Dict

# Load the embedding model
model = SentenceTransformer("all-MiniLM-L6-v2")

# Sample charity data with IDs
charities = [
    {
        "id": 1,
        "title": "Access to Clean Water in Rural Areas",
        "description": "Providing clean and safe drinking water to underserved communities.",
        "image": "https://images.pexels.com/photos/28101466/pexels-photo-28101466/free-photo-of-photo-of-children-drinking-water.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "funding_percentage": 44.5,
        "supporters": 600,
        "amount": 22250,
        "category": ["Water & Sanitation", "Community Development"],
    },
    {
        "id": 2,
        "title": "Emergency Relief for Natural Disasters",
        "description": "Delivering immediate aid to victims of natural disasters worldwide.",
        "image": "https://images.pexels.com/photos/14000696/pexels-photo-14000696.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "funding_percentage": 100,
        "funding_complete": True,
        "supporters": 1000,
        "amount": 167080,
        "category": ["Disaster Relief"],
    },
    {
        "id": 3,
        "title": "Rebuilding Lives After Earthquakes",
        "description": "Supporting earthquake survivors with shelter and essential supplies.",
        "image": "https://images.pexels.com/photos/15861730/pexels-photo-15861730/free-photo-of-tents-in-a-refugee-camp.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "funding_percentage": 45.48,
        "supporters": 5000,
        "amount": 454900,
        "category": ["Disaster Relief", "Community Development"],
    },
    {
        "id": 4,
        "title": "School Meals for Underprivileged Children",
        "description": "Providing nutritious meals to children to support their education.",
        "image": "https://images.pexels.com/photos/6995201/pexels-photo-6995201.jpeg",
        "funding_percentage": 100,
        "funding_complete": True,
        "supporters": 1000,
        "amount": 239090,
        "category": ["Food & Nutrition", "Education", "Children & Youth"],
    },
    {
        "id": 5,
        "title": "Empowering Education Through Nutrition",
        "description": "Ensuring children have access to meals to focus on their studies.",
        "image": "https://images.pexels.com/photos/764681/pexels-photo-764681.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "funding_percentage": 100,
        "in_progress": True,
        "progress_percentage": 56.7,
        "supporters": 492,
        "amount": 88020,
        "category": ["Food & Nutrition", "Education"],
    },
    {
        "id": 6,
        "title": "Building a Brighter Future for Students",
        "description": "Providing meals to help students achieve their educational goals.",
        "image": "https://images.pexels.com/photos/3401403/pexels-photo-3401403.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "funding_percentage": 100,
        "funding_complete": True,
        "supporters": 1000,
        "amount": 123540,
        "category": ["Food & Nutrition", "Education"],
    },
    {
        "id": 7,
        "title": "Supporting Education Through Meal Programs",
        "description": "Helping children stay in school by providing daily meals.",
        "image": "https://images.pexels.com/photos/8617558/pexels-photo-8617558.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "funding_percentage": 100,
        "funding_complete": True,
        "supporters": 1000,
        "amount": 81080,
        "category": ["Food & Nutrition", "Education", "Children & Youth"],
    },
    {
        "id": 8,
        "title": "Nutrition for Academic Success",
        "description": "Providing meals to ensure children can focus on learning.",
        "image": "https://images.pexels.com/photos/6590920/pexels-photo-6590920.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "funding_percentage": 100,
        "funding_complete": True,
        "supporters": 1000,
        "amount": 92320,
        "category": ["Food & Nutrition", "Education"],
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
    """
    Search for charities based on a query using semantic similarity, returning all results sorted by relevance.

    Args:
        query (str): The search query.

    Returns:
        List[Dict]: List of all matching charity dictionaries with metadata and confidence scores.
    """
    query_vec = model.encode([query], convert_to_numpy=True)
    distances, indices = index.search(query_vec, len(charities))
    results = []
    for idx, distance in zip(indices[0], distances[0]):
        if idx < len(charities):
            confidence = max(0.0, 1.0 - (distance / (distance + 1.0)))
            charity = charities[idx].copy()
            charity["confidence"] = float(confidence)
            results.append(charity)
    return results
