/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./resources/**/*.blade.php",
    "./resources/**/*.js",
    "./resources/**/*.jsx",
    "./resources/**/*.ts",
    "./resources/**/*.tsx",
  ],
  theme: {
    extend: {
      colors: {
        'lendarios-blue': '#0056b3',
        'lendarios-dark': '#1a1a1a',
      }
    },
  },
  plugins: [],
}
