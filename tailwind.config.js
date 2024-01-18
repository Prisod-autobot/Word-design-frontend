/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    'node_modules/flowbite-react/lib/esm/**/*.js'
  ],
  theme: {
    theme: {
      screens: {
        sm: "320px",
        // => @media (min-width: 640px) { ... }

        md: "768px",
        // => @media (min-width: 768px) { ... }

        lg: "1024px",
        // => @media (min-width: 1024px) { ... }

        xl: "1280px",
        // => @media (min-width: 1280px) { ... }

        "2xl": "1536px",
        // => @media (min-width: 1536px) { ... }
      },
    },
    extend: {
      colors: {
        "green-tree": "#00dc82",
        "dim-gray": "#696969",
        "super-pink": "#ff0094",
        "creamy": "#FFF7D1",
        "lotion": "#FAFAFA",
        "campagne": "#F7E6D3",
        "white-gray": "#f8f8f8",
        "yellow-i": "#ffea00",
        "yellow-gra": "#efff8a"
      },
      backgroundImage: theme => ({
        'gradient-yellow-blue': 'linear-gradient(to top, #efff8a, #b0ffa4, #6ff9c7, #25efe8, #00e1ff)',
        'gradient-pink-blue': 'linear-gradient(to right, #6157FF, #EE49FD)',
        'gradient-black-white': 'linear-gradient(to right, #00dc82, #000)',
      }),
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
}
