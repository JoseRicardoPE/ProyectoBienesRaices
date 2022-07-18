import express from "express";
import { admin, create } from "../controllers/propertiesController.js";

const router = express.Router();

//* Endpoints para usuarios logueados con éxito
router.get("/properties", admin);
router.get("/properties/create", create);

export default router;
