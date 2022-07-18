import { DataTypes } from "sequelize";
import db from "../config/db.js";


const Dato = db.define(
  "datos",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
);

export default Dato;