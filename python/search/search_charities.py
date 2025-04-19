from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
from typing import List, Dict
from supabase import create_client, Client
import os
from dotenv import load_dotenv

load_dotenv()

# Load the embedding model
model = SentenceTransformer("all-MiniLM-L6-v2")

url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
key = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")

supabase: Client = create_client(url, key)


# Add this new function to fetch charities from Supabase
def fetch_charities_from_supabase():
    response = supabase.table("charity_projects").select("*").execute()

    if not response.data:
        print("Supabase fetch error or empty result:", response)
        return []

    return response.data


# Charities data
charities = fetch_charities_from_supabase()
print(charities)

# Create embeddings
texts = [f"{c['title']} {c['description']}" for c in charities]
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
