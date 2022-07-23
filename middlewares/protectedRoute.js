import jwt from "jsonwebtoken";

const protectedRouteAdmin = async (req, res, next) => {
  // * Verificar si hay un token.
  const { _token } = req.cookies;
  if (!_token) {
    return res.redirect("/auth/login");
  }

  // * Comprobar el token
  try {
    const decoded = jwt.verify(_token, process.env.JWT_SECRET);
    console.log(decoded);
  } catch (error) {
    return res.clearCookie("_token").redirect("/auth/login");
  }

  next();
};

export default protectedRouteAdmin;