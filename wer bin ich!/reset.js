import { db } from "./firebase.js";
import { collection, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

const playersRef = collection(db, "players");

const resetBtn = document.getElementById("resetBtn");
resetBtn.addEventListener("click", async () => {
  const password = document.getElementById("adminPass").value;
  if (password !== "1") { // Passwort anpassen falls nötig
    alert("Falsches Passwort!");
    return;
  }

  if (!confirm("Willst du wirklich das Spiel zurücksetzen?")) return;

  const snapshot = await getDocs(playersRef);
  for (const document of snapshot.docs) {
    await deleteDoc(doc(db, "players", document.id));
  }

  alert("🎉 Spiel wurde zurückgesetzt!");
  
  // Statt Weiterleitung: leere Input-Felder und Button bleibt sichtbar
  document.getElementById("adminPass").value = "";
});

