import React from 'react';
import { Movie } from '../types';

interface MovieCardProps {
    movie: Movie;
    onClick: (movie: Movie) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick }) => {
    return (
        <div
            className="relative group cursor-pointer transition-transform duration-300 hover:scale-105 hover:z-10"
            onClick={() => onClick(movie)}
        >
            <div className="aspect-[2/3] rounded-2xl overflow-hidden shadow-lg border border-white/5 relative">
                {movie.posterUrl ? (
                    <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-80"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                        <span className="text-gray-400 text-sm">No Image</span>
                    </div>
                )}

                {/* Overlay Title - appearing on hover or always visible? 
            Design shows overlay text on the posters for 'Dune Part Two' etc. 
            Actually, the design shows the text IS the logo on the poster for Dune/Blade Runner, 
            but for others it might differ.
            For safety, let's add a subtle gradient overlay with title at bottom on hover. 
        */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 sm:p-4">
                    <h3 className="text-white font-bold text-sm sm:text-base md:text-lg leading-tight">{movie.title}</h3>
                    <p className="text-gray-300 text-xs mt-1">
                        {movie.releaseDate ? movie.releaseDate.split('-')[0] : ''}
                    </p>
                </div>
            </div>
        </div>
    );
};
