import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pink: {
          light: "#fce4ec",
          DEFAULT: "#f8bbd0",
          mid: "#f48fb1",
          dark: "#ec407a",
          deep: "#c2185b",
        },
        gold: {
          light: "#f0d9b5",
          DEFAULT: "#d4a574",
          shine: "#ffd700",
        },
        cream: "#fef9f4",
        rose: "#e8a0bf",
        lavender: "#d5b8ff",
      },
      fontFamily: {
        script: ["Dancing Script", "cursive"],
        display: ["Playfair Display", "serif"],
        body: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
