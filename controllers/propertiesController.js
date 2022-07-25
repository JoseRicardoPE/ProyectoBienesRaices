import { validationResult } from "express-validator";
import { Price, Category, Property } from "../models/index.js";

const admin = (req, res) => {
  res.render("properties/admin", {
    view: "Mis Propiedades",
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
      categories,
      prices,
      errors: result.array(),
      data: req.body,
    });
  }

  // * En caso de que no haya errores y la validación sea satisfactoria, creamos el registro en la base de datos.
  // console.log(req.body);
  const { title, description, strata, rooms, parking, toilet, street, lat, lng, price: priceId, category: categoryId } = req.body;

  // console.log(req.user.id);
  const { id: userId} = req.user;

  try {
    const propertySave = await Property.create({
      title,
      description,
      strata,
      rooms,
      parking,
      toilet,
      street,
      lat,
      lng,
      image: "",
      priceId,
      categoryId,
      userId
    }) 

    const { id } = propertySave;
    res.redirect(`/properties/add-image/${id}`);

  } catch (error) {
    console.log(error);
  }


};

const addImage = async (req, res) => {

  const { id } = req.params;

  //* Validar que la propiedad exista.
  const property = await Property.findByPk(id);

  if(!property) {
    return res.redirect("/properties")
  }

  //* Validar que la propiedad no esté publicada.


  //* Validar que la propiedad pertenece a quién visita esta página



  res.render("properties/addImage", {
    view: "Agregar imágen"
  });
};

export { admin, create, save, addImage };
