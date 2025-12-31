import { db } from "./firebase.js";
import { collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

const playersRef = collection(db, "players");

/* ===== index.html ===== */
if (window.location.pathname.endsWith("index.html")) {
  const btn = document.getElementById("nextBtn");
  btn.addEventListener("click", () => {
    const name = document.getElementById("realName").value.trim();
    if (!name) return alert("Bitte Name eingeben");
    localStorage.setItem("realName", name);
    window.location.href = "role.html"; // Weiterleitung
  });
}

/* ===== role.html ===== */
if (window.location.pathname.endsWith("role.html")) {
  const btn = document.getElementById("nextBtn");
  btn.addEventListener("click", async () => {
    const role = document.getElementById("gameName").value.trim();
    if (!role) return alert("Bitte Spielname eingeben");

    const realName = localStorage.getItem("realName");
    await addDoc(playersRef, { realName, role });

    window.location.href = "game.html"; // Weiterleitung
  });
}

/* ===== game.html ===== */
async function loadGame() {
  const myName = localStorage.getItem("realName");
  const list = document.getElementById("list");
  if (!list) return;

  // 1️⃣ Alte Liste leeren
  list.innerHTML = "";

  const snapshot = await getDocs(playersRef);

  // 2️⃣ Nur andere Spieler anzeigen
  snapshot.forEach(docSnap => {
    const p = docSnap.data();
    if (p.realName !== myName) {
      const div = document.createElement("div");
      div.className = "card";
      div.innerHTML = `<span>${p.realName}</span> = <strong>${p.role}</strong>`;
      list.appendChild(div);
    }
  });
}

// Seite laden
if (window.location.pathname.endsWith("game.html")) {
  loadGame();
  // Optional: nur einmal laden, kein setInterval, wenn keine Live-Aktualisierung nötig
  // setInterval(loadGame, 3000);
}
