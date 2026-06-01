/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'var(--font-noto-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'var(--font-noto-serif)', 'Georgia', 'serif'],
      },
      colors: {
        primary: '#1a1a1a',
        accent: '#c9a96e',
      },
    },
  },
  plugins: [],
};
