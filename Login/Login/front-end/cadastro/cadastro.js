import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

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

// Função de cadastro
window.cadastrar = function (event) {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  createUserWithEmailAndPassword(auth, email, senha)
    .then((userCredential) => {
      alert("Cadastro realizado com sucesso!");
      window.location.href = "../login/login.html";
    })
    .catch((error) => {
      alert("Erro no cadastro: " + error.message);
    });
};
