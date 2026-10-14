/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily : {
        // 'interFont' : [ 'Inter', 'sans-serif' ],
        // 'robotoFont' : [ 'Roboto', 'sans-serif' ],
        // 'openFont' : [ 'Open Sans', 'sans-serif' ],
        'kodeFont' : [ "Montserrat", "sans-serif"]
      },
    },
  },
  plugins: [],
}

