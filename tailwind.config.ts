import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        green: {
          primary: "#4ADE80",
          dim: "#2FB863",
        },
        cyan: {
          primary: "#38B6D9",
        },
        amber: {
          primary: "#E0A83E",
        },
        bg: {
          primary: "#080B0A",
          surface: "#0E1412",
          elevated: "#151D19",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
