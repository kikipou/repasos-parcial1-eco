//Funcionalidad
// Un mapa interactivo donde dos jugadores pueden moverse en tiempo real enviando sus coordenadas.
// Dos jugadores pueden moverse en un mapa con teclas WASD y ven la posición del otro jugador en tiempo real.
// Usa fetch() para cargar la página y socket.emit() para enviar las coordenadas.


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

let players = {}; // Almacenar posiciones de los jugadores

io.on("connection", (socket) => {
    console.log(`Jugador conectado: ${socket.id}`);

    // Posición inicial aleatoria
    players[socket.id] = { x: Math.random() * 400, y: Math.random() * 400 };

    // Enviar jugadores actuales
    io.emit("updatePlayers", players);

    // Movimiento del jugador
    socket.on("move", (data) => {
        if (players[socket.id]) {
            players[socket.id].x += data.x;
            players[socket.id].y += data.y;
            io.emit("updatePlayers", players);
        }
    });

    // Desconectar jugador
    socket.on("disconnect", () => {
        console.log(`Jugador desconectado: ${socket.id}`);
        delete players[socket.id];
        io.emit("updatePlayers", players);
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
