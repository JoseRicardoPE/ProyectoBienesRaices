//* Paquete interno de Node, retorna la ruta absoluta. Automáticamente dependiendo de si estamos en nuestra PC o en un servidor, va detectar la ruta absoluta y 
//* va a escribir en esa carpeta de public - js.
//* Nota: correr el script que fue previamente agregado en package.json en el objeto scripts para que compile. Comando: npm run js
//* Nota: el script también debe ser agregado en la vista correspondiente, en este caso en "create.pug"
//* Nota: El código que está en public js se agrega automáticamente	al momento de correr nuestro script.
//* Para correr varios script al tiempo y no tener varias terminales abiertas, instalamos npm i -D concurrently. Se ejecutarán las tareas de js y css o las vistas cuando hagamos cambios.
//* Esta config la hacemos en el package.json en el objeto scripts, agregando la dependencia "dev": "concurrently \"npm run css\" \"npm run js\" "
import path from "path";

export default {
    mode: "development",
    entry: {
        map: "./src/map.js",
        addImage: "./src/addImage.js",
        showMap: "./src/showMap.js",
    }, 
    output: {
        filename: "[name].js",
        path: path.resolve("public/js") 
    }
}