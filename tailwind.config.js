module.exports = {
  content: [
    "src/**/*.js",
    "src/**/*.ts",
    "src/**/*.jsx",
    "src/**/*.tsx",
    "components/**/*.jsx",
    "components/**/*.tsx",
    "pages/**/*.jsx",
    "pages/**/*.tsx",
  ],
  theme: {
    fontFamily: {
      "pt-serif": ["PT Serif", "serif"],
      montserrat: ["Montserrat", "sans-serif"],
    },
    backgroundSize: {
      auto: "auto",
      cover: "cover",
      contain: "contain",
      "100%": "100%",
    },
    extend: {
      colors: {
        secondary: "#F4F2ED",
        black: "black",
        white: "white",
      },
      backgroundImage: {
        underline1: "url('/images/Underline1.svg')",
        underline2: "url('/images/Underline2.svg')",
        underline3: "url('/images/Underline3.svg')",
        underline4: "url('/images/Underline4.svg')",
        highlight3: "url('/images/Highlight3.svg')",
      },
      keyframes: {
        "fade-in-down": {
          "0%": {
            opacity: "0",
            transform: "translateY(-10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
      },
      animation: {
        "fade-in-down": "fade-in-down 0.5s ease-out",
      },
    },
  },
};
