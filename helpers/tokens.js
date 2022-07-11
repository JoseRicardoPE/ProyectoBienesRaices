// ? Vamos a generar un token de tipo id
// ? Este token se enviará al usuario por email, y poder confirmar su cuenta.

const generatorId = () => Math.random().toString(32) + Date.now().toString(32);

export {
    generatorId,
}