import React from 'react';

export const SearchIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
    </svg>
);

export const GithubIcon = ({ className }: { className?: string }) => (
    <svg
        width="30"
        height="30"
        viewBox="0 0 30 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <g clipPath="url(#clip0_github)">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.0124 0C6.71094 0 0 6.76041 0 15.124C0 21.8094 4.29993 27.4685 10.2651 29.4714C11.0109 29.622 11.284 29.146 11.284 28.7456C11.284 28.395 11.2595 27.1931 11.2595 25.9409C7.08337 26.8425 6.21374 24.138 6.21374 24.138C5.54261 22.3853 4.54822 21.9348 4.54822 21.9348C3.18139 21.0083 4.64778 21.0083 4.64778 21.0083C6.16396 21.1085 6.95953 22.5607 6.95953 22.5607C8.30148 24.8642 10.4639 24.2133 11.3338 23.8126C11.458 22.836 11.8559 22.16 12.2784 21.7845C8.94771 21.4339 5.44336 20.1319 5.44336 14.3225C5.44336 12.6699 6.0395 11.3178 6.98412 10.2663C6.83508 9.89079 6.31299 8.33804 7.13346 6.25983C7.13346 6.25983 8.40104 5.85912 11.2592 7.81227C12.4828 7.48121 13.7448 7.3128 15.0124 7.31138C16.28 7.31138 17.5721 7.48685 18.7654 7.81227C21.6238 5.85912 22.8914 6.25983 22.8914 6.25983C23.7118 8.33804 23.1894 9.89079 23.0404 10.2663C24.0099 11.3178 24.5815 12.6699 24.5815 14.3225C24.5815 20.1319 21.0771 21.4087 17.7215 21.7845C18.2685 22.2602 18.7405 23.1615 18.7405 24.5888C18.7405 26.617 18.7159 28.2447 18.7159 28.7453C18.7159 29.146 18.9894 29.622 19.7349 29.4717C25.7 27.4682 29.9999 21.8094 29.9999 15.124C30.0245 6.76041 23.289 0 15.0124 0Z"
                fill="currentColor"
            />
        </g>
        <defs>
            <clipPath id="clip0_github">
                <rect width="30" height="30" fill="white" />
            </clipPath>
        </defs>
    </svg>
);

export const LinkedinIcon = ({ className }: { className?: string }) => (
    <svg
        width="30"
        height="30"
        viewBox="0 0 30 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <g clipPath="url(#clip0_linkedin)">
            <path
                d="M27.7793 0H2.21484C0.990234 0 0 0.966797 0 2.16211V27.832C0 29.0273 0.990234 30 2.21484 30H27.7793C29.0039 30 30 29.0273 30 27.8379V2.16211C30 0.966797 29.0039 0 27.7793 0ZM8.90039 25.5645H4.44727V11.2441H8.90039V25.5645ZM6.67383 9.29297C5.24414 9.29297 4.08984 8.13867 4.08984 6.71484C4.08984 5.29102 5.24414 4.13672 6.67383 4.13672C8.09766 4.13672 9.25195 5.29102 9.25195 6.71484C9.25195 8.13281 8.09766 9.29297 6.67383 9.29297ZM25.5645 25.5645H21.1172V18.6035C21.1172 16.9453 21.0879 14.8066 18.8027 14.8066C16.4883 14.8066 16.1367 16.6172 16.1367 18.4863V25.5645H11.6953V11.2441H15.9609V13.2012H16.0195C16.6113 12.0762 18.0645 10.8867 20.2266 10.8867C24.7324 10.8867 25.5645 13.8516 25.5645 17.707V25.5645V25.5645Z"
                fill="currentColor"
            />
        </g>
        <defs>
            <clipPath id="clip0_linkedin">
                <rect width="30" height="30" fill="white" />
            </clipPath>
        </defs>
    </svg>
);

export const ChevronDownIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="m6 9 6 6 6-6" />
    </svg>
);
