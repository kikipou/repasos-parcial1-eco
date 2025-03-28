//Funcionalidad
// Cliente A envía su ubicación con fetch("/ubicaciones", { method: "POST" }).
// Cliente B obtiene las ubicaciones con fetch("/ubicaciones").
// Ambos clientes reciben actualizaciones en tiempo real con Socket.io.

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

let ubicaciones = []; // [{ id, lat, lon }]

app.get("/ubicaciones", (req, res) => {
    res.json(ubicaciones);
});

app.post("/ubicaciones", (req, res) => {
    const { id, lat, lon } = req.body;
    if (!id || !lat || !lon) return res.status(400).json({ error: "Faltan datos" });

    ubicaciones = ubicaciones.filter(u => u.id !== id);
    ubicaciones.push({ id, lat, lon });

    io.emit("nuevaUbicacion", ubicaciones); // Notifica a los clientes
    res.json({ mensaje: "Ubicación guardada" });
});

io.on("connection", (socket) => {
    console.log("Cliente conectado");
    socket.emit("nuevaUbicacion", ubicaciones); // Enviar ubicaciones actuales al conectar

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

httpServer.listen(5050, () => {
  console.log("Servidor en http://localhost:5050")
});
