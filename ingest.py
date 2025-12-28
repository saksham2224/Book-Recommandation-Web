import pandas as pd
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings

print("📚 Loading books CSV...")
df = pd.read_csv("books.csv")

texts = []
metadatas = []

for _, row in df.iterrows():
    text = f"""
    Title: {row['Book']}
    Author: {row['Author']}
    Description: {row['Description']}
    Genres: {row['Genres']}
    """

    metadata = {
        "title": row["Book"],
        "author": row["Author"],
        "rating": row.get("Avg_Rating"),
        "genres": row.get("Genres"),
        "url": row.get("URL")
    }

    texts.append(text)
    metadatas.append(metadata)

print(f"✨ Total books processed: {len(texts)}")

# 🔥 LOCAL EMBEDDINGS (NO API)
embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

db = Chroma.from_texts(
    texts=texts,
    metadatas=metadatas,
    embedding=embeddings,
    persist_directory="chroma_db"
)

db.persist()
print("✅ ChromaDB created successfully (LOCAL embeddings)")
