import { body, validationResult } from "express-validator";
import User from "../models/User.js";
import Swal from "sweetalert2";
import { generatorId } from "../helpers/tokens.js";
import { emailRegister} from "../helpers/emails.js";

const formLogin = (req, res) => {
  res.render("auth/login", {
    view: "Iniciar sesión",
  });
};

const formRegister = (req, res) => {
  res.render("auth/register", {
    view: "Crear cuenta",
  });
};

const registerUser = async (req, res) => {
  // console.log(req.body);

  const { name, email, password } = req.body;

  await body("name")
    .notEmpty()
    .withMessage("¡El campo nombre es obligatorio!")
    .run(req);

  await body("email")
    .isEmail()
    .withMessage("El campo email es obligatorio!")
    .run(req);

  await body("password")
    .notEmpty()
    .withMessage("El campo password es obligatorio!")
    .isLength({ min: 6, max: 16 })
    .withMessage("El campo password debe tener entre 6 y 16 carácteres!")
    .run(req);

  await body("confirmPassword")
    .notEmpty()
    .withMessage("El campo confirma tu password es obligatorio!")
    .custom((value, { req }) => {
      if (value !== password) {
        throw new Error("¡Las contraseñas no coinciden!");
      }
      return true;
    })
    .run(req);

  const result = validationResult(req);

  //* Verificar que el resultado esté vacío (si hay errores).
  //? Si result está vacío quiere decir que no hay ningún error y se puede agregar el usuario.
  if (!result.isEmpty()) {
    //? Si no está vacío hay errores
    return res.render("auth/register", {
      view: "crear cuenta",
      errors: result.array(),
      user: {
        name: req.body.name,
        email: req.body.email,
      },
    });
  }

  //* Verificar que el email del usuario no esté duplicado.
  const userExist = await User.findOne({ where: { email } });
  if (userExist) {
    return res.render("auth/register", {
      view: "crear cuenta",
      errors: [
        {
          msg: "La cuenta de correo que ha ingresado ya se encuentra registrada con otro usuario.",
        },
      ],
      user: {
        name: req.body.name,
        email: req.body.email,
      },
    });
  }

  // * Almacenar un nuevo usuario con su password hasheado y con un token. (El hook se creó en el schema User.js).
  const user = await User.create({
    name,
    email,
    password,
    token: generatorId(),
  });

  // * Enviar email de confirmación para el usuario
  emailRegister({
    name: user.name,
    email: user.email,
    token: user.token,
  })

  // * Mostrar mensaje de confirmación (Esta vista no se mostrará hasta que no se haya generado el usuario.)
  res.render("templates/message", {
    view: "Cuenta creada correctamente",
    message: "Hemos enviado un email de confirmación, ¡presiona en el enlace!",
  })
  
};

const formResetPassword = (req, res) => {
  res.render("auth/resetPass", {
    view: "Recupera tu contraseña a Bienes Raices",
  });
};

export { formLogin, formRegister, registerUser, formResetPassword };
