import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAW6NYZLs26slTAzG944bsiiOJsAe4HPCs",
    authDomain: "egg-catch-game-3850b.firebaseapp.com",
    projectId: "egg-catch-game-3850b",
    storageBucket: "egg-catch-game-3850b.firebasestorage.app",
    messagingSenderId: "890968345406",
    appId: "1:890968345406:web:629512139af50ca1bffa6f"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db };