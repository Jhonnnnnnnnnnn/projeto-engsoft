import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import Toastify from 'https://cdn.jsdelivr.net/npm/toastify-js/+esm';

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
      Toastify({
        text: "E-mail de redefinição enviado com sucesso!",
        duration: 2000, 
        gravity: "top",
        position: "right", 
        stopOnFocus: true,
        style: {
          background: "linear-gradient(to right,rgb(60, 216, 99),rgb(60, 216, 99))",
        },
      }).showToast();
    })
    .catch((error) => {
      Toastify({
        text: "Erro ao enviar o e-mail: " + error.message,
        duration: 5000,
        gravity: "top",
        position: "right",
        close: true,
        style: {
          background: "linear-gradient(to right,rgb(233, 50, 65),rgb(233, 50, 65))",
        },
      }).showToast();
    });
});