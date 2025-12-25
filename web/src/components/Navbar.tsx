import React from 'react';
import { GithubIcon, LinkedinIcon } from './Icons';

interface NavbarProps {
    onNavigateHome?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigateHome }) => {
    return (
        <nav className="fixed top-0 left-0 w-full flex flex-col items-center pt-3 pb-3 sm:pt-4 sm:pb-4 px-4 sm:px-6 z-50 bg-black/50 backdrop-blur-md border-b border-white/5 transition-all duration-300">
            <div className="w-full flex justify-between items-center max-w-7xl">
                <div className="text-2xl font-bold tracking-widest uppercase font-poppins opacity-0">Hidden</div> {/* Facade for alignment if needed, or just Absolute */}

                <h1
                    className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold tracking-[3px] sm:tracking-[5px] md:tracking-[7px] lg:tracking-[9px] hover:tracking-[4px] sm:hover:tracking-[6px] md:hover:tracking-[8px] lg:hover:tracking-[10px] uppercase font-poppins text-center absolute left-1/2 transform -translate-x-1/2 cursor-pointer hover:text-gray-300 transition-all duration-[1500ms] ease-out"
                    onClick={onNavigateHome}
                >
                    Movie Match
                </h1>

                <div className="flex gap-3 sm:gap-4 md:gap-5">
                    <a href="https://github.com/S-Sanjai" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition-colors">
                        <GithubIcon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                    </a>
                    <a href="https://linkedin.com/in/sanjai-s" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition-colors">
                        <LinkedinIcon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                    </a>
                </div>
            </div>
        </nav>
    );
};
