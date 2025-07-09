module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/components/generator/*.{ts,tsx}",
  ],
  safelist: [
    {
      pattern:
        /^(bg|text|from|to|via|border|fill|hover:bg|hover:text|hover:border)-(zinc|gray|neutral|slate|blue|indigo|emerald|rose|amber|lime|orange)-(50|100|200|300|400|500|600|700|800|900)$/,
    },
    {
      pattern: /^(font|rounded|shadow|p|py|px|m|gap)-.*/, // Optional: covers sizing/spacing/etc
    },
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
