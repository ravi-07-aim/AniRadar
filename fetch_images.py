import pandas as pd
import requests
import time

anime_df = pd.read_csv('anime_cleaned.csv')

# Add image_url column if it doesn't exist
if 'image_url' not in anime_df.columns:
    anime_df['image_url'] = ''

print(f"Total anime: {len(anime_df)}")
print("Starting image fetch... this will take a while ☕")

for i, row in anime_df.iterrows():
    # Skip if already fetched
    if pd.notna(anime_df.at[i, 'image_url']) and anime_df.at[i, 'image_url'] != '':
        continue

    try:
        res = requests.get(
            f"https://api.jikan.moe/v4/anime?q={requests.utils.quote(str(row['name']))}&limit=1",
            timeout=10
        )
        data = res.json()
        url = data['data'][0]['images']['jpg']['large_image_url'] if data.get('data') else ''
        anime_df.at[i, 'image_url'] = url
    except:
        anime_df.at[i, 'image_url'] = ''

    # Save every 100 rows in case it crashes
    if i % 100 == 0:
        anime_df.to_csv('anime_with_images.csv', index=False)
        print(f"Progress: {i}/{len(anime_df)}")

    # Respect rate limit
    time.sleep(0.4)

anime_df.to_csv('anime_with_images.csv', index=False)
print("Done! anime_with_images.csv saved ✅")