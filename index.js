//const express = require("express"); //?commonjs module
import express from "express"; //?ecmascript module (recommended)
import router from "./routes/routes.js";

// *Mando llamar la base de datos
import db from "./config/db.js";

const app = express();
const port = 3002;

// *Habilitar pug
app.set("view engine", "pug");
app.set("views", "./views");

// *Encontrar archivos estáticos (public)
app.use(express.static("public"));

// ?Habilitar lectura de datos de formularios
app.use(express.urlencoded({ extended: true })); //!si tiene bodyParser en vez de express, es solo cambiarlo

// *Middleware de express para múltiples rutas.
app.use("/", router);
app.use("/auth", router);

// *Conexión con la base de datos
try {
  await db.authenticate();
  //?sync crea las tablas en caso de que no estén creadas.
  db.sync();
  console.log("--------------------------------------------")
  console.log("Conexión establecida con la base de datos");
} catch (error) {
  console.log(error)
}

app.listen(port, () => {
  console.log(`http://localhost:3002 Server listening on port ${port}`);
});
