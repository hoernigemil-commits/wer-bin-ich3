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
    window.location.href = "role.html";
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

    window.location.href = "game.html";
  });
}

/* ===== game.html ===== */
async function loadGame() {
  const myName = localStorage.getItem("realName");
  const list = document.getElementById("list");
  if (!list) return;

  list.innerHTML = "";

  const snapshot = await getDocs(playersRef);
  const allPlayers = snapshot.docs.map(docSnap => docSnap.data());

  // Filter: alle Spieler außer mir
  const otherPlayers = allPlayers.filter(p => p.realName !== myName);

  // Rollen aller Spieler außer mir
  let roles = allPlayers.map(p => p.role).filter(role => {
    const me = allPlayers.find(pl => pl.realName === myName);
    return role !== me?.role;
  });

  // Shuffle Rollen
  roles = roles.sort(() => Math.random() - 0.5);

  // Zuweisung: jedem Spieler einen anderen Role geben
  otherPlayers.forEach((p, i) => {
    const assignedRole = roles[i % roles.length];
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `<span>${p.realName}</span> = <strong>${assignedRole}</strong>`;
    list.appendChild(div);
  });
}

if (window.location.pathname.endsWith("game.html")) {
  loadGame();
}
