// Variáveis globais
let complaints = [];
let filteredComplaints = [];
let unsubscribe = null;

// Elementos DOM
const elements = {
  vagasLink: document.getElementById("vagasLink"),
  relatosLink: document.getElementById("relatosLink"),
  viewSection: document.getElementById("viewSection"),
  formSection: document.getElementById("formSection"),
  searchInput: document.getElementById("search-input"),
  reclamacoesContainer: document.getElementById("reclamacoesContainer"),
  complaintForm: document.getElementById("complaintForm"),
  submitBtn: document.getElementById("submitBtn"),
  loadingOverlay: document.getElementById("loadingOverlay"),
  totalComplaints: document.getElementById("totalComplaints"),
  todayComplaints: document.getElementById("todayComplaints"),
  resolvedComplaints: document.getElementById("resolvedComplaints"),
  menuToggle: document.getElementById("menuToggle"),
  sidebar: document.getElementById("sidebar"),
  sidebarOverlay: document.getElementById("sidebarOverlay"),
};

// Event Listeners
document.addEventListener("DOMContentLoaded", function () {
  initializeApp();
  setupEventListeners();
});

function setupEventListeners() {
  // Navegação
  elements.vagasLink.addEventListener("click", function (e) {
    e.preventDefault();
    showViewSection();
    closeMobileMenu(); // Fecha o menu mobile após navegar
  });

  elements.relatosLink.addEventListener("click", function (e) {
    e.preventDefault();
    showFormSection();
    closeMobileMenu(); // Fecha o menu mobile após navegar
  });

  // Pesquisa
  elements.searchInput.addEventListener("input", function (e) {
    handleSearch(e.target.value);
  });

  // Formulário
  elements.complaintForm.addEventListener("submit", handleFormSubmit);

  // Menu Mobile
  elements.menuToggle.addEventListener("click", toggleMobileMenu);
  elements.sidebarOverlay.addEventListener("click", closeMobileMenu);

  // Fecha menu mobile ao redimensionar tela
  window.addEventListener("resize", function() {
    if (window.innerWidth > 768) {
      closeMobileMenu();
    }
  });

  // Fecha menu mobile com tecla ESC
  document.addEventListener("keydown", function(e) {
    if (e.key === "Escape") {
      closeMobileMenu();
    }
  });
}

// Inicialização da aplicação
function initializeApp() {
  showViewSection();
  loadComplaints();
}

// Navegação entre seções
function showViewSection() {
  elements.viewSection.classList.remove("hidden");
  elements.formSection.classList.add("hidden");
  elements.vagasLink.classList.add("active");
  elements.relatosLink.classList.remove("active");
}

function showFormSection() {
  elements.viewSection.classList.add("hidden");
  elements.formSection.classList.remove("hidden");
  elements.vagasLink.classList.remove("active");
  elements.relatosLink.classList.add("active");
}

// Carregamento de reclamações do Firebase
function loadComplaints() {
  showLoading();

  // Listener em tempo real para mudanças na coleção
  unsubscribe = complaintsCollection.orderBy("timestamp", "desc").onSnapshot(
    function (snapshot) {
      complaints = [];

      snapshot.forEach(function (doc) {
        const data = doc.data();
        complaints.push({
          id: doc.id,
          ...data,
          timestamp: data.timestamp.toDate(), // Converter Timestamp do Firebase para Date
        });
      });

      filteredComplaints = complaints;
      updateStats();
      updateDisplay();
      hideLoading();
    },
    function (error) {
      console.error("Erro ao carregar reclamações:", error);
      showError("Erro ao carregar reclamações. Tente novamente.");
      hideLoading();
    }
  );
}

// Pesquisa
function handleSearch(searchTerm) {
  const term = searchTerm.toLowerCase();

  if (!term) {
    filteredComplaints = complaints;
  } else {
    filteredComplaints = complaints.filter(
      (complaint) =>
        complaint.name.toLowerCase().includes(term) ||
        complaint.type.toLowerCase().includes(term) ||
        complaint.text.toLowerCase().includes(term) ||
        complaint.class.toLowerCase().includes(term)
    );
  }

  updateDisplay();
}

// Atualização das estatísticas
function updateStats() {
  const total = complaints.length;
  const today = complaints.filter((complaint) => {
    const today = new Date();
    const complaintDate = new Date(complaint.timestamp);
    return complaintDate.toDateString() === today.toDateString();
  }).length;

  // Simula reclamações resolvidas (70% do total)
  const resolved = Math.floor(total * 0.7);

  // Animação dos números
  animateNumber(elements.totalComplaints, total);
  animateNumber(elements.todayComplaints, today);
  animateNumber(elements.resolvedComplaints, resolved);
}

// Animação dos números das estatísticas
function animateNumber(element, targetNumber) {
  const currentNumber = parseInt(element.textContent) || 0;
  const increment = targetNumber > currentNumber ? 1 : -1;

  if (currentNumber !== targetNumber) {
    element.textContent = currentNumber + increment;
    setTimeout(() => animateNumber(element, targetNumber), 50);
  }
}

// Atualização da exibição das reclamações
function updateDisplay() {
  const container = elements.reclamacoesContainer;
  const displayComplaints = filteredComplaints;

  if (displayComplaints.length === 0) {
    const searchValue = elements.searchInput.value;
    const message = searchValue
      ? `Nenhuma reclamação encontrada para "${searchValue}"`
      : "Nenhuma reclamação foi feita ainda. Seja o primeiro a contribuir!";

    container.innerHTML = `<div class="no-reclamacoes"><p>${message}</p></div>`;
    return;
  }

  container.innerHTML = "";

  displayComplaints.forEach((complaint, index) => {
    const card = createComplaintCard(complaint, index);
    container.appendChild(card);
  });
}

// Criação do card de reclamação
function createComplaintCard(complaint, index) {
  if (complaint.resolved) {
    card.style.opacity = "0.6";
    card.style.borderLeft = "4px solid green";
  }

  const card = document.createElement("div");
  card.className = "reclamacao-card";
  card.style.animationDelay = `${index * 0.1}s`;

  const timeString = complaint.timestamp.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  card.innerHTML = `
        <div class="reclamacao-header">
            <div class="student-info">
                <div class="student-name">${escapeHtml(complaint.name)}</div>
                <div class="student-class">${escapeHtml(complaint.class)}</div>
            </div>
            <div class="reclamacao-time">${timeString}</div>
        </div>
        <div class="reclamacao-type">${escapeHtml(complaint.type)}</div>
        <div class="reclamacao-content">${escapeHtml(complaint.text)}</div>
    `;
  if (isAdmin) {
    const actionsDiv = document.createElement("div");
    actionsDiv.style.marginTop = "12px";

    const resolveBtn = document.createElement("button");
    resolveBtn.textContent = "✅ Resolver";
    resolveBtn.onclick = () => markAsResolved(complaint.id);
    resolveBtn.style.marginRight = "10px";

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑️ Excluir";
    deleteBtn.onclick = () => deleteComplaint(complaint.id);

    actionsDiv.appendChild(resolveBtn);
    actionsDiv.appendChild(deleteBtn);
    card.appendChild(actionsDiv);
  }

  return card;
}

// Manipulação do envio do formulário
async function handleFormSubmit(e) {
  e.preventDefault();

  const formData = getFormData();

  if (!validateFormData(formData)) {
    return;
  }

  try {
    showLoadingOverlay();
    disableSubmitButton();

    // Adicionar reclamação ao Firestore
    await complaintsCollection.add({
      name: formData.name,
      class: formData.class,
      type: formData.type,
      text: formData.text,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      status: "pendente",
      resolved: false,
    });

    // Limpar formulário e mostrar sucesso
    elements.complaintForm.reset();
    showSuccess(
      "Reclamação enviada com sucesso! Obrigado pela sua contribuição."
    );

    // Voltar para a visualização após 2 segundos
    setTimeout(() => {
      showViewSection();
    }, 2000);
  } catch (error) {
    console.error("Erro ao enviar reclamação:", error);
    showError("Erro ao enviar reclamação. Tente novamente.");
  } finally {
    hideLoadingOverlay();
    enableSubmitButton();
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const snapshot = await complaintsCollection
    .where("name", "==", formData.name)
    .where("timestamp", ">=", firebase.firestore.Timestamp.fromDate(today))
    .get();

  if (snapshot.size >= 3) {
    showError("Você já enviou 3 reclamações hoje. Tente novamente amanhã.");
    return;
  }
}

// Obter dados do formulário
function getFormData() {
  return {
    name: document.getElementById("studentName").value.trim(),
    class: document.getElementById("studentClass").value,
    type: document.getElementById("complaintType").value,
    text: document.getElementById("complaintText").value.trim(),
  };
}

// Validação dos dados do formulário
function validateFormData(data) {
  if (!data.name || !data.class || !data.type || !data.text) {
    showError("Por favor, preencha todos os campos!");
    return false;
  }

  if (data.name.length < 2) {
    showError("Nome deve ter pelo menos 2 caracteres.");
    return false;
  }

  if (data.text.length < 10) {
    showError("Descrição deve ter pelo menos 10 caracteres.");
    return false;
  }

  return true;
}

// Funções de utilidade
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function showLoading() {
  elements.reclamacoesContainer.innerHTML =
    '<div class="loading"><p>Carregando reclamações...</p></div>';
}

function hideLoading() {
  // A função updateDisplay() já cuida de remover o loading
}

function showLoadingOverlay() {
  elements.loadingOverlay.classList.remove("hidden");
}

function hideLoadingOverlay() {
  elements.loadingOverlay.classList.add("hidden");
}

function disableSubmitButton() {
  elements.submitBtn.disabled = true;
  elements.submitBtn.innerHTML = "⏳ Enviando...";
}

function enableSubmitButton() {
  elements.submitBtn.disabled = false;
  elements.submitBtn.innerHTML = "📤 Enviar Reclamação";
}

function showError(message) {
  // Remove mensagens anteriores
  const existingMessages = document.querySelectorAll(".error, .success");
  existingMessages.forEach((msg) => msg.remove());

  const errorDiv = document.createElement("div");
  errorDiv.className = "error";
  errorDiv.textContent = message;

  // Adiciona após o botão de submit
  elements.submitBtn.parentNode.insertBefore(
    errorDiv,
    elements.submitBtn.nextSibling
  );

  // Remove após 5 segundos
  setTimeout(() => {
    if (errorDiv.parentNode) {
      errorDiv.remove();
    }
  }, 5000);
}

function showSuccess(message) {
  // Remove mensagens anteriores
  const existingMessages = document.querySelectorAll(".error, .success");
  existingMessages.forEach((msg) => msg.remove());

  const successDiv = document.createElement("div");
  successDiv.className = "success";
  successDiv.textContent = message;

  // Adiciona após o botão de submit
  elements.submitBtn.parentNode.insertBefore(
    successDiv,
    elements.submitBtn.nextSibling
  );

  // Remove após 5 segundos
  setTimeout(() => {
    if (successDiv.parentNode) {
      successDiv.remove();
    }
  }, 5000);
}

// Função para lidar com filtros avançados (opcional)
function setupAdvancedFilters() {
  const typeFilter = document.getElementById("typeFilter");
  const classFilter = document.getElementById("classFilter");
  const dateFilter = document.getElementById("dateFilter");

  if (typeFilter) {
    typeFilter.addEventListener("change", applyFilters);
  }

  if (classFilter) {
    classFilter.addEventListener("change", applyFilters);
  }

  if (dateFilter) {
    dateFilter.addEventListener("change", applyFilters);
  }
}

function applyFilters() {
  const typeFilter = document.getElementById("typeFilter")?.value || "";
  const classFilter = document.getElementById("classFilter")?.value || "";
  const dateFilter = document.getElementById("dateFilter")?.value || "";
  const searchTerm = elements.searchInput.value.toLowerCase();

  filteredComplaints = complaints.filter((complaint) => {
    // Filtro de texto
    const matchesSearch =
      !searchTerm ||
      complaint.name.toLowerCase().includes(searchTerm) ||
      complaint.type.toLowerCase().includes(searchTerm) ||
      complaint.text.toLowerCase().includes(searchTerm) ||
      complaint.class.toLowerCase().includes(searchTerm);

    // Filtro de tipo
    const matchesType = !typeFilter || complaint.type === typeFilter;

    // Filtro de turma
    const matchesClass = !classFilter || complaint.class === classFilter;

    // Filtro de data
    let matchesDate = true;
    if (dateFilter) {
      const complaintDate = new Date(complaint.timestamp);
      const filterDate = new Date(dateFilter);
      matchesDate = complaintDate.toDateString() === filterDate.toDateString();
    }

    return matchesSearch && matchesType && matchesClass && matchesDate;
  });

  updateDisplay();
}

// Função para exportar dados (opcional)
function exportComplaints() {
  if (complaints.length === 0) {
    showError("Não há dados para exportar.");
    return;
  }

  const data = complaints.map((complaint) => ({
    Nome: complaint.name,
    Turma: complaint.class,
    Tipo: complaint.type,
    Descrição: complaint.text,
    Data: complaint.timestamp.toLocaleString("pt-BR"),
    Status: complaint.status || "pendente",
  }));

  const csv = convertToCSV(data);
  downloadCSV(csv, "reclamacoes_estudantis.csv");
}

function convertToCSV(data) {
  const headers = Object.keys(data[0]).join(",");
  const rows = data.map((row) =>
    Object.values(row)
      .map((value) => `"${String(value).replace(/"/g, '""')}"`)
      .join(",")
  );

  return [headers, ...rows].join("\n");
}

function downloadCSV(csv, filename) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

// Limpeza ao descarregar a página
window.addEventListener("beforeunload", function () {
  if (unsubscribe) {
    unsubscribe();
  }
});

// Função para resetar filtros
function resetFilters() {
  elements.searchInput.value = "";

  const typeFilter = document.getElementById("typeFilter");
  const classFilter = document.getElementById("classFilter");
  const dateFilter = document.getElementById("dateFilter");

  if (typeFilter) typeFilter.value = "";
  if (classFilter) classFilter.value = "";
  if (dateFilter) dateFilter.value = "";

  filteredComplaints = complaints;
  updateDisplay();
}

// Função para verificar conectividade
function checkConnection() {
  if (!navigator.onLine) {
    showError(
      "Você está offline. Algumas funcionalidades podem não estar disponíveis."
    );
  }
}

// Event listeners para conectividade
window.addEventListener("online", function () {
  showSuccess("Conexão restabelecida!");
});

window.addEventListener("offline", function () {
  showError(
    "Você está offline. Algumas funcionalidades podem não estar disponíveis."
  );
});

// Inicializar verificação de conectividade
document.addEventListener("DOMContentLoaded", function () {
  checkConnection();
});
let isAdmin = false;

document.getElementById("adminBtn").style.display = "block";

document.getElementById("adminBtn").addEventListener("click", () => {
  if (!isAdmin) {
    const passcode = prompt("Digite o código de admin:");
    if (passcode === "souadmin123") {
      isAdmin = true;
      alert("✅ Modo Admin ativado");
    } else {
      alert("❌ Código incorreto");
      return;
    }
  } else {
    isAdmin = false;
    alert("🔒 Modo Admin desativado");
  }

  updateDisplay(); // Atualiza a interface
});

function markAsResolved(id) {
  complaintsCollection
    .doc(id)
    .update({
      resolved: true,
      status: "resolvido",
    })
    .then(() => {
      showSuccess("Reclamação marcada como resolvida.");
    })
    .catch((err) => {
      showError("Erro ao atualizar status.");
      console.error(err);
    });
}

function deleteComplaint(id) {
  if (!confirm("Tem certeza que deseja excluir esta reclamação?")) return;

  complaintsCollection
    .doc(id)
    .delete()
    .then(() => {
      showSuccess("Reclamação excluída.");
    })
    .catch((err) => {
      showError("Erro ao excluir.");
      console.error(err);
    });
}

// Funções do Menu Mobile
function toggleMobileMenu() {
  const isOpen = elements.sidebar.classList.contains("open");
  
  if (isOpen) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
}

function openMobileMenu() {
  elements.sidebar.classList.add("open");
  elements.sidebarOverlay.classList.add("show");
  elements.menuToggle.classList.add("active");
  
  // Previne scroll do body quando menu está aberto
  document.body.style.overflow = "hidden";
}

function closeMobileMenu() {
  elements.sidebar.classList.remove("open");
  elements.sidebarOverlay.classList.remove("show");
  elements.menuToggle.classList.remove("active");
  
  // Restaura scroll do body
  document.body.style.overflow = "";
}
