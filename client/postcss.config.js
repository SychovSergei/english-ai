/** @type {import('tailwindcss').Config} */
module.exports = {
  plugins: {
    'postcss-import': {},
    tailwindcss: { config: './tailwind.config.js' },
    autoprefixer: {},
  }
}

