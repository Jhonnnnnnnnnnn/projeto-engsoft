// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAdRiK0hYONV-R65FQqzOZxfQHYjB9ke88",
  authDomain: "hypecore-cfdfe.firebaseapp.com",
  projectId: "hypecore-cfdfe",
  storageBucket: "hypecore-cfdfe.firebasestorage.app",
  messagingSenderId: "871447742092",
  appId: "1:871447742092:web:1fdef3e490d46ed0f71da9",
  measurementId: "G-MQ3965G9RV"
};

firebase.initializeApp(firebaseConfig)
const db = firebase.firestore();


const complaintsCollection = db.collection('reclamacoes');


db.settings({
    timestampsInSnapshots: true
});

console.log('Firebase inicializado com sucesso!');