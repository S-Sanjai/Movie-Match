import React from 'react';
import { GithubIcon, LinkedinIcon } from './Icons';
import { PixelCanvas } from './ui/pixel-canvas';

export const ProjectDetails = () => {
    return (
        <div className="w-full max-w-6xl mx-auto px-6 pb-20 pt-10">
            <div className="group relative bg-[#1a1a1a] rounded-xl p-8 border border-white/5 overflow-hidden font-source text-sm shadow-2xl">
                {/* Pixel Canvas Effect */}
                <PixelCanvas
                    gap={20}
                    speed={25}
                    colors={["#3f945eff", "#388655ff", "#15803d"]} // Green shades to match theme
                    variant="default"
                    className="opacity-30"
                />

                <div className="relative z-10">
                    <h2 className="text-2xl font-bold font-poppins text-white mb-2 tracking-[5px]">MOVIE MATCH</h2>
                    <p className="text-gray-400 text-xs mb-6 font-mono">Just a cool way to visualize a project in my Machine Learning journey</p>

                    <h3 className="text-green-500 font-bold tracking-wider uppercase text-xs mb-4">PROJECT OVERVIEW</h3>

                    <ul className="space-y-4 text-gray-300 text-xs md:text-sm leading-relaxed font-mono">
                        <li>
                            <span className="text-gray-500">-</span> Implemented <span className="text-white font-bold">scratch KNN</span> using <span className="text-white font-bold">cosine similarity</span> on sparse matrices to find top-k similar movies.
                        </li>
                        <li>
                            <span className="text-gray-500">-</span> Local CSV search with automatic <span className="text-white font-bold">TMDB API fallback</span> for missing movies and recommendations.
                        </li>
                        <li>
                            <span className="text-gray-500">-</span> Combined <span className="text-white font-bold">TF-IDF vectors</span> from movie overviews with <span className="text-white font-bold">multi-hot encoded</span> genres for hybrid feature representation.
                        </li>
                        <li>
                            <span className="text-gray-500">-</span> Monkeypatched socket with <span className="text-white font-bold">Google DNS (8.8.8.8)</span> to bypass ISP blocks for TMDB API access.
                        </li>
                        <li>
                            <span className="text-gray-500">-</span> <span className="text-white font-bold">FastAPI backend</span> with async endpoints and threadpool execution for TMDB API integration.
                        </li>
                    </ul>

                    <div className="mt-8 flex gap-6">
                        <a href="https://github.com/S-Sanjai" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white hover:text-green-400 transition-colors">
                            <GithubIcon className="w-5 h-5" />
                            <span className="text-xs font-mono">@github.com/S-Sanjai</span>
                        </a>
                        <a href="https://linkedin.com/in/sanjai-s" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white hover:text-green-400 transition-colors">
                            <LinkedinIcon className="w-5 h-5" />
                            <span className="text-xs font-mono">@linkedin.com/in/sanjai-s</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};
