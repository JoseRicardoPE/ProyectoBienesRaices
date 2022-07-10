/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.pug"], //!archivos que contienen el css para que tailwindcss los escanee, lea que clases tienen, y así, generar un archivo con esas clases.
  theme: {
    extend: {},
  },
  plugins: [],
}
