import { body } from "express-validator";
import express from "express";
import { admin, create, save, addImage, postAddImage, edit, saveChanges } from "../controllers/propertiesController.js";
import protectedRoute from "../middlewares/protectedRoute.js";
import uploadFile from "../middlewares/uploadFiles.js";

const router = express.Router();

//* Endpoints para usuarios logueados con éxito
router.get("/properties", protectedRoute, admin);
router.get("/properties/create", protectedRoute, create);
router.post("/properties/create", protectedRoute,
  body("title").notEmpty().withMessage("¡El campo título es obligatorio!"),
  body("description").notEmpty().withMessage("¡El campo descripción es obligatorio!").isLength({max:300}).withMessage("¡La descripción debe tener máximo 300 carácteres!"),
  body("category").isNumeric().withMessage("¡Debes seleccionar una categoría antes de continuar!"),
  body("price").isNumeric().withMessage("¡Debes seleccionar un rango de precios antes de continuar!"),
  body("strata").isNumeric().withMessage("¡Debes seleccionar un estrato antes de continuar!"),
  body("rooms").isNumeric().withMessage("¡Debes seleccionar la cantidad de habitaciones antes de continuar!"),
  body("parking").isNumeric().withMessage("¡Debes seleccionar la cantidad de parqueaderos antes de continuar!"),
  body("toilet").isNumeric().withMessage("¡Debes seleccionar la cantidad de baños antes de continuar!"),
  // body("lat").notEmpty().withMessage("¡Debes indicar la ubicación de tu propiedad en el mapa antes de continuar!"),
  save
);

router.get("/properties/add-image/:id", protectedRoute, addImage);
router.post("/properties/add-image/:id", protectedRoute, uploadFile, postAddImage);

router.get("/properties/edit/:id", protectedRoute, edit);
router.post("/properties/edit/:id", protectedRoute,
  body("title").notEmpty().withMessage("¡El campo título es obligatorio!"),
  body("description").notEmpty().withMessage("¡El campo descripción es obligatorio!").isLength({max:300}).withMessage("¡La descripción debe tener máximo 300 carácteres!"),
  body("category").isNumeric().withMessage("¡Debes seleccionar una categoría antes de continuar!"),
  body("price").isNumeric().withMessage("¡Debes seleccionar un rango de precios antes de continuar!"),
  body("strata").isNumeric().withMessage("¡Debes seleccionar un estrato antes de continuar!"),
  body("rooms").isNumeric().withMessage("¡Debes seleccionar la cantidad de habitaciones antes de continuar!"),
  body("parking").isNumeric().withMessage("¡Debes seleccionar la cantidad de parqueaderos antes de continuar!"),
  body("toilet").isNumeric().withMessage("¡Debes seleccionar la cantidad de baños antes de continuar!"),
  // body("lat").notEmpty().withMessage("¡Debes indicar la ubicación de tu propiedad en el mapa antes de continuar!"),
  saveChanges
);

export default router;

//* La librería de express-validator soporta validación del lado del routing como del controller
//* Pero los mensajes de error se muestran en el controller 
//* .array("image"), ese campo lo debemos llamar igual tanto en el servidor como en el archivo de JS addImage.js para que 
//* se conecten y suba ahí la imagen. (paramName: "image")