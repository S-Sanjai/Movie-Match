import React, { useState, useEffect } from 'react';
import { SearchBar } from '../components/SearchBar';
import { Navbar } from '../components/Navbar';
import { HeroDetails } from '../components/HeroDetails';
import { MovieGrid } from '../components/MovieGrid';
import { ProjectDetails } from '../components/ProjectDetails';
import { getRecommendations } from '../utils/api';
import { Movie } from '../types';
import { ChevronDownIcon } from '../components/Icons';

interface ResultsPageProps {
    initialMovie: Movie | null;
    onSelectMovie: (movie: Movie) => void;
    onNavigateHome: () => void;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({ initialMovie, onSelectMovie, onNavigateHome }) => {
    const [currentMovie, setCurrentMovie] = useState<Movie | null>(initialMovie);
    const [recommendations, setRecommendations] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(false);

    // When initialMovie changes (from parent navigation or search), update local state and fetch fresh recs
    useEffect(() => {
        if (initialMovie) {
            handleMovieUpdate(initialMovie);
        }
    }, [initialMovie]);

    const handleMovieUpdate = async (movie: Movie) => {
        setLoading(true);
        setCurrentMovie(movie);

        // Fetch Recommendations based on the new movie
        // Note: We might want to avoid re-fetching if we already have them, 
        // but typically a new selection means new recommendations.
        const recRes = await getRecommendations(movie.id);
        if (recRes.success) {
            setCurrentMovie(recRes.data.movie);
            setRecommendations(recRes.data.similarMovies);
        }
        setLoading(false);

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Wrapper for the Navbar's search
    const handleSearchSelect = (movie: Movie) => {
        onSelectMovie(movie); // Notify parent (App) to update state if needed, or just handle here?
        // Actually, if App controls state, we should let App handle it. 
        // But for ResultsPage to be self-contained for "browsing", it needs to update itself.
        // Let's assume App passes the "view selection" down. 
        // If we want to stay on ResultsPage, we just cycle the content.
        // But we should propagate the change up so App knows the "current" movie if it switches views.
        handleMovieUpdate(movie);
    };

    return (
        <div className="min-h-screen relative bg-black text-white font-poppins selection:bg-orange-500/30 selection:text-orange-100">
            {currentMovie?.backdropUrl && (
                <div className="fixed inset-0 z-0">
                    <div className="absolute inset-0 bg-black/80 z-10" />
                    <img
                        src={currentMovie.backdropUrl}
                        className="w-full h-full object-cover blur-3xl opacity-30 scale-110"
                        alt=""
                    />
                </div>
            )}

            <div className="relative z-10 flex flex-col min-h-screen">
                <Navbar onNavigateHome={onNavigateHome} />

                <div className="flex-1 w-full max-w-[1920px] mx-auto flex flex-col pt-24">
                    {/* Search Bar - Moved here, below the navbar */}
                    <div className="w-full flex justify-center py-6 px-4 z-20 relative">
                        <div className="w-full max-w-xl">
                            <SearchBar onSelectMovie={handleSearchSelect} compact={true} />
                        </div>
                    </div>

                    <main className="flex-1 flex flex-col">
                        {loading && !currentMovie ? (
                            <div className="h-[60vh] flex items-center justify-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                            </div>
                        ) : (
                            <>
                                <HeroDetails movie={currentMovie} />
                                {/* Arrow was here, effectively removed */}
                                <div className="mb-8" />

                                <MovieGrid movies={recommendations} onSelectMovie={handleSearchSelect} />
                            </>
                        )}
                    </main>

                    <footer className="mt-auto">
                        <ProjectDetails />
                    </footer>
                </div>
            </div>
        </div>
    );
};
