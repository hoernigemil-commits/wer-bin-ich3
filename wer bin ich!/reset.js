import { db } from "./firebase.js";
import { collection, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

const playersRef = collection(db, "players");
const resetBtn = document.getElementById("resetBtn");
const statusMessage = document.getElementById("statusMessage");

resetBtn.addEventListener("click", async (event) => {
  event.preventDefault(); // verhindert Page-Reload

  const password = document.getElementById("adminPass").value.trim();
  if (password !== "1") { // Passwort ändern wenn nötig
    alert("Falsches Passwort!");
    return;
  }

  if (!confirm("Willst du wirklich das Spiel zurücksetzen?")) return;

  try {
    const snapshot = await getDocs(playersRef);
    for (const document of snapshot.docs) {
      await deleteDoc(doc(db, "players", document.id));
    }

    statusMessage.textContent = "🎉 Spiel wurde erfolgreich zurückgesetzt!";
    document.getElementById("adminPass").value = "";
  } catch (error) {
    statusMessage.textContent = "❌ Fehler beim Zurücksetzen: " + error.message;
  }
});
