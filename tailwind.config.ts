import type { Config } from "tailwindcss";
import { heroui } from "@heroui/react";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      dmsans: ['"DM Sans", sans-serif'],
      inter: ['"Inter", sans-serif'],
      roboto: ['"Roboto", sans-serif'],
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: "#08AA08",
          // 100: "",
          // 200: "",
          // 300: "",
        },
        background: "transparent",
      },
      backgroundImage: {
        "auth-bg": "red",
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
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
