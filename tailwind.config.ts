import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
  	extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
      },
      colors: {
        teal: {
          DEFAULT: "#1D9E75",
          light: "#ECFDF5",
          mid: "#A7F3D0",
          dark: "#065F46",
        },
        purple: {
          DEFAULT: "#534AB7",
          light: "#EEF2FF",
        },
        amber: {
          DEFAULT: "#EF9F27",
          light: "#FFFBEB",
          dark: "#92400E",
        },
        surface: {
          DEFAULT: "#F9FAFB",
          2: "#F3F4F6",
        },
        border: {
          DEFAULT: "hsl(var(--border))",
          subtle: "#F3F4F6",
        },
        text: {
          primary: "#030712",
          secondary: "#374151",
          muted: "#6B7280",
          faint: "#9CA3AF",
        },
        dark: {
          bg: "#030712",
          surface: "#0F172A",
          "surface-2": "#1E293B",
          border: "#334155",
          text: "#F8FAFC",
          muted: "#94A3B8",
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
      },
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		},
      keyframes: {
        'accordion-down': {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        'accordion-up': {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      }
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
