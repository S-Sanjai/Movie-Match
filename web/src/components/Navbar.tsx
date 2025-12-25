import React from 'react';
import { GithubIcon, LinkedinIcon } from './Icons';

interface NavbarProps {
    onNavigateHome?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigateHome }) => {
    return (
        <nav className="fixed top-0 left-0 w-full flex flex-col items-center pt-4 pb-4 px-6 z-50 bg-black/50 backdrop-blur-md border-b border-white/5 transition-all duration-300">
            <div className="w-full flex justify-between items-center max-w-7xl">
                <div className="text-2xl font-bold tracking-widest uppercase font-poppins opacity-0">Hidden</div> {/* Facade for alignment if needed, or just Absolute */}

                <h1
                    className="text-2xl md:text-3xl font-bold tracking-[9px] hover:tracking-[10px] uppercase font-poppins text-center absolute left-1/2 transform -translate-x-1/2 cursor-pointer hover:text-gray-300 transition-all duration-[1500ms] ease-out"
                    onClick={onNavigateHome}
                >
                    Movie Match
                </h1>

                <div className="flex gap-5">
                    <a href="https://github.com/S-Sanjai" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition-colors">
                        <GithubIcon className="w-8 h-8" />
                    </a>
                    <a href="https://linkedin.com/in/sanjai-s" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition-colors">
                        <LinkedinIcon className="w-8 h-8" />
                    </a>
                </div>
            </div>
        </nav>
    );
};
