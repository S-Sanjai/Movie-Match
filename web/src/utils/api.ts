import { ApiResponse, SearchResult, RecommendationResult, Movie } from '../types';

// API Base URL - will be updated with your Render backend URL
// For now, empty string works in development (same origin)
// After deploying to Render, update this with your backend URL
const API_BASE = import.meta.env.VITE_API_URL || '';

export async function searchMovies(query: string): Promise<ApiResponse<SearchResult>> {
    try {
        const response = await fetch(`${API_BASE}/api/search?q=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Search API Error:', error);
        return { success: false, data: { query, results: [], timestamp: Date.now() }, error: String(error) };
    }
}

export async function getRecommendations(movieId: string): Promise<ApiResponse<RecommendationResult>> {
    try {
        const response = await fetch(`${API_BASE}/api/recommend/${movieId}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Recommendation API Error:', error);
        // Return empty structure on error
        return {
            success: false,
            data: {
                movie: { id: movieId } as Movie,
                similarMovies: [],
                similarityScore: 0
            },
            error: String(error)
        };
    }
}

export async function getMovieDetails(movieId: string): Promise<ApiResponse<Movie>> {
    try {
        const response = await fetch(`${API_BASE}/api/movie/${movieId}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Movie Details API Error:', error);
        return { success: false, data: {} as Movie, error: String(error) };
    }
}
