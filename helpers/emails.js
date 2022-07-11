import nodemailer from "nodemailer";

// ? Vamos a tener dos email, uno para que el usuario confirme la cuenta.
// ? Otro para cuando al usuario se le olvide su password.

//* Primero inicia sesión
const emailRegister = async (data) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  //   console.log(data);

  //* Extraemos los datos que vienen del userController.js emailRegister.
  const { name, email, token } = data;

  //* Enviar el email (Gracias a transport.sendMail nos podemos autenticar en mailTrap)
  await transport.sendMail({
    from: "BienesRaices.com",
    to: email,
    subject: "Confirma tu cuenta en BienesRaices.com",
    text: "Confirma tu cuenta en BienesRaices.com",
    html: `
        <p>Hola ${name}, comprueba tu cuenta en BienesRaices.com</p>
        <p>Tu cuenta ya está lista, solo debes confirmarla en el siguiente enlace:
            <a href="${process.env.BACKEND_URL}:${
      process.env.PORT ?? 3002
    }/auth/confirm/${token}" target="_blank">Confirmar Cuenta</a>
        </p>

        <p>Si tú no creaste esta cuenta, puedes ignorar el mensaje.</p>
    `,
  });
};

const emailForgotPassword = async (data) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  //   console.log(data);

  //* Extraemos los datos que vienen del userController.js emailRegister.
  //* Mediante el token identificamos que usuario es el que quiere cambiar su password.
  const { name, email, token } = data;

  //* Enviar el email (Gracias a transport.sendMail nos podemos autenticar en mailTrap)
  await transport.sendMail({
    from: "BienesRaices.com",
    to: email,
    subject: "Restablece tu password en BienesRaices.com",
    text: "Restablece tu password en BienesRaices.com",
    html: `
        <p>Hola ${name}, has solicitado reestablecer tu password en BienesRaices.com</p>
        <p>Sigue el enlace para generar un nuevo password:
            <a href="${process.env.BACKEND_URL}:${
      process.env.PORT ?? 3002
    }/auth/reset-password/${token}" target="_blank">Reestablecer Password</a>
        </p>

        <p>Si tú no solicitaste el cambio de password, puedes ignorar el mensaje.</p>
    `,
  });
};

export { emailRegister, emailForgotPassword };
