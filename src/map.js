// * Código requerido para mostrar un mapa. (Extraído de la documentación de leaflet).
(function () {
  const lat = 4.7519661;
  const lng = -74.091696;
  const map = L.map("map").setView([lat, lng], 15);
  let marker = "";

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  //* El pin
  // * L contiene toda la información de leaflet.
  // * draggable para mover el pin.
  // * Para que a medida que muevo el pin, se vaya moviendo el mapa también.
  marker = new L.marker([lat, lng], {
    draggable: true,
    autoPan: true,
  }).addTo(map);

  //* Detectar el movimiento del pin y leer su latitud y longitud
  marker.on("locationfound", function (e) {
    console.log(marker)
    // marker = e.target
    // const position = marker.getLatLng();
    // console.log(position);
    // map.panTo(new L.LatLng(position.lat, position.lng));
  })

})();
