import pandas as pd

df = pd.read_csv('mal_anime.csv')
print("Original shape:", df.shape)

# Keep only relevant columns
df = df[['myanimelist_id', 'title', 'Genres', 'Type', 'Score', 'image', 'Released_Year', 'Themes', 'Demographic']]

# Rename columns to match our old format
df = df.rename(columns={
    'myanimelist_id': 'anime_id',
    'title': 'name',
    'Genres': 'genre',
    'Type': 'type',
    'Score': 'rating',
    'image': 'image_url',
    'Released_Year': 'year'
})

# Drop nulls
df = df.dropna(subset=['genre', 'rating', 'image_url'])

# Convert rating to float
df['rating'] = pd.to_numeric(df['rating'], errors='coerce')
df = df.dropna(subset=['rating'])

print("After cleaning:", df.shape)
print(df.head())
print(df.isnull().sum())

df.to_csv('anime_cleaned.csv', index=False)
print("\nSaved to anime_cleaned.csv ✅")

# Drop the 1 null in type
df = df.dropna(subset=['type'])

# Keep only what we need
df = df[['anime_id', 'name', 'genre', 'type', 'rating', 'image_url']]

print("Final shape:", df.shape)