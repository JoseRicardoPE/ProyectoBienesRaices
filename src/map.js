// * Código requerido para mostrar un mapa. (Extraído de la documentación de leaflet).
(function () {
  const lat = 4.7519661;
  const lng = -74.091696;
  const map = L.map("map").setView([lat, lng], 15);
  let marker = "";

  //* Para obtener el nombre de la calle debemos utilizar Provider y Geocoder
  const geocodeService = L.esri.Geocoding.geocodeService();

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
  marker.on("moveend", function (e) {
    marker = e.target
    const position = marker.getLatLng();
    console.log(position);
    // * centrar el mapa cuando suelto el pin.
    map.panTo(new L.LatLng(position.lat, position.lng));

    // * Obtener información de las calles al soltar el pin
    geocodeService.reverse().latlng(position, 13).run(function(error, result) { 
      // return console.log(result)
      marker.bindPopup(result.address.LongLabel);

      // * Llenar los campos
      document.querySelector(".street").textContent = result?.address?.Address ?? "";
      document.querySelector("#street").textContent = result?.address?.Address ?? "";
      document.querySelector("#lat").textContent = result?.latlng?.lat ?? "";
      document.querySelector("#lng").textContent = result?.latlng?.lng ?? "";

    })
  })

})();
