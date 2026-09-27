/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#070B17",
        surface: "#0A1020",
        panel: "#0D1425",
        "panel-hover": "#111A2E",
        text: "#F5F7FF",
        "text-secondary": "#9BA5BA",
        "text-muted": "#657087",
        primary: "#7C6CFF",
        "primary-light": "#9B8CFF",
        success: "#4ADE80",
        blue: "#60A5FA",
        warning: "#FB923C",
        danger: "#F472B6",
      },
    },
  },
  plugins: [],
}
