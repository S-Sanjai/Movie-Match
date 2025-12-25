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
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-10 fade-in-section">
            <h2 className="text-xl sm:text-2xl font-bold font-poppins tracking-[2px] mb-4 sm:mb-5 md:mb-6">Recommended Movies</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
                {movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} onClick={onSelectMovie} />
                ))}
            </div>
        </div>
    );
};
