import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        anton: ["var(--font-anton)"],
        bebas: ["var(--font-bebas)"],
        oswald: ["var(--font-oswald)"],
        pathway: ["var(--font-pathway)"],
        fjalla: ["var(--font-fjalla)"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        warning: "var(--warning)",
        danger: "var(--danger)",
      },
      keyframes: {
        float: {
          '0%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
          '100%': { transform: 'translateY(0)' }
        },
        floatReverse: {
          '0%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(12px)' },
          '100%': { transform: 'translateY(0)' }
        },
        floatRandom1: {
          '0%': { transform: 'translate(0,0)' },
          '25%': { transform: 'translate(12px,-8px)' },
          '50%': { transform: 'translate(0,-16px)' },
          '75%': { transform: 'translate(-12px,-8px)' },
          '100%': { transform: 'translate(0,0)' }
        },
        floatRandom2: {
          '0%': { transform: 'translate(0,0)' },
          '25%': { transform: 'translate(-10px,-6px)' },
          '50%': { transform: 'translate(0,-14px)' },
          '75%': { transform: 'translate(10px,-6px)' },
          '100%': { transform: 'translate(0,0)' }
        },
        floatRandom3: {
          '0%': { transform: 'translate(0,0)' },
          '25%': { transform: 'translate(8px,-10px)' },
          '50%': { transform: 'translate(0,-18px)' },
          '75%': { transform: 'translate(-8px,-10px)' },
          '100%': { transform: 'translate(0,0)' }
        },
        floatRandom4: {
          '0%': { transform: 'translate(0,0)' },
          '25%': { transform: 'translate(-8px,-12px)' },
          '50%': { transform: 'translate(0,-20px)' },
          '75%': { transform: 'translate(8px,-12px)' },
          '100%': { transform: 'translate(0,0)' }
        },
        pulseRing: {
          '0%': { transform: 'scale(0.9)', opacity: '0.6' },
          '70%': { transform: 'scale(1.2)', opacity: '0' },
          '100%': { transform: 'scale(1.2)', opacity: '0' }
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        smoke: {
          '0%': { transform: 'scale(0.8) translate(0, 0)', opacity: '0.8' },
          '100%': { transform: 'scale(2) translate(0, -80px)', opacity: '0' }
        },
        reveal: {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' }
        },
        pulseBorder: {
          '0%': { boxShadow: '0 0 0 0 rgba(120, 200, 65, 0.7)' },
          '70%': { boxShadow: '0 0 0 10px rgba(120, 200, 65, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(120, 200, 65, 0)' }
        }
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'float-medium': 'float 4.5s ease-in-out infinite',
        'float-slow-reverse': 'floatReverse 7s ease-in-out infinite',
        'float-medium-reverse': 'floatReverse 5s ease-in-out infinite',
        'float-random-1': 'floatRandom1 18s ease-in-out infinite',
        'float-random-2': 'floatRandom2 22s ease-in-out infinite',
        'float-random-3': 'floatRandom3 20s ease-in-out infinite',
        'float-random-4': 'floatRandom4 24s ease-in-out infinite',
        'pulse-ring': 'pulseRing 1.8s ease-out infinite',
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'smoke-1': 'smoke 2s ease-out infinite',
        'smoke-2': 'smoke 2.5s ease-out 0.3s infinite',
        'smoke-3': 'smoke 2.2s ease-out 0.6s infinite',
        'smoke-4': 'smoke 2.4s ease-out 0.9s infinite',
        'smoke-5': 'smoke 2.3s ease-out 1.2s infinite',
        'smoke-green-1': 'smoke 2.4s ease-out 0.2s infinite',
        'smoke-green-2': 'smoke 2.6s ease-out 0.5s infinite',
        'smoke-green-3': 'smoke 2.3s ease-out 0.8s infinite',
        'smoke-green-4': 'smoke 2.7s ease-out 1.1s infinite',
        'reveal': 'reveal 1.5s ease-out forwards',
        'shimmer': 'shimmer 2s infinite linear',
        'pulse-border': 'pulseBorder 2s infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite'
      }
    },
  },
  plugins: [],
};
export default config;
