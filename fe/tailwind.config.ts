import type { Config } from "tailwindcss";
import scrollbarHide from "tailwind-scrollbar-hide";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [scrollbarHide],
};

export default config;
