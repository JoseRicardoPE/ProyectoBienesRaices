const admin = (req, res) => {
  res.render("properties/admin", {
    view: "Mis Propiedades",
    bar: true,
  });
};

// * Formulario para crear una nueva propiedad
const create = (req, res) => {
  res.render("properties/create", {
    view: "Crear propiedad",
    bar: true,
  });
};

export { 
    admin,
    create,
};
