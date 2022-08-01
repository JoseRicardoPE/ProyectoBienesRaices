// * Ojo: Este script se debe agregar al webpack.config, de lo contrario no va a funcionar.
// * Luego de agregar este archivo en webpack.config se detiene el compilador de tailwind
// * y js para que nos agregue el archivo showMap.js en public/js
(function () {
  // * Leemos los campos ocultos con la latitud y longitud
  const lat = document.querySelector("#lat").textContent;
  const lng = document.querySelector("#lng").textContent;
  const street = document.querySelector("#street").textContent;
  const title = document.querySelector("#title").textContent;

  // * Propiedad de leaflet (16 es el zoom para el mapa)
  const map = L.map("map").setView([lat, lng], 16);

  // * Este código lo copié de src/map.js
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // * Agregar el pin del mapa
  L.marker([lat, lng]).addTo(map).bindPopup(`${title}, ${street}`);
})();
