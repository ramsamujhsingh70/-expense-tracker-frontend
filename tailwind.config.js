module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      animation: {
        glow: "glow 2.5s ease-in-out infinite",
      },
      keyframes: {
        glow: {
          "0%, 100%": { textShadow: "0 0 5px #f87171" },
          "50%": { textShadow: "0 0 20px #f87171" },
        },
      },
    },
  },
  plugins: [],
};
