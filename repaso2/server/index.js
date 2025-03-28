//Funcionalidad
// Cliente A envía un mensaje con fetch("/mensajes", { method: "POST" }).
// Cliente B obtiene los mensajes con fetch("/mensajes").
// Ambos clientes reciben mensajes en tiempo real con Socket.io.

const express = require("express");
const path = require("path");
const { Server } = require("socket.io");
const { createServer } = require("http");

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  // westa es una instancia de Socket.io en nuestro servidor
  path: "/rea-time",
  cors: {
    origin: "*",
  },
});

app.use(express.json());
// Servir archivos estáticos desde la carpeta "public"
app.use("/app1", express.static(path.join(__dirname, "app1")));
app.use("/app2", express.static(path.join(__dirname, "app2")));

let mensajes = []; // [{ usuario, mensaje }]

app.get("/mensajes", (req, res) => {
    res.json(mensajes);
});

app.post("/mensajes", (req, res) => {
    const { usuario, mensaje } = req.body;
    if (!usuario || !mensaje) return res.status(400).json({ error: "Faltan datos" });

    const nuevoMensaje = { usuario, mensaje };
    mensajes.push(nuevoMensaje);

    io.emit("nuevoMensaje", nuevoMensaje); // Notifica a los clientes
    res.json({ mensaje: "Mensaje enviado" });
});

io.on("connection", (socket) => {
    console.log("Cliente conectado");
    socket.emit("cargarMensajes", mensajes); // Enviar historial al conectar

    socket.on("disconnect", () => {
        console.log("Cliente desconectado");
    });
});

// let users = [];

// app.get("/users", (req, res) => {
//   res.send(users);
// });

// io.on("connection", (socket) => {
//   socket.on("coordenadas", (data) => {
//     console.log(data);
//     io.emit("coordenadas", data);
//   });
//   socket.on("notificar-a-todos", (data) => {});
// });

httpServer.listen(7000, () => {
  console.log("Servidor en http://localhost:7000")
});
