//const express = require("express"); //?commonjs module
import express from "express"; //?ecmascript module (recommended)
import router from "./routes/routes.js";
import csrf from "csurf";
import cookieParser from "cookie-parser";

// *Mando llamar la base de datos
import db from "./config/db.js";

const app = express();

// *Habilitar pug
app.set("view engine", "pug");
app.set("views", "./views");

// *Encontrar archivos estáticos (public)
app.use(express.static("public"));

// ?Habilitar lectura de datos de formularios
app.use(express.urlencoded({ extended: true })); //!si tiene bodyParser en vez de express, es solo cambiarlo

// ?Habilitar cookieParser (Lo requier csurf para funcionar correctamente).
app.use(cookieParser());

// ?Habilitar CSRF
app.use(csrf({cookie: true}));

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

const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log(`http://localhost:3002 Server listening on port ${port}`);
});
