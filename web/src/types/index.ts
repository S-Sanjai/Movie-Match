export interface Movie {
    id: string;
    title: string;
    overview: string;
    genres: string[];
    posterUrl: string | null;
    backdropUrl: string | null;
    releaseDate: string | null;
    rating: number | null;
    matchPercentage?: number;
}

export interface SearchResult {
    query: string;
    results: Movie[];
    timestamp: number;
}

export interface RecommendationResult {
    movie: Movie;
    similarMovies: Movie[];
    similarityScore: number;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    error?: string;
}
