import pandas as pd

df = pd.read_csv('mal_anime.csv')
print("Shape:", df.shape)
print("\nColumns:", df.columns.tolist())
print("\nSample:")
print(df[['title', 'Genres', 'Score', 'image', 'Released_Year']].head())
print("\nNull values:")
print(df[['title', 'Genres', 'Score', 'image']].isnull().sum())

# Check for newer anime
print("\nJujutsu Kaisen:")
print(df[df['title'].str.contains('Jujutsu', na=False)][['title', 'Released_Year']].head())
print("\nBlue Lock:")
print(df[df['title'].str.contains('Blue Lock', na=False)][['title', 'Released_Year']].head())