import { validationResult } from "express-validator";
import Category from "../models/Category.js";
import Price from "../models/Price.js";

const admin = (req, res) => {
  res.render("properties/admin", {
    view: "Mis Propiedades",
    bar: true,
  });
};

// * Formulario para crear una nueva propiedad
const create = async (req, res) => {
  // * Consultar modelo de Price y Category
  const [categories, prices] = await Promise.all([
    Category.findAll(),
    Price.findAll(),
  ]);

  res.render("properties/create", {
    view: "Crear propiedad",
    csrfToken: req.csrfToken(),
    bar: true,
    categories,
    prices,
    data: {},
  });
};

const save = async (req, res) => {
  //* Acá muestro la validación que se hizo en el routing
  let result = validationResult(req);

  if (!result.isEmpty()) {
    const [categories, prices] = await Promise.all([
      Category.findAll(),
      Price.findAll(),
    ]);

    return res.render("properties/create", {
      view: "Crear propiedad",
      csrfToken: req.csrfToken(),
      bar: true,
      categories,
      prices,
      errors: result.array(),
      data: req.body,
    });
  }

  // * En caso de que no haya errores y la validación sea satisfactoria, creamos el registro.
  console.log(req.body);


};

export { admin, create, save };
