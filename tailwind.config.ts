import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Subtle Los Futbolitos lime nod
        "lf-lime": "#7CFC4D",
        // Marca brand
        "marca-yellow": "#FFE600",
        "marca-red": "#E30613",
        // YouTube clickbait
        "yt-yellow": "#FFE100",
        "yt-red": "#FF0000",
      },
      fontFamily: {
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Impact", "sans-serif"],
        stencil: ["var(--font-stencil)", "Impact", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
