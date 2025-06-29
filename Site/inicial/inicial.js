import { db, collection, addDoc, serverTimestamp } from './firebase.js';

const vagas = [
  {
    titulo: "Desenvolvedor Front-end",
    empresa: "Tech Solutions",
    descricao: "Experiência com React e CSS avançado."
  },
  {
    titulo: "Analista de Dados",
    empresa: "DataCorp",
    descricao: "Domínio em Python e SQL."
  },
  {
    titulo: "Designer UX/UI",
    empresa: "Creativa",
    descricao: "Portfólio de design para apps mobile."
  },
  {
    titulo: "Engenheiro de Software",
    empresa: "Innovatech",
    descricao: "Conhecimento em C++, sistemas distribuídos."
  },
  {
    titulo: "Gerente de Projetos",
    empresa: "Enterprise Ltda",
    descricao: "Experiência em metodologias ágeis."
  }
];

const vagasContainer = document.getElementById('vagas-container');
const searchInput = document.getElementById('search-input');
const chatToggleBtn = document.getElementById('chat-toggle-btn');
const chatBox = document.getElementById('chat-box');
const chatInput = document.getElementById('chat-input');
const chatContent = document.getElementById('chat-content');

function exibirVagas(lista) {
  vagasContainer.innerHTML = '';
  if (lista.length === 0) {
    vagasContainer.innerHTML = '<p>Nenhuma vaga encontrada.</p>';
    return;
  }

  lista.forEach(vaga => {
    const el = document.createElement('div');
    el.classList.add('vaga');
    el.innerHTML = `<h2>${vaga.titulo}</h2><h3>${vaga.empresa}</h3><p>${vaga.descricao}</p>`;
    vagasContainer.appendChild(el);
  });
}

window.onload = () => exibirVagas(vagas);

searchInput.addEventListener('input', () => {
  const termo = searchInput.value.toLowerCase();
  const filtradas = vagas.filter(v =>
    v.titulo.toLowerCase().includes(termo) ||
    v.empresa.toLowerCase().includes(termo) ||
    v.descricao.toLowerCase().includes(termo)
  );
  exibirVagas(filtradas);
});

chatToggleBtn.addEventListener('click', () => {
  chatBox.classList.toggle('chat-aberto');
});

chatInput.addEventListener('keypress', async (e) => {
  if (e.key === 'Enter' && chatInput.value.trim()) {
    const mensagem = chatInput.value.trim();

    const msg = document.createElement('p');
    msg.textContent = mensagem;
    msg.style.background = '#cfe2ff';
    msg.style.padding = '6px 10px';
    msg.style.borderRadius = '8px';
    msg.style.margin = '5px 0';
    chatContent.appendChild(msg);
    chatContent.scrollTop = chatContent.scrollHeight;

    try {
      await addDoc(collection(db, "relatos"), {
        mensagem,
        data: serverTimestamp()
      });
    } catch (err) {
      console.error("Erro ao enviar para Firebase:", err);
    }

    chatInput.value = '';
  }
});
