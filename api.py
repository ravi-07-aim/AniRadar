import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load and build model
anime_df = pd.read_csv('anime_cleaned.csv')
anime_df['features'] = anime_df['genre'].fillna('') + ' ' + anime_df['type'].fillna('')

tfidf = TfidfVectorizer()
tfidf_matrix = tfidf.fit_transform(anime_df['features'])
content_similarity = cosine_similarity(tfidf_matrix)

anime_df = anime_df.reset_index(drop=True)
anime_index = pd.Series(anime_df.index, index=anime_df['name'].str.lower())

def recommend(anime_name, genre_filter=None, top_n=10):
    anime_name = anime_name.lower()
    if anime_name not in anime_index:
        return None

    idx = anime_index[anime_name]
    scores = list(enumerate(content_similarity[idx]))
    scores = sorted(scores, key=lambda x: x[1], reverse=True)
    scores = scores[1:top_n*3+1]

    results = anime_df.iloc[[i[0] for i in scores]][['name', 'genre', 'rating', 'image_url']].copy()
    results['score'] = [i[1] for i in scores[:len(results)]]

    if genre_filter:
        results = results[results['genre'].str.lower().str.contains(genre_filter.lower(), na=False)]

    results = results.sort_values('rating', ascending=False).head(top_n)
    return results[['name', 'genre', 'rating', 'image_url']].to_dict(orient='records')

@app.get("/")
def home():
    return {"message": "AniRadar API is live 🎯"}

@app.get("/recommend")
def get_recommendations(anime: str = None, genre: str = None):
    if not anime and not genre:
        return {"error": "Please provide an anime name or genre!"}

    if anime:
        results = recommend(anime, genre_filter=genre)
        if results is None:
            return {"error": "Anime not found!"}
        return {"anime": anime, "recommendations": results}

    if genre:
        filtered = anime_df[anime_df['genre'].str.lower().str.contains(genre.lower(), na=False)]
        filtered = filtered.sort_values('rating', ascending=False).head(10)
        results = filtered[['name', 'genre', 'rating', 'image_url']].to_dict(orient='records')
        return {"genre": genre, "recommendations": results}