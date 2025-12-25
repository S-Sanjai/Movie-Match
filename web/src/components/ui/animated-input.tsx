"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"

interface OrbInputProps {
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onFocus?: () => void;
    onBlur?: () => void;
    compact?: boolean;
}

export function OrbInput({ value, onChange, onKeyDown, onFocus, onBlur, compact = false }: OrbInputProps) {
    const [internalValue, setInternalValue] = useState("")
    const [isFocused, setIsFocused] = useState(false)
    const [placeholderIndex, setPlaceholderIndex] = useState(0)
    const [displayedText, setDisplayedText] = useState("")
    const [isTyping, setIsTyping] = useState(true)

    // Use props if provided, otherwise internal state
    const controlled = value !== undefined;
    const val = controlled ? value : internalValue;
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (onChange) onChange(e);
        if (!controlled) setInternalValue(e.target.value);
    }
    const handleFocus = () => {
        setIsFocused(true);
        if (onFocus) onFocus();
    }
    const handleBlur = () => {
        setIsFocused(false);
        if (onBlur) onBlur();
    }

    // Keep the placeholders stable across renders
    const placeholders = useMemo(
        () => [
            "Interstellar",
            "Inception",
            "The Dark Knight",
            "Pulp Fiction",
            "Fight Club",
        ],
        []
    )

    // Config: tweak the animation to taste
    const CHAR_DELAY = 75 // ms between characters while typing
    const IDLE_DELAY_AFTER_FINISH = 2200 // ms to wait after a full sentence is shown

    // Refs to hold active timers so they can be cleaned up
    const intervalRef = useRef<number | null>(null)
    const timeoutRef = useRef<number | null>(null)

    useEffect(() => {
        // clear any stale timers (helps with StrictMode double-invoke in dev)
        if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
        }
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
            timeoutRef.current = null
        }

        const current = placeholders[placeholderIndex]
        if (!current) {
            setDisplayedText("")
            setIsTyping(false)
            return
        }

        const chars = Array.from(current)

        // reset state for a new round
        setDisplayedText("")
        setIsTyping(true)

        let charIndex = 0

        // type character-by-character using a derived slice to avoid any chance of appending undefined
        intervalRef.current = window.setInterval(() => {
            if (charIndex < chars.length) {
                const next = chars.slice(0, charIndex + 1).join("")
                setDisplayedText(next)
                charIndex += 1
            } else {
                if (intervalRef.current) {
                    clearInterval(intervalRef.current)
                    intervalRef.current = null
                }
                setIsTyping(false)

                // after a brief pause, advance to the next placeholder
                timeoutRef.current = window.setTimeout(() => {
                    setPlaceholderIndex((prev) => (prev + 1) % placeholders.length)
                }, IDLE_DELAY_AFTER_FINISH)
            }
        }, CHAR_DELAY)

        // Cleanup on unmount or when placeholderIndex changes
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
                intervalRef.current = null
            }
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
                timeoutRef.current = null
            }
        }
    }, [placeholderIndex, placeholders])

    const [suggestions, setSuggestions] = useState<string[]>([
        "Inception", "Interstellar", "The Dark Knight", "Pulp Fiction", "Fight Club",
        "The Matrix", "Forrest Gump", "Goodfellas", "The Shawshank Redemption", "Gladiator"
    ]);

    useEffect(() => {
        const fetchTrending = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/trending');
                const result = await response.json();
                if (result.success && result.data && result.data.length > 0) {
                    setSuggestions(result.data);
                }
            } catch (error) {
                console.error("Failed to fetch trending movies:", error);
            }
        };
        fetchTrending();
    }, []);

    const inputRef = useRef<HTMLInputElement>(null);

    const handleOrbClick = () => {
        const randomMovie = suggestions[Math.floor(Math.random() * suggestions.length)];

        // Create synthetic event to trigger onChange
        const syntheticEvent = {
            target: { value: randomMovie }
        } as React.ChangeEvent<HTMLInputElement>;

        if (onChange) onChange(syntheticEvent);
        if (!controlled) setInternalValue(randomMovie);

        // Focus the input so the user can immediately press Enter and move cursor to end
        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.focus();
                // Move cursor to the end
                const length = randomMovie.length;
                inputRef.current.setSelectionRange(length, length);
            }
        }, 0);
    };

    return (
        <div className="relative">
            <div
                className={`flex items-center ${compact ? 'gap-2 p-2' : 'gap-3 p-2 md:p-3'} bg-black transition-all duration-500 ease-out rounded-full border-[0.5px] border-transparent 
                shadow-[0_0_15px_rgba(255,255,255,0.1)] 
                hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-[1.01]`}
            >
                <div className="relative flex-shrink-0">
                    <div
                        onClick={handleOrbClick}
                        className={`${compact ? 'w-7 h-7' : 'w-8 h-8 md:w-10 md:h-10'} rounded-full overflow-hidden transition-all duration-300 scale-100 hover:scale-125 cursor-pointer active:scale-95`}
                    >
                        <img
                            src="/Movie-Match/orb.gif"
                            alt="Animated orb"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>



                <div className="flex-1 w-full md:w-[500px]">
                    <input
                        ref={inputRef}
                        data-testid="orb-input"
                        type="text"
                        value={val}
                        onChange={handleChange}
                        onKeyDown={onKeyDown}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        placeholder={`${displayedText}${isTyping ? "|" : ""}`}
                        aria-label="Ask a question"
                        className={`w-full ${compact ? 'text-sm' : 'text-sm md:text-base'} text-white placeholder-gray-400 bg-transparent border-none outline-none font-light`}
                    />
                </div>
            </div>
        </div>
    )
}

export default OrbInput
