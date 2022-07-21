import db from "../config/db.js";
import categories from "./categorySeeder.js";
import prices from "./priceSeeder.js";
import { Category, Price } from "../models/index.js"

const importData = async () => {
  try {
    //* Autenticar
    await db.authenticate();

    //* Crear columnas
    await db.sync();

    //* Insertar los datos
    //* bulkCreate inserta todos los datos
    await Category.bulkCreate(categories);
    await Price.bulkCreate(prices);
    console.log("¡Data imported successfully!");
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

// * exit(0) -> finaliza la ejecución con éxito.
// * exit(1) -> finaliza la ejecución pero encontró algún error.

const deleteData = async () => {
  try {
    // await Category.destroy({ where: {}, truncate: true });
    // await Price.destroy({ where: {}, truncate: true });
    await db.sync({ force: true });
    console.log("¡Data deleted succesfully!")
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

// * Primera manera para ejecutar los seeders:
// * Agrego esta línea en package.json scripts: ""db:import": "node ./seeders/seeder.js -i""
// * argv[2] argv son los datos que tengo en package.json "db:import"
// * en la posición 2 tengo -i
// * Ejecuto el script con npm run db:import
if (process.argv[2] === "-i") {
  importData();
}

// * Segunda manera:
// * En index.js importo el seeder y lo ejecuto ahí mismo

if (process.argv[2] === "-d") {
  deleteData();
}


export default importData;
