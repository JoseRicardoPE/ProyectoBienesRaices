import { DataTypes } from "sequelize";
import db from "../config/db.js";
import bcrypt from "bcrypt";

const User = db.define(
  "users",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING,
    },
    confirmm: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    hooks: {
      beforeCreate: async function (user) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      },
    },
    //* Los scopes sirven para eliminar determinados campos cuando se hace una consulta a un modelo en específico.
    scopes: {
      deletePassword: {
        attributes: {
          exclude: ["password", "token", "confirmm", "createdAt", "updatedAt"],
        },
      },
    },
  }
);

// * Métodos personalizados:
// * Método para Comprobar un password.
// * Lo estamos registrando por medio de prototype.
// * Un prototype contine las funciones que se pueden utilizar en ese tipo de objeto.
// * Tenemos un objeto de tipo User, y dentro de ese objeto le estamos registrando la función de verificar password.
// * De esta forma sólo los objetos de tipo User tendrán disponible esta función.
// * La función recibe un parámetro password, este se lo pasamos en el userController.js userAuthentication. this.password es la instancia declarada en nuestro schema User de la base de datos.
User.prototype.checkPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

export default User;
