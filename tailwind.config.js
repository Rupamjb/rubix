module.exports = {
  content: ["./pages/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        base: "#f3f3f1",
      },
      boxShadow: {
        // figma-style multi-layer shadows
        glass: "0 8px 24px rgba(0,0,0,.12), 0 2px 8px rgba(0,0,0,.06)",
      },
      backdropBlur: { xl: "20px" },
    },
  },
  plugins: [],
};
