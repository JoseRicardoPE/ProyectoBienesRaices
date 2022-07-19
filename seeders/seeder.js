import db from "../config/db.js";
import Category from "../models/Category.js";
import categories from "./categorySeeder.js";

const importData = async () => {
  try {

    //* Autenticar
    await db.authenticate()

    //* Crear columnas
    await db.sync()

    //* Insertar los datos
    //* bulkCreate inserta todos los datos
    await Category.bulkCreate(categories)
    console.log("¡Data imported successfully!")
    process.exit(0);

  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

// * exit(0) -> finaliza la ejecución con éxito.
// * exit(1) -> finaliza la ejecución pero encontró algún error.

