const socket = io("http://localhost:7000", { path: "/rea-time" });
const userId = `userA_${Math.floor(Math.random() * 1000)}`;

document.getElementById("enviar").addEventListener("click", async () => {
    const usuario = document.getElementById("usuario").value;
    const mensaje = document.getElementById("mensaje").value;

    if (!usuario || !mensaje) return alert("Por favor, completa los campos");

    await fetch("/mensajes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, mensaje }),
    });

    document.getElementById("mensaje").value = ""; // Limpiar input
});