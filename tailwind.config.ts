import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: "#0a1128",
          800: "#0f1b3d",
          700: "#162252",
        },
        status: {
          normal: "#22c55e",
          warning: "#f59e0b",
          critical: "#ef4444",
          offline: "#6b7280",
        },
        accent: {
          cyan: "#00e5ff",
          blue: "#00bcd4",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      backdropBlur: {
        glass: "16px",
      },
    },
  },
  plugins: [],
};

export default config;
