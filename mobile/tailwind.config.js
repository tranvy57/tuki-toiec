/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,tsx}', './components/**/*.{js,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // === BRAND CORAL (gốc #ff776f) ===
        "brand-coral": {
          DEFAULT: "#ff776f",
          light: "#ff9b94",
          dark: "#e55a52",
          50:  "#fff5f4",
          100: "#ffe6e4",
          200: "#ffd1cd",
          300: "#ffb0a9",
          400: "#ff9b94",
          500: "#ff776f",
          600: "#e55a52",
          700: "#cc4a42",
          800: "#b03d36",
          900: "#94332c",
        },

        // Complementary
        teal: { DEFAULT: "#4fd1c7", light: "#81e6df", dark: "#38b2ac" },

        // Neutral (warm gray)
        "warm-gray": {
          50:  "#fafafa",
          100: "#f5f5f4",
          200: "#e7e5e4",
          300: "#d6d3d1",
          400: "#a8a29e",
          500: "#78716c",
          600: "#57534e",
          700: "#44403c",
          800: "#292524",
          900: "#1c1917",
        },

        // Semantic
        success: { DEFAULT: "#10b981", light: "#6ee7b7" },
        warning: { DEFAULT: "#f59e0b", light: "#fcd34d" },
        error:   { DEFAULT: "#ef4444", light: "#fca5a5" },
        info:    { DEFAULT: "#3b82f6", light: "#93c5fd" },

        // === App aliases (Light) ===
        primary:              "#ff776f",
        "primary-foreground": "#ffffff",
        background:           "#ffffff",
        foreground:           "#1c1917",
        card:                 "#ffffff",
        "card-foreground":    "#1c1917",
        popover:              "#ffffff",
        "popover-foreground": "#1c1917",
        secondary:            "#f5f5f4",
        "secondary-foreground":"#44403c",
        muted:                "#f5f5f4",
        "muted-foreground":   "#78716c",
        accent:               "#ffd1cd",
        "accent-foreground":  "#44403c",
        border:               "#e7e5e4",
        input:                "#ffffff",
        ring:                 "#ff776f",
        destructive:          "#ef4444",

        // === App aliases (Dark) – dùng với prefix `dark:` ===
        "primary-dark":              "#ff776f",
        "primary-foreground-dark":   "#ffffff",
        "background-dark":           "#1c1917",
        "foreground-dark":           "#fafafa",
        "card-dark":                 "#292524",
        "card-foreground-dark":      "#fafafa",
        "popover-dark":              "#292524",
        "popover-foreground-dark":   "#fafafa",
        "secondary-dark":            "#44403c",
        "secondary-foreground-dark": "#f5f5f4",
        "muted-dark":                "#44403c",
        "muted-foreground-dark":     "#a8a29e",
        "accent-dark":               "#57534e",
        "accent-foreground-dark":    "#f5f5f4",
        "border-dark":               "#44403c",
        "input-dark":                "#292524",
        "ring-dark":                 "#ff9b94",
      },

      // Radius (tương ứng --radius ~ 14px)
      borderRadius: {
        sm: "10px",  // radius - 4px
        md: "12px",  // radius - 2px
        lg: "14px",  // radius
        xl: "18px",  // radius + 4px
      },

      // Font
      fontFamily: {
        sans: ["Inter", "System"],
        mono: ["Menlo", "monospace"],
      },
    },
  },
  plugins: [],
};
