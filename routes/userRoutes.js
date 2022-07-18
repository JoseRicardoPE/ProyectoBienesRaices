import express from "express";
import {
  formLogin,
  userAuthentication,
  formRegister,
  registerUser,
  confirm,
  formResetPassword,
  resetPassword,
  confirmTokenUser,
  newPasswordUser,
} from "../controllers/userController.js";

const router = express.Router();

//* Endpoints App Bienes raíces:
//* Endpoints para login de usuarios
router.get("/login", formLogin);
router.post("/login", userAuthentication);

//* Endpoints para registrar un usuario nuevo
router.get("/register", formRegister);
router.post("/register", registerUser);

//* Endpoints para confirmar una cuenta de correo
router.get("/confirm/:token", confirm);

//* Endpoint para resetear el password
router.get("/reset-password", formResetPassword);
router.post("/reset-password", resetPassword);

//* Endpoint para almacenar el nuevo usuario:
router.get("/reset-password/:token", confirmTokenUser);
router.post("/reset-password/:token", newPasswordUser);

//*  Para englobar varias routas
// router
//   .route("/")
//   .get((req, res) => {
//     res.json({ msg: "route .get" });
//   })
//   .post((req, res) => {
//     res.json({ msg: "route .post" });
//   });

export default router;
