import { body } from "express-validator";
import express from "express";
import { admin, create, save } from "../controllers/propertiesController.js";

const router = express.Router();

//* Endpoints para usuarios logueados con éxito
router.get("/properties", admin);
router.get("/properties/create", create);
router.post("/properties/create",
  body("title").notEmpty().withMessage("¡El campo título es obligatorio!"),
  save
);

export default router;

//* La librería de express-validator soporta validación del lado del routing como del controller
//* Pero los mensajes de error los muestro en el controller 