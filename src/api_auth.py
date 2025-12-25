import os
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("TMDB_API_KEY")

url = f"https://api.themoviedb.org/3/movie/popular?api_key={API_KEY}&language=en-US&page=1"
genre_url = f"https://api.themoviedb.org/3/genre/movie/list?api_key={API_KEY}&language=en-US"
    
def get_data(url):
    response = requests.get(url)
    data = response.json()
    return(data)

def genre_ids(genre_url):
    genre_response = requests.get(genre_url)
    genres_data = genre_response.json()
    genre_lookup = {genre['id']: genre['name'] for genre in genres_data['genres']}
    return genre_lookup

def is_missing_vals(movies):
    count = 0
    missing_list = []
    for movie in movies:
        for key in movie.keys():
            if (movie[key] is None) or (movie[key] == ''):
                count += 1
                missing_list.append(movie['title'])
                break
    return count, missing_list

