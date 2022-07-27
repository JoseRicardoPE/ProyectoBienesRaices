//* Primero se instala npm i multer
//* Luego creo el middleware para subir las imágenes
//* cb -> callback, si se ejecuta es porque todo salió bien.
//* importo de helpers token.js generatorId para que cuando el usuario suba una imagen se renombre con un id único y
//* no tener nombres repetidos.
//* path.extname() es para respetar la extensión con la que se subió la imágen.
//* file.originalname-> por ejemplo el usuario sube la imagen asdf.jpg con extname solo retorna .jpg y generatorId le asigna su id único.
//* Cuando usemos el middleware uploadFiles, se va utilizar multer pero con la configuración que le pasamos en storage.
//* Luego vamos a propertiesRoutes.js y utilizamos este middleware uploadFiles.
//* En la ruta le paso .single si es para subir solo una imagen, si son varias le indico .array
//* .array("images") es el parámetro, se lo indico en addImage.js

import multer from "multer";
import path from "path";
import { generatorId } from "../helpers/tokens.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, generatorId() + path.extname(file.originalname));
  },
});

const upload = multer({ storage }).single("image");

export default upload;
