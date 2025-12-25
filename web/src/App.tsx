import { useState } from 'react';
import { HomePage } from './pages/HomePage';
import { ResultsPage } from './pages/ResultsPage';
import { Movie } from './types';

type ViewState = 'home' | 'results';

function App() {
    const [view, setView] = useState<ViewState>('home');
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

    const handleMovieSelect = (movie: Movie) => {
        setSelectedMovie(movie);
        setView('results');
        // Scroll to top when switching views
        window.scrollTo({ top: 0, behavior: 'instant' });
    };

    const handleNavigateHome = () => {
        setSelectedMovie(null);
        setView('home');
        window.scrollTo({ top: 0, behavior: 'instant' });
    };

    return (
        <>
            {view === 'home' ? (
                <HomePage onSelectMovie={handleMovieSelect} />
            ) : (
                <ResultsPage
                    initialMovie={selectedMovie}
                    onSelectMovie={handleMovieSelect}
                    onNavigateHome={handleNavigateHome}
                />
            )}
        </>
    );
}

export default App;
