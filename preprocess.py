import pandas as pd

df = pd.read_csv('mal_anime.csv')
print("Original shape:", df.shape)

# Keep only relevant columns
df = df[['myanimelist_id', 'title', 'Genres', 'Type', 'Score', 'image', 'Released_Year', 'Members']]

# Rename columns
df = df.rename(columns={
    'myanimelist_id': 'anime_id',
    'title': 'name',
    'Genres': 'genre',
    'Type': 'type',
    'Score': 'rating',
    'image': 'image_url',
    'Released_Year': 'year',
    'Members': 'members'
})

# Clean members column
df['members'] = pd.to_numeric(df['members'].astype(str).str.replace(',', ''), errors='coerce')

# Drop nulls
df = df.dropna(subset=['genre', 'rating', 'image_url', 'members'])
df = df.dropna(subset=['type'])

# Convert rating to float
df['rating'] = pd.to_numeric(df['rating'], errors='coerce')
df = df.dropna(subset=['rating'])

# Keep only popular anime
df = df[df['members'] >= 10000]
print("After popularity filter:", df.shape)

# Keep only what we need
df = df[['anime_id', 'name', 'genre', 'type', 'rating', 'image_url']]

df.to_csv('anime_cleaned.csv', index=False)
print("Saved to anime_cleaned.csv ✅")