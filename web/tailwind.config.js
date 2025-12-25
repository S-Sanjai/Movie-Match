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
    plugins: [],
}
