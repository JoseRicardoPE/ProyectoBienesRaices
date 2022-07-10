import express from "express";
import { formLogin, formRegister, formResetPassword, registerUser } from "../controllers/userController.js";



const router = express.Router();

router.get("/", (req, res) => {
  res.json({ msg: "Endpoint o API .GET" });
});

router.post("/", (req, res) => {
  res.json({ msg: "Endpoint o API .POST" });
});

// ? Endpoints App Bienes raíces
router.get("/login", formLogin);
router.get("/register", formRegister);
router.post("/register", registerUser);
router.get("/reset-password", formResetPassword);



// ? Para englobar varias routas
// router
//   .route("/")
//   .get((req, res) => {
//     res.json({ msg: "route .get" });
//   })
//   .post((req, res) => {
//     res.json({ msg: "route .post" });
//   });

export default router;
