import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      dmsans: ['"DM Sans", sans-serif'],
      inter: ['"Inter", sans-serif'],
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: "#9dc900",
          // 100: "",
          // 200: "",
          // 300: "",
        },
        background: "red",
      },
      backgroundImage: {
        "auth-bg": "red",
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            background: "white",
          },
        },
        dark: {
          colors: {
            background: "#222327",
          },
        },
      },
    }),
  ],
};
export default config;
