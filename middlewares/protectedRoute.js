import jwt from "jsonwebtoken";
import { User } from "../models/index.js";

const protectedRouteAdmin = async (req, res, next) => {
  // * Verificar si hay un token.
  const { _token } = req.cookies;
  if (!_token) {
    return res.redirect("/auth/login");
  }

  // * Comprobar el token
  try {
    const decoded = jwt.verify(_token, process.env.JWT_SECRET);
    const user = await User.scope("deletePassword").findByPk(decoded.id);

    console.log(decoded);
    console.log(user);

    // * Almacenar el usuario al request (Estará disponible en diferentes rutas).
    if (user) {
      req.user = user;
    } else {
      return res.redirect("/auth/login");
    }

    return next();
    
  } catch (error) {
    return res.clearCookie("_token").redirect("/auth/login");
  }
};

export default protectedRouteAdmin;
