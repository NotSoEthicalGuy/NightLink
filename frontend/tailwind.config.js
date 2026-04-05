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
                    DEFAULT: '#0f172a', // slate-900
                    50: '#f8fafc',
                    100: '#f1f5f9',
                    200: '#e2e8f0',
                    300: '#cbd5e1',
                    400: '#94a3b8',
                    500: '#64748b',
                    600: '#475569',
                    700: '#334155',
                    800: '#1e293b',
                    900: '#0f172a',
                    950: '#020617',
                },
                midnight: {
                    DEFAULT: '#09090b', // zinc-950 base
                    100: '#18181b', // zinc-900
                    200: '#27272a', // zinc-800
                    300: '#3f3f46', // zinc-700
                    accent: '#2e1065', // violet-950 (deep purple)
                },
                obsidian: '#000000',
                gold: {
                    DEFAULT: '#D4AF37', // Metallic Gold
                    light: '#F4C430',   // Saffron
                    dark: '#AA8C2C',    // Dark Gold
                    500: '#eab308',     // yellow-500 fallback
                },
                brand: {
                    primary: '#5D4AE0', // Purple/Blue - trustworthy, creative
                    accent: '#00D9FF', // Bright Cyan - energetic, nightlife
                    success: '#00C48C', // Green - positive action
                    dark: '#1A1A1A', // Nearly black
                    gray: '#666666', // Secondary text
                    light: '#FFFFFF', // White
                    offwhite: '#F7F7F7', // Subtle contrast
                },
                platinum: '#E5E4E2',
                border: 'rgba(255, 255, 255, 0.08)',
                glass: 'rgba(255, 255, 255, 0.03)',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Playfair Display', 'serif'], // Elegant serif for headings
                mono: ['JetBrains Mono', 'monospace'],
            },
            backgroundImage: {
                'lux-gradient': 'linear-gradient(135deg, #0f172a 0%, #020617 100%)',
                'gold-gradient': 'linear-gradient(135deg, #D4AF37 0%, #AA8C2C 100%)',
                'glass-gradient': 'linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.0) 100%)',
            },
            boxShadow: {
                'glow': '0 0 20px rgba(212, 175, 55, 0.15)',
                'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
            },
            animation: {
                'float': 'float 3s ease-in-out infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'shimmer': 'shimmer 2s linear infinite',
            },
            scale: {
                '102': '1.02',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-1000px 0' },
                    '100%': { backgroundPosition: '1000px 0' },
                },
            },
        },
    },
    plugins: [],
}
