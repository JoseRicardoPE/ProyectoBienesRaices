import jwt from "jsonwebtoken";

// * Vamos a generar un token de tipo id
// * Este token se enviará al usuario por email, y poder confirmar su cuenta.

const generatorId = () => Math.random().toString(32) + Date.now().toString(32);
    
//* Generador token JWT
const generateJWT = (data) => {
  return jwt.sign(
    {
      id: data.id,
      name: data.name,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
};

export { generatorId, generateJWT };
