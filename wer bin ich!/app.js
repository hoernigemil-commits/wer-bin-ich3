import { db } from "./firebase.js";
import { collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

const playersRef = collection(db, "players");

/* ===== index.html ===== */
if (window.location.pathname.endsWith("index.html")) {
  const btn = document.getElementById("nextBtn");

  if (localStorage.getItem("realName")) {
    alert("Du hast deinen Namen bereits eingegeben! Weiterleitung...");
    window.location.href = "role.html";
  }

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

  if (localStorage.getItem("roleSubmitted")) {
    alert("Du hast deine Rolle bereits eingetragen! Weiterleitung...");
    window.location.href = "game.html";
  }

  btn.addEventListener("click", async () => {
    const role = document.getElementById("gameName").value.trim();
    if (!role) return alert("Bitte Spielname eingeben");

    const realName = localStorage.getItem("realName");
    await addDoc(playersRef, { realName, role });

    localStorage.setItem("roleSubmitted", "true");
    window.location.href = "game.html";
  });
}

/* ===== game.html ===== */
import { doc } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

async function loadGame() {
  const myName = localStorage.getItem("realName");
  const list = document.getElementById("list");
  if (!list) return;

  list.innerHTML = "";
  const snapshot = await getDocs(playersRef);

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

if (window.location.pathname.endsWith("game.html")) {
  loadGame();
  setInterval(loadGame, 3000);
}
