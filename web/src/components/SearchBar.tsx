import React, { useState, useEffect, useRef } from 'react';
import { OrbInput } from './ui/animated-input';
import { searchMovies } from '../utils/api';
import { Movie } from '../types';

interface SearchBarProps {
    onSelectMovie: (movie: Movie) => void;
    compact?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSelectMovie, compact = false }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Movie[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const [originalQuery, setOriginalQuery] = useState('');
    const ignoreSearchTrigger = useRef(false);

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (ignoreSearchTrigger.current) {
                ignoreSearchTrigger.current = false;
                return;
            }

            if (query.trim()) {
                setLoading(true);
                const res = await searchMovies(query);
                if (res.success) {
                    setResults(res.data.results);
                    setIsOpen(true);
                }
                setLoading(false);
            } else {
                setResults([]);
                setIsOpen(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    // Click outside to close
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const [selectedIndex, setSelectedIndex] = useState(-1);

    useEffect(() => {
        // Reset selection when results change
        if (!ignoreSearchTrigger.current) {
            setSelectedIndex(-1);
        }
    }, [results]);

    const handleSelect = (movie: Movie) => {
        onSelectMovie(movie);
        setQuery('');
        setIsOpen(false);
        setSelectedIndex(-1);
    };

    const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            const newIndex = selectedIndex < results.length - 1 ? selectedIndex + 1 : selectedIndex;
            setSelectedIndex(newIndex);

            if (results[newIndex]) {
                ignoreSearchTrigger.current = true;
                setQuery(results[newIndex].title);
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            let newIndex = selectedIndex;
            if (selectedIndex > 0) {
                newIndex = selectedIndex - 1;
            } else if (selectedIndex === 0) {
                newIndex = -1;
            }

            setSelectedIndex(newIndex);

            ignoreSearchTrigger.current = true;
            if (newIndex === -1) {
                setQuery(originalQuery);
            } else if (results[newIndex]) {
                setQuery(results[newIndex].title);
            }
        } else if (e.key === 'Enter') {
            e.preventDefault(); // Prevent form submission if any
            if (selectedIndex >= 0 && results[selectedIndex]) {
                handleSelect(results[selectedIndex]);
                (e.target as HTMLInputElement).blur();
            } else if (results.length > 0) {
                // If nothing selected but results exist, select the first one (default behavior)
                handleSelect(results[0]);
                (e.target as HTMLInputElement).blur();
            } else if (query.trim()) {
                // Fallback search
                setLoading(true);
                const res = await searchMovies(query);
                setLoading(false);
                if (res.success && res.data.results.length > 0) {
                    handleSelect(res.data.results[0]);
                    (e.target as HTMLInputElement).blur();
                }
            }
        }
    };

    return (
        <div className="relative w-full max-w-xl mx-auto z-50" ref={wrapperRef}>
            <OrbInput
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    setOriginalQuery(e.target.value);
                    setSelectedIndex(-1);
                }}
                onKeyDown={handleKeyDown}
                onFocus={() => { if (results.length > 0) setIsOpen(true); }}
                compact={compact}
            />

            {isOpen && results.length > 0 && (
                <div className="absolute mt-2 w-full bg-[#111]/95 backdrop-blur-md rounded-xl shadow-2xl border border-white/10 overflow-hidden max-h-96 overflow-y-auto z-50">
                    {results.map((movie, index) => (
                        <div
                            key={movie.id}
                            className={`flex items-center p-3 cursor-pointer transition-colors border-b border-white/5 last:border-0 
                                ${index === selectedIndex ? 'bg-white/20' : 'hover:bg-white/10'}`}
                            onClick={() => handleSelect(movie)}
                            onMouseEnter={() => setSelectedIndex(index)} // Sync mouse hover with selection
                        >
                            {movie.posterUrl ? (
                                <img
                                    src={movie.posterUrl}
                                    alt={movie.title}
                                    className="w-10 h-14 object-cover rounded-md flex-shrink-0"
                                />
                            ) : (
                                <div className="w-10 h-14 bg-gray-800 rounded-md flex-shrink-0" />
                            )}
                            <div className="ml-3">
                                <div className="text-sm font-medium text-white">{movie.title}</div>
                                <div className="text-xs text-gray-400">
                                    {movie.releaseDate ? movie.releaseDate.split('-')[0] : 'N/A'}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
