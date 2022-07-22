import { body } from "express-validator";
import express from "express";
import { admin, create, save } from "../controllers/propertiesController.js";

const router = express.Router();

//* Endpoints para usuarios logueados con éxito
router.get("/properties", admin);
router.get("/properties/create", create);
router.post("/properties/create",
  body("title").notEmpty().withMessage("¡El campo título es obligatorio!"),
  body("description").notEmpty().withMessage("¡El campo descripción es obligatorio!").isLength({max:300}).withMessage("¡La descripción debe tener máximo 300 carácteres!"),
  body("category").isNumeric().withMessage("¡Debes seleccionar una categoría antes de continuar!"),
  body("price").isNumeric().withMessage("¡Debes seleccionar un rango de precios antes de continuar!"),
  body("strata").isNumeric().withMessage("¡Debes seleccionar un estrato antes de continuar!"),
  body("rooms").isNumeric().withMessage("¡Debes seleccionar la cantidad de habitaciones antes de continuar!"),
  body("parking").isNumeric().withMessage("¡Debes seleccionar la cantidad de parqueaderos antes de continuar!"),
  body("toilet").isNumeric().withMessage("¡Debes seleccionar la cantidad de baños antes de continuar!"),
  body("lat").notEmpty().withMessage("¡Debes indicar la ubicación de tu propiedad en el mapa antes de continuar!"),
  save
);

export default router;

//* La librería de express-validator soporta validación del lado del routing como del controller
//* Pero los mensajes de error se muestran en el controller 