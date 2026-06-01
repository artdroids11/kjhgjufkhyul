const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".site-nav");
const diagnosticForm = document.getElementById("diagnostic-form");
const diagnosticResult = document.getElementById("diagnostic-result");
const filterButtons = document.querySelectorAll(".filter-button");
const actionNotes = document.querySelectorAll(".action-note");
const tabButtons = document.querySelectorAll(".tab-button");
const tabPanels = document.querySelectorAll(".tab-panel");
const accordionTriggers = document.querySelectorAll(".accordion-trigger");
const contrastToggle = document.getElementById("contrast-toggle");
const fontIncrease = document.getElementById("font-increase");
const fontDecrease = document.getElementById("font-decrease");
const topButton = document.getElementById("top-button");

const recommendations = {
  agua: {
    title: "Prioridade: cuidar da água",
    action: "Monte uma rotina de medição antes de irrigar e registre desperdícios visíveis.",
    record: "Anote data, quantidade usada e condição do solo ou da horta."
  },
  solo: {
    title: "Prioridade: proteger o solo",
    action: "Teste cobertura vegetal, rotação de culturas ou canteiro com palhada.",
    record: "Compare áreas protegidas e descobertas durante duas semanas."
  },
  residuos: {
    title: "Prioridade: reaproveitar resíduos",
    action: "Separe sobras orgânicas e transforme parte delas em composto para plantas.",
    record: "Pese ou estime o volume que deixou de ir para o lixo comum."
  },
  energia: {
    title: "Prioridade: usar energia com consciência",
    action: "Mapeie equipamentos ligados sem necessidade e crie uma escala de conferência.",
    record: "Registre horários de uso e oportunidades de economia."
  }
};

const environments = {
  escola: "envolva estudantes em equipes de observação e apresentação",
  casa: "convide a família para testar uma mudança pequena por semana",
  comunidade: "organize uma conversa com moradores, produtores e escola",
  rural: "relacione a ação com produção, solo, água e segurança do trabalho"
};

let fontScale = 1;

// Mantém o menu mobile acessível e sincronizado com aria-expanded.
function setMenu(open) {
  navMenu.classList.toggle("open", open);
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
}

function closeMenuAfterNavigation(event) {
  const link = event.target.closest('a[href^="#"]');
  if (!link) return;

  setMenu(false);
}

// Processa as escolhas do formulário e cria um plano personalizado.
function renderDiagnostic(event) {
  event.preventDefault();

  const formData = new FormData(diagnosticForm);
  const environment = formData.get("ambiente");
  const challenge = formData.get("desafio");
  const participants = Number(formData.get("participantes"));
  const recommendation = recommendations[challenge];
  const range = participants >= 50 ? "mutirão dividido em grupos" : "equipe única com funções claras";

  diagnosticResult.innerHTML = `
    <p class="result-kicker">Resultado</p>
    <h3>${recommendation.title}</h3>
    <p>Para esse ambiente, ${environments[environment]}. Com ${participants} participante(s), use ${range}.</p>
    <ul class="result-list">
      <li><strong>Primeira ação:</strong> ${recommendation.action}</li>
      <li><strong>Registro:</strong> ${recommendation.record}</li>
      <li><strong>Entrega escolar:</strong> produza um painel com problema, teste, dado coletado e conclusão.</li>
    </ul>
  `;
}

// Filtra as fichas de ação sem recarregar a página.
function filterActions(category) {
  actionNotes.forEach((note) => {
    const shouldShow = category === "todas" || note.dataset.category === category;
    note.classList.toggle("hidden", !shouldShow);
  });
}

function activateFilter(button) {
  filterButtons.forEach((item) => item.classList.remove("active"));
  button.classList.add("active");
  filterActions(button.dataset.filter);
}

// Alterna painéis de conteúdo com papéis ARIA de abas.
function activateTab(button) {
  const tabName = button.dataset.tab;

  tabButtons.forEach((item) => {
    const active = item === button;
    item.classList.toggle("active", active);
    item.setAttribute("aria-selected", String(active));
  });

  tabPanels.forEach((panel) => {
    const active = panel.id === `panel-${tabName}`;
    panel.classList.toggle("active", active);
    panel.hidden = !active;
  });
}

function toggleAccordion(trigger) {
  const panel = document.getElementById(trigger.getAttribute("aria-controls"));
  const open = trigger.getAttribute("aria-expanded") === "true";

  trigger.setAttribute("aria-expanded", String(!open));
  panel.hidden = open;
}

function applyFontScale() {
  document.documentElement.style.setProperty("--font-scale", fontScale.toFixed(2));
}

function changeFontScale(amount) {
  fontScale = Math.min(1.2, Math.max(0.92, fontScale + amount));
  applyFontScale();
}

navToggle.addEventListener("click", () => {
  setMenu(!navMenu.classList.contains("open"));
});

navMenu.addEventListener("click", closeMenuAfterNavigation);

diagnosticForm.addEventListener("submit", renderDiagnostic);

filterButtons.forEach((button) => {
  button.addEventListener("click", () => activateFilter(button));
});

tabButtons.forEach((button) => {
  button.addEventListener("click", () => activateTab(button));
});

accordionTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => toggleAccordion(trigger));
});

contrastToggle.addEventListener("click", () => {
  const active = document.body.classList.toggle("high-contrast");
  contrastToggle.setAttribute("aria-pressed", String(active));
});

fontIncrease.addEventListener("click", () => changeFontScale(0.06));
fontDecrease.addEventListener("click", () => changeFontScale(-0.06));

topButton.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
