// login.js
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import Toastify from 'https://cdn.jsdelivr.net/npm/toastify-js/+esm';

const auth = getAuth();

window.login = async function (event) {
  event.preventDefault();
  const email = document.querySelector('#email').value;
  const senha = document.querySelector('#senha').value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, senha);
    Toastify({
      text: "Login realizado com sucesso! Você será redirecionado.",
      duration: 2000, 
      gravity: "top",
      position: "right", 
      stopOnFocus: true,
      style: {
        background: "linear-gradient(to right,rgb(60, 216, 99),rgb(60, 216, 99))",
      },
      callback: function() {
        window.location.href = "../inicial/inicial.html";
      }
    }).showToast();
  } catch (error) {
    Toastify({
      text: "Erro ao fazer login: " + error.message,
      duration: 5000,
      gravity: "top",
      position: "right",
      close: true,
      style: {
        background: "linear-gradient(to right,rgb(233, 50, 65),rgb(233, 50, 65))",
      },
    }).showToast();
  }
}
