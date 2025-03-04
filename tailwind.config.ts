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
        "hero-bg": "url(/images/bg/hero-bg.jpg)",
        "about-us-bg": "url(/images/bg/about-us.jpg)",
        "contact-us-bg": "url(/images/bg/contact-bg.jpg)",
        "contact-us-bg-2": "url(/images/bg/contact-bg-2.jpg)",
        "blog-bg": "url(/images/bg/blog-bg.jpg)",
        "search-bg": "url(/images/bg/search.jpg)",
      },
      screens: {
        sm: "576px", // Small - ≥576px
        md: "768px", // Medium - ≥768px
        lg: "992px", // Large - ≥992px
        xl: "1200px", // X-Large - ≥1200px
        xxl: "1400px", // XX-Large - ≥1400px
      },
      container: {
        screens: {
          sm: "540px", // Bootstrap's container-sm max-width
          md: "720px", // Bootstrap's container-md max-width
          lg: "960px", // Bootstrap's container-lg max-width
          xl: "1140px", // Bootstrap's container-xl max-width
          xxl: "1320px",
        },
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
