import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Sua configuração do Firebase
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAdRiK0hYONV-R65FQqzOZxfQHYjB9ke88",
  authDomain: "hypecore-cfdfe.firebaseapp.com",
  projectId: "hypecore-cfdfe",
  storageBucket: "hypecore-cfdfe.firebasestorage.app",
  messagingSenderId: "871447742092",
  appId: "1:871447742092:web:1fdef3e490d46ed0f71da9",
  measurementId: "G-MQ3965G9RV"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.getElementById("btnRecuperar").addEventListener("click", () => {
  const email = document.getElementById("email").value;

  if (!email) {
    alert("Por favor, insira um e-mail válido.");
    return;
  }

  sendPasswordResetEmail(auth, email)
    .then(() => {
      alert("E-mail de redefinição enviado com sucesso!");
    })
    .catch((error) => {
      alert("Erro ao enviar o e-mail: " + error.message);
    });
});