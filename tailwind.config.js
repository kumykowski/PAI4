/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        baloonBlue: "#265BFF",
        logoBlue: "#2DACE3",
        logoYellow: "#FAC827",
      },
    },
  },
  plugins: [],
};
