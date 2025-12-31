import { db } from "./firebase.js";
import { collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

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

/* ===== Shuffle Helper ===== */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/* ===== Derangement: Rollen zuweisen ===== */
function derangement(players) {
  let roles = players.map(p => p.role);
  let shuffled = [];
  let attempts = 0;

  do {
    shuffled = shuffleArray([...roles]);
    attempts++;
  } while (players.some((p, i) => p.role === shuffled[i]) && attempts < 1000);

  return players.map((p, i) => ({ realName: p.realName, role: shuffled[i] }));
}

/* ===== game.html ===== */
async function loadGame() {
  const myName = localStorage.getItem("realName");
  const list = document.getElementById("list");
  if (!list) return;

  list.innerHTML = "";

  const snapshot = await getDocs(playersRef);
  const allPlayers = snapshot.docs.map(doc => doc.data());

  if (allPlayers.length < 2) {
    list.innerHTML = "<p>Es müssen mindestens 2 Spieler teilnehmen!</p>";
    return;
  }

  const finalAssignments = derangement(allPlayers);

  // Anzeige: nur andere Spieler
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

/* ===== Reset-Funktion (optional) ===== */
if (window.location.pathname.endsWith("reset.html")) {
  const resetBtn = document.getElementById("resetBtn");
  const statusMessage = document.getElementById("statusMessage");

  resetBtn.addEventListener("click", async (event) => {
    event.preventDefault();
    const password = document.getElementById("adminPass").value.trim();
    if (password !== "1") { 
      alert("Falsches Passwort!");
      return;
    }

    if (!confirm("Willst du wirklich das Spiel zurücksetzen?")) return;

    try {
      const snapshot = await getDocs(playersRef);
      for (const document of snapshot.docs) {
        await deleteDoc(doc(db, "players", document.id));
      }

      localStorage.removeItem("realName");
      localStorage.removeItem("roleSubmitted");

      statusMessage.textContent = "🎉 Spiel wurde erfolgreich zurückgesetzt!";
      document.getElementById("adminPass").value = "";
    } catch (error) {
      statusMessage.textContent = "❌ Fehler beim Zurücksetzen: " + error.message;
    }
  });
}
