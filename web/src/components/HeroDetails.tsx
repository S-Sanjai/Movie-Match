import React from 'react';
import { Movie } from '../types';

interface HeroDetailsProps {
    movie: Movie | null;
}

export const HeroDetails: React.FC<HeroDetailsProps> = ({ movie }) => {
    if (!movie) return null;

    const year = movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : '';
    const genres = movie.genres ? movie.genres.join(' / ') : '';
    const match = movie.matchPercentage ?? 98; // Default mock match if missing

    return (
        <div className="w-full max-w-7xl mx-auto px-6 mt-8 mb-12 relative z-10">
            <div className="relative w-full aspect-[2/1] md:aspect-[2.5/1] rounded-3xl overflow-hidden shadow-2xl border border-white/5 bg-[#111]">
                {/* Backdrop Image */}
                {movie.backdropUrl ? (
                    <img
                        src={movie.backdropUrl}
                        alt={movie.title}
                        className="absolute inset-0 w-full h-full object-cover opacity-80"
                    />
                ) : (
                    // Fallback gradient if no backdrop
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-900/40 to-black" />
                )}

                {/* Gradient Overlay - Left and Bottom fade */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 p-8 md:p-15 flex flex-col justify-end max-w-3xl items-start">
                    <h1 className="text-4xl md:text-6xl font-bold font-poppins text-white mb-2 tracking-tight">
                        {movie.title}
                    </h1>

                    <div className="flex items-center space-x-4 text-sm md:text-base text-gray-300 font-source mb-6">
                        <span className="text-green-400 font-bold">{match}% MATCH</span>
                        <span>•</span>
                        <span>{year}</span>
                        <span>•</span>
                        <span>{genres}</span>
                    </div>

                    <p className="text-gray-300/90 text-sm md:text-base leading-relaxed font-work max-w-xl line-clamp-4 md:line-clamp-none">
                        {movie.overview}
                    </p>
                </div>

                {/* Decoration/Visual Flair - tiny silhouette (optional, hard to dynamic, skip or generic) */}
            </div>
        </div>
    );
};
