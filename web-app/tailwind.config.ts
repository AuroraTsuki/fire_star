import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#ee8c2b",
                "primary-light": "rgba(238, 140, 43, 0.1)",
                success: "#22eb33",
                "success-light": "rgba(34, 235, 51, 0.1)",
                info: "#3b82f6",
                "info-light": "rgba(59, 130, 246, 0.1)",
                secondary: "#2d9d78",
                "text-main": "#181411",
                "text-soft": "#897561",
                "text-light": "#a69282",
                "bg-main": "#f8f7f6",
                "bg-secondary": "#f3f4f6",
                "border-light": "#edeceb",
                white: "#ffffff",
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
                "gradient-primary": "linear-gradient(to right, #fb923c, #f472b6)",
            },
        },
    },
    plugins: [],
};
export default config;
