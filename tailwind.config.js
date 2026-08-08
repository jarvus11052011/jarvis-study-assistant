/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        jarvis: {
          bg: "#0a0a0f",
          surface: "#12121a",
          card: "#1a1a2e",
          border: "#2a2a3e",
          primary: "#00d4ff",
          "primary-glow": "rgba(0, 212, 255, 0.3)",
          accent: "#7c3aed",
          "accent-glow": "rgba(124, 58, 237, 0.3)",
          success: "#10b981",
          warning: "#f59e0b",
          danger: "#ef4444",
          text: "#e2e8f0",
          "text-muted": "#94a3b8",
          "text-dim": "#64748b",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      animation: {
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        "orb-rotate": "orb-rotate 8s linear infinite",
        "fade-in": "fade-in 0.5s ease-out",
        "slide-up": "slide-up 0.4s ease-out",
        "slide-in-right": "slide-in-right 0.3s ease-out",
        "voice-pulse": "voice-pulse 1.5s ease-in-out infinite",
        "thinking-dot": "thinking-dot 1.4s ease-in-out infinite",
      },
      keyframes: {
        "pulse-glow": { "0%, 100%": { opacity: 1 }, "50%": { opacity: 0.5 } },
        "orb-rotate": { "0%": { transform: "rotate(0deg)" }, "100%": { transform: "rotate(360deg)" } },
        "fade-in": { "0%": { opacity: 0 }, "100%": { opacity: 1 } },
        "slide-up": { "0%": { opacity: 0, transform: "translateY(10px)" }, "100%": { opacity: 1, transform: "translateY(0)" } },
        "slide-in-right": { "0%": { opacity: 0, transform: "translateX(20px)" }, "100%": { opacity: 1, transform: "translateX(0)" } },
        "voice-pulse": { "0%, 100%": { transform: "scale(1)", opacity: 0.7 }, "50%": { transform: "scale(1.15)", opacity: 1 } },
        "thinking-dot": { "0%, 80%, 100%": { transform: "scale(0)" }, "40%": { transform: "scale(1)" } },
      },
    },
  },
  plugins: [],
};
