import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // background: "var(--background)",
        // foreground: "var(--foreground)",
        darkgreen: '#006400',
        lightpink: '#ffb6c1',
        beige: '#f5f5dc',
        black: '#000000',
        white: '#ffffff',
      },
    
    },
  },
  plugins: [],
} satisfies Config;
