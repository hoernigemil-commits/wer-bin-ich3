import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAVfNqOApiJm4r0GzIEcC4SHm7RI0fuNnE",
  authDomain: "wer-bin-ich-silvester.firebaseapp.com",
  projectId: "wer-bin-ich-silvester",
  storageBucket: "wer-bin-ich-silvester.firebasestorage.app",
  messagingSenderId: "696658693472",
  appId: "1:696658693472:web:6156a77db5272148666205"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
