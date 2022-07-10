// ? Vamos a generar un token de tipo id

const generatorId = () => Math.random().toString(32) + Date.now().toString(32);

export {
    generatorId,
}