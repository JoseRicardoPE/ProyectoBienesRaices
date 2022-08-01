/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/showMap.js":
/*!************************!*\
  !*** ./src/showMap.js ***!
  \************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n// * Ojo: Este script se debe agregar al webpack.config, de lo contrario no va a funcionar.\r\n// * Luego de agregar este archivo en webpack.config se detiene el compilador de tailwind\r\n// * y js para que nos agregue el archivo showMap.js en public/js\r\n(function () {\r\n  // * Leemos los campos ocultos con la latitud y longitud\r\n  const lat = document.querySelector(\"#lat\").textContent;\r\n  const lng = document.querySelector(\"#lng\").textContent;\r\n  const street = document.querySelector(\"#street\").textContent;\r\n  const title = document.querySelector(\"#title\").textContent;\r\n\r\n  // * Propiedad de leaflet (16 es el zoom para el mapa)\r\n  const map = L.map(\"map\").setView([lat, lng], 16);\r\n\r\n  // * Este código lo copié de src/map.js\r\n  L.tileLayer(\"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png\", {\r\n    attribution:\r\n      '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors',\r\n  }).addTo(map);\r\n\r\n  // * Agregar el pin del mapa\r\n  L.marker([lat, lng]).addTo(map).bindPopup(`${title}, ${street}`);\r\n})();\r\n\n\n//# sourceURL=webpack://BienesRaices/./src/showMap.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/showMap.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;