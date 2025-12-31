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

/* ===== Helper: Shuffle Array ===== */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/* ===== game.html ===== */
async function loadGame() {
  const myName = localStorage.getItem("realName");
  const list = document.getElementById("list");
  if (!list) return;

  list.innerHTML = "";

  const snapshot = await getDocs(playersRef);
  const allPlayers = snapshot.docs.map(docSnap => docSnap.data());

  if (allPlayers.length < 2) {
    list.innerHTML = "<p>Es müssen mindestens 2 Spieler teilnehmen!</p>";
    return;
  }

  // Rollen mischen
  let roles = allPlayers.map(p => p.role);
  roles = shuffleArray(roles);

  // Prüfen & tauschen, falls jemand seine eigene Rolle bekommt
  const finalAssignments = allPlayers.map((p, index) => {
    if (roles[index] === p.role) {
      const swapIndex = (index + 1) % roles.length;
      [roles[index], roles[swapIndex]] = [roles[swapIndex], roles[index]];
    }
    return { realName: p.realName, role: roles[index] };
  });

  // Nur die anderen Spieler anzeigen
  finalAssignments.forEach(p => {
    if (p.realName !== myName) {
      const div = document.createElement("div");
      div.className = "card";
      div.innerHTML = `<span>${p.realName}</span> = <strong>${p.role}</strong>`;
      list.appendChild(div);
    }
  });
}

if (window.location.pathname.endsWith("game.html")) {
  loadGame();
}
