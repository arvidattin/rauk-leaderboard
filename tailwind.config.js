/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                "primary": "#1313ec",
                "background-light": "#f6f6f8",
                "background-dark": "#101022",
            },
            fontFamily: {
                "display": ["Inter", "sans-serif"]
            },
            borderRadius: { "DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px" },
            animation: {
                aurora: "aurora 60s linear infinite",
            },
            keyframes: {
                aurora: {
                    "from": {
                        backgroundPosition: "50% 50%, 50% 50%",
                    },
                    "to": {
                        backgroundPosition: "350% 50%, 350% 50%",
                    },
                },
            },
        },
    },
    plugins: [
        require("tailwindcss-animate"),
    ],
}
