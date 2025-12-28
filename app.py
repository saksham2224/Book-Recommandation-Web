from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

from langchain_community.vectorstores import Chroma
from langchain_huggingface import HuggingFaceEmbeddings


# ================= APP =================
app = FastAPI(
    title="🧙‍♂️ Wizard Book Recommendation API",
    description="Semantic book search using ChromaDB + HuggingFace embeddings",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # frontend ke liye
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ================= EMBEDDINGS =================
embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

db = Chroma(
    persist_directory="chroma_db",
    embedding_function=embeddings
)


# ================= SCHEMAS =================
class SearchRequest(BaseModel):
    query: str
    k: int = 5


class BookResponse(BaseModel):
    title: str | None
    author: str | None
    rating: float | None
    genres: str | None
    url: str | None
    description: str


# ================= ROUTES =================
@app.get("/")
def root():
    return {
        "status": "✨ Arcane Library is alive",
        "message": "Go to /docs to test the magic 🪄"
    }


@app.post("/search", response_model=List[BookResponse])
def search_books(req: SearchRequest):
    """
    Semantic search for books based on user intent
    """
    results = db.similarity_search(req.query, k=req.k)

    books = []
    for doc in results:
        books.append({
            "title": doc.metadata.get("title"),
            "author": doc.metadata.get("author"),
            "rating": doc.metadata.get("rating"),
            "genres": doc.metadata.get("genres"),
            "url": doc.metadata.get("url"),
            "description": doc.page_content
        })

    return books
