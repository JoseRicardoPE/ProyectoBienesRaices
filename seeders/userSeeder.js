import bcrypt from "bcrypt"

const users = [
    {
        name: "John",
        email: "john@correo.com",
        password: bcrypt.hashSync("password", 10),
        confirmm: 1
    }
];

export default users;