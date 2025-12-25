import React from 'react';
import { MovieCard } from './MovieCard';
import { Movie } from '../types';

interface MovieGridProps {
    movies: Movie[];
    onSelectMovie: (movie: Movie) => void;
}

export const MovieGrid: React.FC<MovieGridProps> = ({ movies, onSelectMovie }) => {
    if (movies.length === 0) return null;

    return (
        <div className="w-full max-w-7xl mx-auto px-6 py-10 fade-in-section">
            <h2 className="text-2xl font-bold font-poppins tracking-[2px] mb-6">Recommended Movies</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} onClick={onSelectMovie} />
                ))}
            </div>
        </div>
    );
};
