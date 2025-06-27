// login.js
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const auth = getAuth();

window.login = async function (event) {
  event.preventDefault();
  const email = document.querySelector('#email').value;
  const senha = document.querySelector('#senha').value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, senha);
    alert('Login bem-sucedido!');
    window.location.href = "../home/home.html"; // redireciona
  } catch (error) {
    alert("Erro ao fazer login: " + error.message);
  }
}
