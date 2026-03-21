import type { Config } from "tailwindcss";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "node-coral": "#FF6B6B",
        "node-orange": "#F59E0B",
        "node-green": "#10B981",
        "node-blue": "#3B82F6",
      },
    },
  },
  plugins: [],
} satisfies Config;
