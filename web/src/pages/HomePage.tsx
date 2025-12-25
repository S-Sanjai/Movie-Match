import React, { useState, useEffect } from 'react';
import { SearchBar } from '../components/SearchBar';
import { GithubIcon, LinkedinIcon, ChevronDownIcon } from '../components/Icons';
import { ProjectDetails } from '../components/ProjectDetails';
import { Movie } from '../types';

interface HomePageProps {
    onSelectMovie: (movie: Movie) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onSelectMovie }) => {
    const [isScrolled, setIsScrolled] = useState(false);

    const [animateTitle, setAnimateTitle] = useState(false);

    useEffect(() => {
        setAnimateTitle(true);

        const handleScroll = () => {
            // Simple threshold: if scrolled more than 100px, consider it "scrolled" enough to flip 
            // OR specifically when we are near the bottom. 
            // The user said "once i click the arrow it scrolls down and the arrow goes up".
            // Let's toggle based on being past the viewport height roughly.
            if (window.scrollY > window.innerHeight / 2) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleArrowClick = () => {
        if (isScrolled) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            document.getElementById('project-details')?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen relative bg-black text-white font-poppins selection:bg-orange-500/30 selection:text-orange-100 flex flex-col">

            {/* Top Right Icons */}
            <div className="absolute top-8 right-8 flex gap-6 z-20">
                <a href="https://github.com/S-Sanjai" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition-colors">
                    <GithubIcon className="w-8 h-8" />
                </a>
                <a href="https://linkedin.com/in/sanjai-s" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition-colors">
                    <LinkedinIcon className="w-8 h-8" />
                </a>
            </div>

            {/* Center Content - Full Screen */}
            <div className="h-screen w-full flex flex-col items-center justify-center px-4 relative z-10">
                {/* Title */}
                <h1
                    className={`text-6xl md:text-8xl font-bold mb-4 text-center font-poppins transition-all duration-[1500ms] ease-out 
                        ${animateTitle ? 'tracking-[9px] hover:tracking-[10px] cursor-default' : 'tracking-[0px] opacity-0 translate-y-4'}`}
                    style={{
                        opacity: animateTitle ? 1 : 0,
                        transform: animateTitle ? 'translateY(0)' : 'translateY(20px)'
                    }}
                >
                    MOVIE MATCH
                </h1>

                {/* Subtitle */}
                <p className="text-gray-400 font-mono text-sm md:text-base mb-16 text-center w-full">
                    Just a cool way to Visualize a project in my Machine Learning journey
                </p>

                {/* Search Bar */}
                <div className="w-full max-w-xl relative">
                    <SearchBar onSelectMovie={onSelectMovie} />
                </div>
            </div>

            {/* Chevron Indicator - Fixed at bottom */}
            <div
                className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 animate-bounce opacity-50 cursor-pointer hover:opacity-100 transition-all duration-500"
                onClick={handleArrowClick}
            >
                <div className={`transform transition-transform duration-500 ${isScrolled ? 'rotate-180' : 'rotate-0'}`}>
                    <ChevronDownIcon className="w-10 h-10" />
                </div>
            </div>

            {/* Footer Content - Below the fold */}
            <div className="w-full pb-10 bg-black" id="project-details">
                <div className="max-w-6xl mx-auto px-6 py-20">
                    <ProjectDetails />
                </div>
            </div>
        </div>
    );
};
