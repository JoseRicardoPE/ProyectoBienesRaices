import { body, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import Swal from "sweetalert2";
import { generatorId, generateJWT } from "../helpers/tokens.js";
import { emailRegister, emailForgotPassword } from "../helpers/emails.js";

const formLogin = (req, res) => {
  res.render("auth/login", {
    view: "Iniciar sesión",
    csrfToken: req.csrfToken(),
  });
};

//* Debemos verificar que el usuario exista en la bd, después verificar que el password coincida con el del usuario.o0
const userAuthentication = async (req, res) => {
  // console.log("autenticando...")

  // * Primero validamos los campos del formulario de login:
  await body("email")
    .notEmpty()
    .withMessage("El campo email es obligatorio!")
    .isEmail()
    .withMessage("¡Eso no parece un email!")
    .run(req);

  await body("password")
    .notEmpty()
    .withMessage("El campo password es obligatorio!")
    .run(req);

  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.render("auth/login", {
      view: "Iniciar sesión",
      csrfToken: req.csrfToken(),
      errors: result.array(),
    });
  }

  // * Segundo, comprobamos si el usuario existe en la base de datos:
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.render("auth/login", {
      view: "Iniciar sesión",
      csrfToken: req.csrfToken(),
      errors: [
        {
          msg: "¡El usuario no se encuentra registrado en nuestra base de datos!",
        },
      ],
    });
  }

  // * Tercero, comprobar si el usuario ha confirmado su cuenta. (Se registraron pero nunca visitaron el enlace para confirmar su cuenta de registro).
  if (!user.confirmm) {
    return res.render("auth/login", {
      view: "Iniciar sesión",
      csrfToken: req.csrfToken(),
      errors: [
        {
          msg: "Este usuario se encuentra registrado en nuestra base de datos, pero nunca confirmó su cuenta de registro.",
        },
      ],
    });
  }

  // * Cuarto, validación del password.
  // * checkPassword es el prototype que declaramos en User.js, este prototype recibe un parámetro de tipo password.
  // * Si retorna false significa que el password es incorrecto.
  if (!user.checkPassword(password)) {
    return res.render("auth/login", {
      view: "Iniciar sesión",
      csrfToken: req.csrfToken(),
      errors: [
        {
          msg: "El password es incorrecto",
        },
      ],
    });
  }

  // * Quinto, autenticar al usuario. (Usando JWT)
  const token = generateJWT( { id: user.id, name: user.name} )
  console.log(token);
};

const formRegister = (req, res) => {
  //console.log(req.csrfToken()); //* función csrfToken es exclusiva de csurf.

  res.render("auth/register", {
    view: "Crear cuenta",
    csrfToken: req.csrfToken(), //* Se renderiza el token de csurf y se manda como parte del form, y lo compara con la llave privada que está registrada dentro de nuestra aplicación.
    //* Lo debo copiar y pegar en la función de registrar usuario y confirmar email también para que no mande error.
  });
};

const registerUser = async (req, res) => {
  // console.log(req.body);

  const { name, email, password } = req.body;

  //* Validaciones para el formulario de registrar usuario con librería express-validator.
  await body("name")
    .notEmpty()
    .withMessage("¡El campo nombre es obligatorio!")
    .run(req);

  await body("email")
    .notEmpty()
    .withMessage("El campo email es obligatorio!")
    .isEmail()
    .withMessage("¡Eso no parece un email!")
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

  //* Verificar que el resultado esté vacío (Ese result se muestra en un arreglo, por lo que es posible iterarlo).
  //* Si result está vacío quiere decir que no hay ningún error y se puede agregar el usuario.
  //* Si no está vacío hay errores
  if (!result.isEmpty()) {
    return res.render("auth/register", {
      view: "crear cuenta",
      csrfToken: req.csrfToken(),
      errors: result.array(),
      user: {
        name: req.body.name,
        email: req.body.email,
      },
    });
  }

  //* Verificar que el email que el usuario está registrando no exista en la bd.
  const userEmailExist = await User.findOne({ where: { email } });
  if (userEmailExist) {
    return res.render("auth/register", {
      view: "crear cuenta",
      csrfToken: req.csrfToken(),
      errors: [
        {
          msg: "La cuenta de correo que ha ingresado ya se encuentra registrada con otro usuario.", //* msg es la misma propiedad que imprime result.array();
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

  // * Mostrar mensaje de confirmación (Esta vista no se mostrará hasta que no se haya generado el usuario.)
  res.render("templates/message", {
    view: "Cuenta creada correctamente",
    message: "Hemos enviado un email de confirmación, ¡presiona en el enlace!",
  });

  // * Enviar email de confirmación para el usuario (Usamos librería nodemailer y para la simulación de envío de mensajes se usó mailtrap).
  emailRegister({
    name: user.name,
    email: user.email,
    token: user.token,
  });
};

// *Función que confirma o comprueba una cuenta de correo
const confirm = async (req, res) => {
  const { token } = req.params;
  // console.log(token);

  // *Con la constante token vamos a verificar si el token es válido (Verificar si hay un usuario que tenga ese token).
  const tokenUser = await User.findOne({ where: { token } });
  // console.log(tokenUser)

  if (!tokenUser) {
    return res.render("auth/confirmAccount", {
      view: "¡Error al confirmar tu cuenta!",
      message: "¡Hubo un error al confirmar tu cuenta. ¡Intenta de nuevo!",
      error: true, //*error lo paso en la vista confirmAccount
    });
  }

  // *Confirmar la cuenta (Modificamos tokenUser, lo cambiamos).
  tokenUser.token = null; //*Eliminamos el token de la db. (Es de un solo uso).
  tokenUser.confirmm = true; //*En el schema se declaró como boolean
  await tokenUser.save(); //*guardamos esos cambios en la db.

  res.render("auth/confirmAccount", {
    view: "¡Cuenta confirmada!",
    message: "¡La cuenta ha sido verificada satisfactoriamente!",
  });

  // console.log(tokenUser);
  // console.log(tokenUser.token);
};

//* Para cambiar la contraseña vamos a generar un token nuevo y le enviamos un email al usuario que ha solicitado el reestablecimiento de password.
const formResetPassword = async (req, res) => {
  res.render("auth/forgotPassword", {
    view: "Recupera tu contraseña a Bienes Raices",
    csrfToken: req.csrfToken(),
  });
};

//* resetPassword solo validará el email para identificar que persona quiere resetear su contraseña.
const resetPassword = async (req, res) => {
  const { email } = req.body;

  //* Validamos el campo de email
  await body("email")
    .notEmpty()
    .withMessage("¡El campo email es obligatorio!")
    .isEmail()
    .withMessage("¡Eso no parece un email!")
    .run(req);

  const result = validationResult(req);

  if (!result.isEmpty()) {
    //* Si encuentra errores
    return res.render("auth/forgotPassword", {
      view: "Recupera tu contraseña a Bienes Raices",
      csrfToken: req.csrfToken(),
      errors: result.array(),
    });
  }

  //* En caso de que si sea un email correcto tenemos que buscar al usuario.
  //* Si el usuario existe, debemos generar un nuevo token y enviar un email.
  //* Cada vez que el usuario solicite reestablecimiento de password se generará un nuevo token en la bd.
  //* En caso de que el usuario no exista, renderizamos un mensaje indicando que no se encontró un usuario con esa cuenta.
  const userEmail = await User.findOne({ where: { email } });
  // console.log(userEmail);

  //* Si el usuario no está registrado en la bd.
  if (!userEmail) {
    return res.render("auth/forgotPassword", {
      view: "Recupera tu contraseña a Bienes Raices",
      csrfToken: req.csrfToken(),
      errors: [
        {
          msg: "La cuenta de email que ha ingresado no se encuentra asociada a un usuario registrado en nuestra Base de Datos. ¡Inténtelo de nuevo!",
        },
      ],
    });
  }

  //* Generar un token y enviar el email para que el usuario pueda cambiar la contraseña.
  userEmail.token = generatorId();
  await userEmail.save();

  //* Enviar un email al usuario
  //* emailForgotPassword viene del helper email.js
  emailForgotPassword({
    email: userEmail.email,
    name: userEmail.name,
    token: userEmail.token,
  });

  //* Renderizar un mensaje que le diga al usuario que siga las instrucciones para resetear su password.
  res.render("templates/message", {
    view: "Reestablece tu password",
    message: "Hemos enviado un email con las instrucciones",
  });
};

//* Validar token desde la URL de "/reset-password".
//* Identificar quién es la persona que desea modificar su password.
const confirmTokenUser = async (req, res) => {
  const { token } = req.params;

  const userToken = await User.findOne({ where: { token } });
  // console.log(user)
  // * Mostramos mensaje en caso de que el token del usuario no sea válido:
  if (!userToken) {
    return res.render("auth/confirmAccount", {
      view: "Reestablece tu password",
      message: "Hubo un error al validar tu información, ¡Inténtalo de nuevo!",
      error: true,
    });
  }

  // * En caso de que el token del usuario sea válido, mostramos un formulario para modificar el password:
  res.render("auth/resetPassword", {
    view: "Reestablece tu password",
    csrfToken: req.csrfToken(),
  });
};

// * Almacenando el nuevo password:
const newPasswordUser = async (req, res) => {
  // console.log("Guardando password")

  const { token } = req.params;
  const { password } = req.body;

  // * Validar el password
  await body("password")
    .notEmpty()
    .withMessage("¡El campo password es obligatorio!")
    .isLength({ min: 6, max: 16 })
    .withMessage("¡El campo password debe tener entre 6 y 16 carácteres!")
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

  //* Verificar que el resultado esté vacío (Ese result se muestra en un arreglo, por lo que es posible iterarlo).
  //* Si result está vacío quiere decir que no hay ningún error y se puede agregar el usuario.
  //* Si no está vacío hay errores
  if (!result.isEmpty()) {
    return res.render("auth/resetPassword", {
      view: "Reestablece tu password",
      csrfToken: req.csrfToken(),
      errors: result.array(),
    });
  }

  // * Identificar el usuario que hace el cambio
  const user = await User.findOne({ where: { token } });
  // console.log(user)

  // * Hashear el nuevo password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);
  user.token = null;

  await user.save();

  res.render("auth/confirmAccount", {
    view: "Password reestablecido",
    message: "¡El password se guardó satisfactoriamente!",
  });
};

export {
  formLogin,
  userAuthentication,
  formRegister,
  registerUser,
  confirm,
  formResetPassword,
  resetPassword,
  confirmTokenUser,
  newPasswordUser,
};
