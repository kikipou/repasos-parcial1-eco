const socket = io();
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let players = {};

socket.on("updatePlayers", (data) => {
    players = data;
    drawPlayers();
});

function drawPlayers() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const id in players) {
        ctx.fillStyle = (id === socket.id) ? "green" : "blue";
        ctx.fillRect(players[id].x, players[id].y, 20, 20);
    }
}

document.addEventListener("keydown", (event) => {
    let move = { x: 0, y: 0 };
    if (event.key === "ArrowUp") move.y = -10;
    if (event.key === "ArrowDown") move.y = 10;
    if (event.key === "ArrowLeft") move.x = -10;
    if (event.key === "ArrowRight") move.x = 10;
    socket.emit("move", move);
});
