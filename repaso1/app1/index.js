const socket = io("http://localhost:5050", { path: "/rea-time" });
const userId = `userA_${Math.floor(Math.random() * 1000)}`;

document.getElementById("send-button").addEventListener("click", () => {
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
          const data = { id: userId, lat: pos.coords.latitude, lon: pos.coords.longitude };

          await fetch("/ubicaciones", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
          });
      });
  } else {
      alert("Geolocalización no soportada");
  }
});