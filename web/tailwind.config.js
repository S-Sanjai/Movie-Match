/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                poppins: ['Poppins', 'sans-serif'],
                source: ['"Source Code Pro"', 'monospace'],
                work: ['"Work Sans"', 'sans-serif'],
                souliyo: ['"Souliyo Unicode"', 'sans-serif'],
            },
            colors: {
                background: '#000000',
                foreground: '#ffffff',
            }
        },
    },
    plugins: [
        function ({ addUtilities }) {
            const newUtilities = {
                '.scrollbar-thin': {
                    'scrollbar-width': 'thin',
                },
                '.scrollbar-thumb-white\\/20': {
                    'scrollbar-color': 'rgba(255, 255, 255, 0.2) transparent',
                },
                '.scrollbar-track-transparent': {
                    'scrollbar-color': 'rgba(255, 255, 255, 0.2) transparent',
                },
                '.hover\\:scrollbar-thumb-white\\/30:hover': {
                    'scrollbar-color': 'rgba(255, 255, 255, 0.3) transparent',
                },
            }
            addUtilities(newUtilities)
        },
    ],
}
