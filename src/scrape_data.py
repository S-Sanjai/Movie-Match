import pandas as pd
import requests
from api_auth import get_data, genre_ids,  API_KEY, genre_url


genre_lookup = genre_ids(genre_url)

movies = []
pages = 25

for page in range(1, pages + 1):
    movie_url = movie_url = f"https://api.themoviedb.org/3/movie/popular?api_key={API_KEY}&language=en-US&page={page}"
    response = requests.get(movie_url)
    results = response.json()['results']
    
    for movie in results:
        genres = [genre_lookup[g] for g in movie['genre_ids']]
        release_date = movie.get('release_date','')
        release_year = int(release_date[:4]) if release_date else None

        movies.append({
            'id':movie['id'],
            'title': movie['title'],
            'overview': movie['overview'],
            'genres': genres,
            'release_year': release_year
        })


df = pd.DataFrame(movies)
df.to_csv('movies.csv', index=False)