const socket = io("http://localhost:5050", { path: "/rea-time" });

async function actualizarLista() {
  const res = await fetch("/ubicaciones");
  const ubicaciones = await res.json();

  document.getElementById("lista").innerHTML = "";
  ubicaciones.forEach(u => {
      document.getElementById("lista").innerHTML += `<li>${u.id}: ${u.lat}, ${u.lon}</li>`;
  });
}

socket.on("nuevaUbicacion", actualizarLista);
actualizarLista();