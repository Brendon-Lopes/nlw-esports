/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.tsx',
    './index.html',
  ],
  theme: {
    extend: {
      backgroundImage: {
        galaxy: 'url(./background-galaxy.png)',
        'nlw-gradient': 'linear-gradient(89.86deg, #9572FC 20%, #43E7AD 60%, #E1D55D 20%)',
      }
    },
  },
  plugins: [],
}
