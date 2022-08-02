import { validationResult } from "express-validator";
import { Price, Category, Property } from "../models/index.js";
import { unlink } from "node:fs/promises";

const admin = async (req, res) => {
  const { id } = req.user;
  // console.log(id);

  // * Leer query string (Para hacer la paginación)
  // console.log(req.query.pagina);
  // * /^[0-9]$/  Es una expresión regular que valida que inicie con números y termine con números.
  const { page } = req.query;
  const regularExpression = /^[0-9]$/
  if(!regularExpression.test(page)) {
    return res.redirect("/properties?page=1");
  }

  const properties = await Property.findAll({
    where: { userId: id },
    include: [{ model: Category }, { model: Price }],
  });

  res.render("properties/admin", {
    view: "Mis Propiedades",
    csrfToken: req.csrfToken(),
    properties,
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
  const {
    title,
    description,
    strata,
    rooms,
    parking,
    toilet,
    street,
    lat,
    lng,
    price: priceId,
    category: categoryId,
  } = req.body;

  // console.log(req.user.id);
  const { id: userId } = req.user;

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
      userId,
    });

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

  if (!property) {
    return res.redirect("/properties");
  }

  //* Validar que la propiedad no esté publicada.
  //* Si está en 0 no ha sido publicada, 1 ya fue publicada, entonces retorna a /properties
  if (property.posted) {
    return res.redirect("/properties");
  }

  //* Validar que la propiedad publicada pertenece a quién visita esta página
  //* Para que el req.user esté disponible se debe llamar al middleware en la ruta.
  //* Como recomendación, al trabajar con id, al verificar con typeof muestra que es number, para
  //* eviar problemas lo mejor es convertirlos a string con .toString()
  //* En el ORM mongoose esto daría error, por eso es mejor pasarlos a string.
  // console.log(req.user);
  // console.log(typeof req.user.id.toString());
  // console.log(typeof property.userId.toString());

  if (req.user.id.toString() !== property.userId.toString()) {
    return res.redirect("/properties");
  }

  res.render("properties/addImage", {
    view: `Agregar imágen de ${property.title}`,
    csrfToken: req.csrfToken(),
    property,
  });
};

const postAddImage = async (req, res) => {
  // console.log("Subiendo imágen...");
  const { id } = req.params;

  //* Validar que la propiedad exista.
  const property = await Property.findByPk(id);

  if (!property) {
    return res.redirect("/properties");
  }

  //* Validar que la propiedad no esté publicada.
  //* Si está en 0 no ha sido publicada, 1 ya fue publicada, entonces retorna a /properties
  if (property.posted) {
    return res.redirect("/properties");
  }

  //* Validar que la propiedad publicada pertenece a quién visita esta página
  if (req.user.id.toString() !== property.userId.toString()) {
    return res.redirect("/properties");
  }

  //* Leer el archivo, para pasarlo al campo correspondiente de la base de datos (image) y
  //* cambiar el estado de publicado de 0 a 1 (posted)
  try {
    //* Almacenar la imagen y publicar propiedad
    //* req.file (para un archivo) req.files (para multiples archivos) lo registra multer
    //* para ver las propiedades de console debería pasar a autoProcessQueue: true
    console.log(req.file);

    property.image = req.file.filename;

    property.posted = 1;

    await property.save();

    res.redirect("/properties");
  } catch (error) {
    console.log(error);
  }
};

const edit = async (req, res) => {
  const { id } = req.params;

  // * Validar que la propiedad exista.
  const property = await Property.findByPk(id);

  //* En caso de que no haya una propiedad
  if (!property) {
    return res.redirect("/properties");
  }

  // * Revisar que quien visita la URL, es quien creó la propiedad.
  if (property.userId.toString() !== req.user.id.toString()) {
    return res.redirect("/properties");
  }

  // * Consultar modelo de Price y Category
  const [categories, prices] = await Promise.all([
    Category.findAll(),
    Price.findAll(),
  ]);

  res.render("properties/edit", {
    view: `Editar propiedad: ${property.title}`,
    csrfToken: req.csrfToken(),
    categories,
    prices,
    data: property, //* Le paso property y así puedo autollenar los campos del formulario de la vista edit.pug  Data es una instancia de lo que hay en la base de datos y lo uso en las view
  });
};

const saveChanges = async (req, res, next) => {
  //* Acá muestro la validación que se hizo en el routing
  //* Verificar la validación
  let result = validationResult(req);

  if (!result.isEmpty()) {
    const [categories, prices] = await Promise.all([
      Category.findAll(),
      Price.findAll(),
    ]);

    return res.render("properties/edit", {
      view: "Editar propiedad",
      csrfToken: req.csrfToken(),
      categories,
      prices,
      errors: result.array(),
      data: req.body, //* Se le pasa req.body porque es la última copia que se está actualizando, y esa es la que tiene el req.body
    });
  }

  // * Validar que la propiedad exista.
  const { id } = req.params;
  const property = await Property.findByPk(id);

  if (!property) {
    return res.redirect("/properties");
  }

  // * Revisar que quien visita la URL, es quien creó la propiedad.
  if (property.userId.toString() !== req.user.id.toString()) {
    return res.redirect("/properties");
  }

  // * Reescribir el objeto y actualizarlo en la base de datos
  try {
    // console.log(property);
    const {
      title,
      description,
      strata,
      rooms,
      parking,
      toilet,
      street,
      lat,
      lng,
      price: priceId,
      category: categoryId,
    } = req.body;

    property.set({
      title,
      description,
      strata,
      rooms,
      parking,
      toilet,
      street,
      lat,
      lng,
      priceId,
      categoryId,
    });

    // * Esto se va a setear en un objeto que se queda en memoria un rato, va a tener esta información, pero debemos almacenarlo en la base de datos.
    await property.save();

    res.redirect("/properties");
  } catch (error) {
    console.log(error); //* Para debugear errores
  }
};

const deletePost = async (req, res) => {
  // console.log("eliminando")
  const { id } = req.params;

  // * Validar que la propiedad exista.
  const property = await Property.findByPk(id);

  //* En caso de que no haya una propiedad
  if (!property) {
    return res.redirect("/properties");
  }

  // * Revisar que quien visita la URL, es quien creó la propiedad.
  if (property.userId.toString() !== req.user.id.toString()) {
    return res.redirect("/properties");
  }

  // * Eliminar la propiedad
  await property.destroy();
  res.redirect("/properties");

  // * Eliminar la imagen asociada a esa propiedad. (Porque de lo contrario se nos llena nuestro disco duro de imagenes que ya no están siendo utilizadas).
  // * Debemos importar una propiedad de Node.js que se llama unlink. (Desde la versión 11 de Node está disponible.)
  await unlink(`public/uploads/${property.image}`);
  console.log(`Se eliminó la imagen ${property.image}`);
};

// * Muestra una propiedad para usuarios no registrados. Es pública
const showProperty = async (req, res) => {
  // res.send("mostrando...")
  const { id } = req.params;

  // * Validar que la propiedad exista
  const property = await Property.findByPk(id, {
    include: [{ model: Category }, { model: Price }],
  });
  
  if(!property) {
    return res.redirect("/404");
  }

  res.render("properties/showProperties", {
    property,
    view: property.title
  })

};

export {
  admin,
  create,
  save,
  addImage,
  postAddImage,
  edit,
  saveChanges,
  deletePost,
  showProperty,
};
