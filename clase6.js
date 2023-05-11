// Crear un servidor con el módulo nativo de nodejs:
// const http = require("http");
// Importación de express:
import express from "express";

// const server = http.createServer((req, res) => {
//   res.end("¡Mi primer hola mundo desde backend!");
// });
// server.listen(8080, () => {
//   console.log("Listening on port 8080");
// });

// Creación de la aplicación que contendrá todas las funcionalidades de express:
const app = express();

// el método get apertura un "endpoint" que le indica al protocolo http que en la ruta "/bienvenida" espera una petición de tipo GET. Si se llama a otra ruta u otro método, no lo reconocerá.
app.get("/bienvenida", (req, res) => {
  // el método send sirve para "responder" a la petición con el contenido de dentro.
  res.send(`<h1 style="color: blue;"> ¡Bienvenido a mi primer servidor express! </h1>`)
});

// Configuración del puerto: se levanta el puerto para escuchar la petición.
app.listen(8080, () => console.log("Listening on port 8080"));
// el segundo argumento es un callback que mostrará por consola el mensaje indicado, avisando que el servidor está levantado.