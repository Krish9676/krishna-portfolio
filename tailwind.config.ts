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
          primary: "#178A47",
          dim: "#146F3A",
        },
        cyan: {
          primary: "#0C7E9C",
        },
        amber: {
          primary: "#C48412",
        },
        bg: {
          primary: "#F4F7F4",
          surface: "#FFFFFF",
          elevated: "#E8F0EB",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
