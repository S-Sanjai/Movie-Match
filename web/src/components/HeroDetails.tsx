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
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 mt-4 sm:mt-6 md:mt-8 mb-8 sm:mb-10 md:mb-12 relative z-10">
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
                <div className="absolute inset-0 p-4 sm:p-6 md:p-8 lg:p-12 xl:p-15 flex flex-col justify-end max-w-3xl items-start">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold font-poppins text-white mb-2 tracking-tight">
                        {movie.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-1 text-xs sm:text-sm md:text-base text-gray-300 font-source mb-4 sm:mb-5 md:mb-6">
                        <span className="text-green-400 font-bold text-sm sm:text-base">{match}% MATCH</span>
                        <span>•</span>
                        <span>{year}</span>
                        <span>•</span>
                        <span>{genres}</span>
                    </div>

                    <p className="text-gray-300/90 text-xs sm:text-sm md:text-base leading-relaxed font-work max-w-xl line-clamp-3 sm:line-clamp-4 md:line-clamp-none">
                        {movie.overview}
                    </p>
                </div>

                {/* Decoration/Visual Flair - tiny silhouette (optional, hard to dynamic, skip or generic) */}
            </div>
        </div>
    );
};
