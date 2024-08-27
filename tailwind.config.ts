import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        'soft-beige': 'var(--soft-beige)',
        'warm-grey': 'var(--warm-grey)',
        'off-white': 'var(--off-white)',
        'deep-forest-green': 'var(--deep-forest-green)',
        'muted-mustard': 'var(--muted-mustard)',
        'soft-coral': 'var(--soft-coral)',
        'sandy-brown': 'var(--sandy-brown)',
        'terracotta': 'var(--terracotta)',
        'clay': 'var(--clay)',
        'sky-blue': 'var(--sky-blue)',
        'slate-blue': 'var(--slate-blue)',
        'teal': 'var(--teal)',
        'primary': 'var(--primary-color)',
        'primary-opa': 'var(--primary-color-opacity)',
        'secondary': 'var(--secondary-color)',
        'terziary': 'var(--terziary-color)',
  
      },
    },
  },
  plugins: [require('daisyui')],
};

export default config;
