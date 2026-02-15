/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#2C5F2D',
                    light: '#97BC62',
                    dark: '#1A3A1B',
                },
                accent: {
                    DEFAULT: '#D4A574',
                    light: '#E8C9A0',
                    dark: '#B8844F',
                },
                background: {
                    DEFAULT: '#FDFBF7',
                    alt: '#F5F1E8',
                },
                surface: '#FFFFFF',
                text: {
                    DEFAULT: '#2A2A2A',
                    light: '#6B6B6B',
                    muted: '#9A9A9A',
                },
                border: '#E8E3D6',
                error: '#C84C3C',
                success: '#4A7C59',
                warning: '#D4A574',
            },
            fontFamily: {
                display: ['Playfair Display', 'serif'],
                body: ['Work Sans', 'sans-serif'],
            },
            borderRadius: {
                'sm': '4px',
                'md': '8px',
                'lg': '16px',
                'full': '999px',
            },
            boxShadow: {
                'sm': '0 2px 8px rgba(42, 42, 42, 0.08)',
                'md': '0 4px 16px rgba(42, 42, 42, 0.12)',
                'lg': '0 8px 32px rgba(42, 42, 42, 0.16)',
            },
            animation: {
                'fade-in': 'fadeIn 0.6s ease forwards',
                'slide-in': 'slideIn 0.6s ease forwards',
                'scale-in': 'scaleIn 0.4s ease forwards',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideIn: {
                    '0%': { opacity: '0', transform: 'translateX(-20px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                scaleIn: {
                    '0%': { opacity: '0', transform: 'scale(0.95)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
            },
        },
    },
    plugins: [],
}