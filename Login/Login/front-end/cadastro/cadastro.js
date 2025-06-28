import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import Toastify from 'https://cdn.jsdelivr.net/npm/toastify-js/+esm';
// Config do Firebase
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

window.cadastrar = function (event) {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  createUserWithEmailAndPassword(auth, email, senha)
    .then((userCredential) => {
      Toastify({
        text: "Cadastro realizado com sucesso! Você será redirecionado para a página de login.",
        duration: 2000, 
        gravity: "top",
        position: "right", 
        stopOnFocus: true,
        style: {
          background: "linear-gradient(to right,rgb(60, 216, 99),rgb(60, 216, 99))",
        },
        callback: function() {
          window.location.href = "../login/login.html";
        }
      }).showToast();
    })
    .catch((error) => {
      Toastify({
        text: "Erro no cadastro: " + error.message,
        duration: 5000,
        gravity: "top",
        position: "right",
        close: true,
        style: {
          background: "linear-gradient(to right,rgb(233, 50, 65),rgb(233, 50, 65))",
        },
      }).showToast();
    });
};
