import { Dropzone } from "dropzone";

//* Necesario para quitar el error de validación del csrf.
//* Tener en cuenta que primero se creó la etiqueta meta con sus atributos name y content en addImage.pug
//* Ahora agrego headers y le paso el csrf-Token.
//* Ahora ya es posible subir la imágen porque cuando visita el sitio confirma el token
const token = document.querySelector("meta[name='csrf-token']").getAttribute("content");
// console.log(token);

//* con dict se puede cambiar texto de inglés a español:
//* .image es el id que le asigné al form en la vista addImage.pug
//* maxFilesize es el tamaño de la imágen.
//* Por lo general maxFiles (cantidad de imágenes que se pueden subir) y parallelUploads se dejan igual.
//* autoProcessQueue va subir las imágenes al servidor automáticamente, al dejarlo en false, las imágenes se suben hasta que el usuario presione el botón.
//* addRemoveLinks en true permite eliminar la imágen.
//* Headers: Se envían antes de la petición, antes del cuerpo del request.
Dropzone.options.image = {
    dictDefaultMessage: "¡Sube tus imágenes aquí!",
    acceptedFiles: ".png, .jpg, .jpeg, .gif",
    maxFilesize: 10,
    maxFiles: 5,
    parallelUploads: 5, 
    autoProcessQueue: false,
    addRemoveLinks: true,
    dictRemoveFile: "¡Eliminar imágen!",
    dictMaxFilesExceeded: "¡La cantidad de archivos que puedes subir es de 5!",
    headers: {
        "csrf-token": token,
    },
    paramName: "image", 
    init: function(){
        const dropzone = this;
        const btnPost = document.querySelector("#post");

        btnPost.addEventListener("click", function(){
            dropzone.processQueue();
        });

        //* Para re-direccionar a mis propiedades
        dropzone.on("queuecomplete", (file, message) => {
            if(dropzone.getActiveFiles().length === 0) {
                window.location.href = "/properties"
            }
        })
    }
}

