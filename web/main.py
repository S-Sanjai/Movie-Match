import sys
import os
import requests
import socket
import dns.resolver
from typing import List, Optional
import time

# --- Custom DNS Configuration for TMDB ---
try:
    # Create a resolver that uses Google DNS
    resolver = dns.resolver.Resolver()
    resolver.nameservers = ['8.8.8.8', '8.8.4.4']
    
    # Store original getaddrinfo
    _original_getaddrinfo = socket.getaddrinfo

    def custom_getaddrinfo(host, port, family=0, type=0, proto=0, flags=0):
        """
        Intercept DNS lookups for api.themoviedb.org and api.themoviedb.org
        to use Google DNS, bypassing potential ISP blocks.
        """
        if host in ['api.themoviedb.org', 'image.tmdb.org']:
            try:
                # Resolve using Google DNS
                answers = resolver.resolve(host, 'A')
                if answers:
                    # Use the first resolved IP address
                    ip_address = answers[0].address
                    # Delegate to original getaddrinfo using the IP
                    return _original_getaddrinfo(ip_address, port, family, type, proto, flags)
            except Exception as e:
                print(f"Warning: Custom DNS resolution failed for {host}: {e}")
                # Fallback to default behavior
        
        return _original_getaddrinfo(host, port, family, type, proto, flags)

    # Monkeypatch socket.getaddrinfo
    socket.getaddrinfo = custom_getaddrinfo
    print("Configured Custom DNS (8.8.8.8) for TMDB Requests")
    
except ImportError:
    print("Warning: dnspython not installed. Using default DNS.")
except Exception as e:
    print(f"Warning: Failed to configure custom DNS: {e}")
# -----------------------------------------
from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Define BASE_DIR first
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Ensure we can import from src
sys.path.append(BASE_DIR)

from src.knn_scratch import MovieRecommender
from src.api_auth import API_KEY

app = FastAPI()

# Input your frontend URL here
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173", # Vite default
    "http://127.0.0.1:5173",
    "https://s-sanjai.github.io",  # GitHub Pages - Production
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Recommender
DATA_PATH = os.path.join(BASE_DIR, 'data', 'movies.csv')
MATRIX_PATH = os.path.join(BASE_DIR, 'models', 'final_matrix.npz')

# Check if files exist, if not try root (as per some confusion in logs)
if not os.path.exists(DATA_PATH):
    DATA_PATH = os.path.join(BASE_DIR, 'movies.csv')

recommender = MovieRecommender(DATA_PATH, MATRIX_PATH)

from fastapi.concurrency import run_in_threadpool

# --- Helper Functions ---

def transform_movie_data(data: dict) -> dict:
    """Transform internal movie dict to frontend interface"""
    return {
        'id': str(data.get('id')),
        'title': data.get('title'),
        'overview': data.get('overview', 'No overview available.'),
        'genres': data.get('genres', []),
        'posterUrl': data.get('poster'),
        'backdropUrl': data.get('backdrop'),
        'releaseDate': data.get('release_date'),
        'rating': data.get('vote_average'),
        'matchPercentage': int(data.get('similarity', 0) * 100) if 'similarity' in data else None
    }

from functools import lru_cache
from concurrent.futures import ThreadPoolExecutor

# Validates and gets full details for a movie from TMDB
@lru_cache(maxsize=256)
def get_tmdb_details_sync(movie_id):
    """Fetch full movie details from TMDB (Synchronous, Cached)"""
    try:
        url = f"https://api.themoviedb.org/3/movie/{movie_id}?api_key={API_KEY}&language=en-US"
        response = requests.get(url, timeout=5)
        
        if response.status_code == 200:
            data = response.json()
            # Extract relevant fields
            return {
                'id': data.get('id'),
                'title': data.get('title'),
                'overview': data.get('overview', 'No overview available.'),
                'poster': f"https://image.tmdb.org/t/p/w500{data.get('poster_path')}" if data.get('poster_path') else "https://via.placeholder.com/500x750?text=No+Image",
                'backdrop': f"https://image.tmdb.org/t/p/original{data.get('backdrop_path')}" if data.get('backdrop_path') else None,
                'release_date': data.get('release_date', 'Unknown'),
                'vote_average': data.get('vote_average', 0),
                'genres': [g['name'] for g in data.get('genres', [])],
                'runtime': data.get('runtime', 0)
            }
        else:
            print(f"Error: TMDB returned {response.status_code} for movie {movie_id}")
    except Exception as e:
        print(f"Error fetching details for {movie_id}: {e}")

    
    # Minimal fallback if API fails
    return {
        'id': movie_id,
        'title': 'Unknown',
        'poster': "https://via.placeholder.com/500x750?text=No+Image",
        'backdrop': None,
        'overview': 'Could not fetch details.',
        'genres': [],
        'vote_average': 0,
        'release_date': 'Unknown'
    }

@lru_cache(maxsize=128)
def search_tmdb_fallback_sync(query):
    """Search TMDB for a movie if not found locally (Cached)"""
    try:
        search_url = f"https://api.themoviedb.org/3/search/movie?api_key={API_KEY}&language=en-US&query={requests.utils.quote(query)}&page=1&include_adult=false"
        response = requests.get(search_url, timeout=2)
        
        if response.status_code == 200:
            results = response.json().get('results', [])
            if results:
                # Return the detailed version of the first result
                return get_tmdb_details_sync(results[0]['id'])
    except Exception as e:
        print(f"Error searching TMDB for {query}: {e}")
    return None

def search_tmdb_multiple_sync(query, limit=3):
    """Search TMDB and return multiple detailed results (Parallelized)"""
    movies = []
    try:
        search_url = f"https://api.themoviedb.org/3/search/movie?api_key={API_KEY}&language=en-US&query={requests.utils.quote(query)}&page=1&include_adult=false"
        response = requests.get(search_url, timeout=2)
        
        if response.status_code == 200:
            results = response.json().get('results', [])
            candidate_ids = [r['id'] for r in results[:limit]]
            
            # Fetch details in parallel
            with ThreadPoolExecutor(max_workers=limit) as executor:
                # map returns results in order
                movies = list(executor.map(get_tmdb_details_sync, candidate_ids))
                
            # Filter out any Nones if fetch failed
            movies = [m for m in movies if m]
            
    except Exception as e:
        print(f"Error searching TMDB multiple {query}: {e}")
    return movies

def search_tmdb_mixed_sync(query, movie_limit=6, tv_limit=4):
    """Search TMDB for both movies and TV shows, return combined results"""
    results = []
    try:
        # Search movies
        movie_url = f"https://api.themoviedb.org/3/search/movie?api_key={API_KEY}&language=en-US&query={requests.utils.quote(query)}&page=1&include_adult=false"
        movie_response = requests.get(movie_url, timeout=2)
        
        # Search TV shows
        tv_url = f"https://api.themoviedb.org/3/search/tv?api_key={API_KEY}&language=en-US&query={requests.utils.quote(query)}&page=1&include_adult=false"
        tv_response = requests.get(tv_url, timeout=2)
        
        movie_ids = []
        tv_ids = []
        
        if movie_response.status_code == 200:
            movie_results = movie_response.json().get('results', [])
            movie_ids = [r['id'] for r in movie_results[:movie_limit]]
        
        if tv_response.status_code == 200:
            tv_results = tv_response.json().get('results', [])
            tv_ids = [('tv', r['id']) for r in tv_results[:tv_limit]]
        
        # Fetch movie details in parallel
        if movie_ids:
            with ThreadPoolExecutor(max_workers=movie_limit) as executor:
                movies = list(executor.map(get_tmdb_details_sync, movie_ids))
                results.extend([m for m in movies if m])
        
        # Fetch TV show details in parallel
        if tv_ids:
            with ThreadPoolExecutor(max_workers=tv_limit) as executor:
                tv_shows = list(executor.map(lambda x: get_tmdb_tv_details_sync(x[1]), tv_ids))
                results.extend([t for t in tv_shows if t])
                
    except Exception as e:
        print(f"Error searching TMDB mixed {query}: {e}")
    return results

def get_tmdb_tv_details_sync(tv_id):
    """Get TV show details from TMDB"""
    try:
        url = f"https://api.themoviedb.org/3/tv/{tv_id}?api_key={API_KEY}&language=en-US"
        response = requests.get(url, timeout=2)
        
        if response.status_code == 200:
            data = response.json()
            return {
                'id': f"tv-{data.get('id')}",  # Prefix with 'tv-' to distinguish
                'title': data.get('name'),
                'poster': f"https://image.tmdb.org/t/p/w500{data.get('poster_path')}" if data.get('poster_path') else "https://via.placeholder.com/500x750?text=No+Image",
                'backdrop': f"https://image.tmdb.org/t/p/original{data.get('backdrop_path')}" if data.get('backdrop_path') else None,
                'overview': data.get('overview', ''),
                'genres': [g['name'] for g in data.get('genres', [])],
                'vote_average': data.get('vote_average', 0),
                'release_date': data.get('first_air_date', 'Unknown'),
                'media_type': 'tv'
            }
    except Exception as e:
        print(f"Error fetching TV details for {tv_id}: {e}")
    return None

@lru_cache(maxsize=64)
def get_tmdb_recommendations_sync(movie_id):
    """Get recommendations from TMDB (Cached)"""
    recs = []
    try:
        url = f"https://api.themoviedb.org/3/movie/{movie_id}/recommendations?api_key={API_KEY}&language=en-US&page=1"
        response = requests.get(url, timeout=2)
        
        if response.status_code == 200:
            results = response.json().get('results', [])
            for r in results[:5]: # Top 5
                recs.append({
                    'id': r.get('id'),
                    'title': r.get('title'),
                    'poster': f"https://image.tmdb.org/t/p/w500{r.get('poster_path')}" if r.get('poster_path') else "https://via.placeholder.com/500x750?text=No+Image",
                    'similarity': 0.0 # TMDB doesn't give similarity score easily that matches ours
                })
    except Exception as e:
        print(f"Error fetching recs for {movie_id}: {e}")
    return recs

@lru_cache(maxsize=1) # Cache trending for a while, it doesn't change often
def get_tmdb_trending_sync():
    """Get trending movies from TMDB (Cached)"""
    movies = []
    try:
        url = f"https://api.themoviedb.org/3/trending/movie/week?api_key={API_KEY}"
        response = requests.get(url, timeout=2)
        
        if response.status_code == 200:
            results = response.json().get('results', [])
            for r in results:
                movies.append(r.get('title'))
    except Exception as e:
        print(f"Error fetching trending: {e}")
    return movies

# --- API Endpoints ---

@app.get("/search")
async def search_legacy(title: str):
    """Compatibility endpoint for frontend search"""
    try:
        # 1. Search Logic (reuse logic from search_api)
        try:
            local_movie = recommender.get_movie_details(title)
            movie_details = await run_in_threadpool(get_tmdb_details_sync, local_movie['id'])
        except ValueError:
            movie_details = await run_in_threadpool(search_tmdb_fallback_sync, title)
            
        if not movie_details:
             return {"error": f"Movie '{title}' not found."}
        
        # 2. Recommendation Logic (reuse logic from recommend_api)
        local_recs = []
        try:
            raw_recs = recommender.get_recommendations(movie_details['title'])
            for rec in raw_recs:
                details = await run_in_threadpool(get_tmdb_details_sync, rec['id'])
                details['similarity'] = rec['similarity']
                local_recs.append(transform_movie_data(details))
        except (ValueError, IndexError):
             raw_recs = await run_in_threadpool(get_tmdb_recommendations_sync, movie_details['id'])
             for rec in raw_recs:
                 local_recs.append(transform_movie_data(rec))

        # 3. Return format expected by frontend
        return {
            "movie": transform_movie_data(movie_details),
            "recommendations": local_recs
        }

    except Exception as e:
        print(f"Legacy Search Error: {e}")
        return {"error": str(e)}

@app.get("/api/search")
@app.get("/api/search")
async def search_api(q: str):
    """API Endpoint to search for a movie"""
    try:
        # Search TMDB for both movies (6) and TV shows (4)
        results_list = await run_in_threadpool(search_tmdb_mixed_sync, q, movie_limit=6, tv_limit=4)
        
        formatted_results = []
        for m in results_list:
            formatted = transform_movie_data(m)
            if formatted['matchPercentage'] is None:
                formatted['matchPercentage'] = 100
            formatted_results.append(formatted)

        return {
            "success": True,
            "data": {
                "query": q,
                "results": formatted_results,
                "timestamp": int(time.time())
            }
        }

    except Exception as e:
        print(f"Server Error: {e}")
        return {"success": False, "error": str(e)}

@app.get("/api/recommend/{movie_id}")
async def recommend_api(movie_id: int):
    """API Endpoint to get recommendations"""
    try:
        # Get details of the target movie first
        movie_details = await run_in_threadpool(get_tmdb_details_sync, movie_id)
        
        # Try local recommendations first (needs title)
        local_recs = []
        try:
            # We need the title to use the local recommender. 
            # Ideally recommender should work with IDs too, but it uses titles.
            # We trust the title from TMDB details matches closely enough or we use the mapping.
            # But the local recommender `get_recommendations` takes a title.
            raw_recs = recommender.get_recommendations(movie_details['title'])
             
             # Enrich recommendations with Posters
            for rec in raw_recs:
                details = await run_in_threadpool(get_tmdb_details_sync, rec['id'])
                # Merge details with similarity score
                details['similarity'] = rec['similarity']
                local_recs.append(transform_movie_data(details))
                
        except (ValueError, IndexError):
             # Fallback to TMDB recommendations
             print(f"Using TMDB fallback recommendations for ID {movie_id}")
             raw_recs = await run_in_threadpool(get_tmdb_recommendations_sync, movie_id)
             for rec in raw_recs:
                 local_recs.append(transform_movie_data(rec))

        return {
            "success": True,
            "data": {
                "movie": transform_movie_data(movie_details),
                "similarMovies": local_recs,
                "similarityScore": 0.0 # Aggregate score not really applicable here
            }
        }

    except Exception as e:
        print(f"Server Error: {e}")
        return {"success": False, "error": str(e)}

@app.get("/api/movie/{movie_id}")
async def movie_details_api(movie_id: int):
    try:
        movie_details = await run_in_threadpool(get_tmdb_details_sync, movie_id)
        return {
            "success": True,
            "data": transform_movie_data(movie_details)
        }
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.api_route("/api/trending", methods=["GET", "HEAD"])
async def trending_api():
    """API Endpoint to get trending movie titles"""
    try:
        titles = await run_in_threadpool(get_tmdb_trending_sync)
        return {
            "success": True,
            "data": titles
        }
    except Exception as e:
         return {"success": False, "error": str(e)}

# --- Static Files & Frontend Serving ---

# Mount the 'assets' folder from the build output
DIST_DIR = os.path.join(BASE_DIR, "web", "dist")
ASSETS_DIR = os.path.join(DIST_DIR, "assets")

if os.path.exists(ASSETS_DIR):
    app.mount("/assets", StaticFiles(directory=ASSETS_DIR), name="assets")

@app.api_route("/", methods=["GET", "HEAD"])
async def serve_index():
    """Serve the index.html from dist"""
    index_path = os.path.join(DIST_DIR, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    
    # Fallback to old template if dist not built yet (during dev)
    old_index_path = os.path.join(BASE_DIR, "web", "templates", "index.html")
    if os.path.exists(old_index_path):
        return FileResponse(old_index_path)
    
    return HTMLResponse("index.html not found.", status_code=404)

if __name__ == "__main__":
    uvicorn.run("web.main:app", host="127.0.0.1", port=8000, reload=True)