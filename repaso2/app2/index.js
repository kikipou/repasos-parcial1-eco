const socket = io("http://localhost:7000", { path: "/rea-time" });

async function cargarMensajes() {
  const res = await fetch("/mensajes");
  const mensajes = await res.json();

  const chat = document.getElementById("chat");
  chat.innerHTML = "";
  mensajes.forEach(m => {
      chat.innerHTML += `<p><strong>${m.usuario}:</strong> ${m.mensaje}</p>`;
  });
}

// Escuchar nuevos mensajes en tiempo real
socket.on("nuevoMensaje", (data) => {
  document.getElementById("chat").innerHTML += `<p><strong>${data.usuario}:</strong> ${data.mensaje}</p>`;
});

socket.on("cargarMensajes", cargarMensajes);
cargarMensajes();