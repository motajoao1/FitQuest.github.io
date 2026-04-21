/**
 * app.js — Inicialização do app, navegação e utilitários globais
 * Este é o ponto de entrada principal: carregado por último no index.html.
 */

// ── Navegação por tabs ───────────────────────────────────────────────────────

const TAB_IDS = ['personagem', 'missoes', 'chefao', 'treinador'];

/**
 * Alterna entre as abas principais do app.
 * @param {string} name - ID da aba (ex: 'personagem')
 */
function switchTab(name) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.getElementById('tab-' + name).classList.add('active');
  document.querySelectorAll('.tab')[TAB_IDS.indexOf(name)].classList.add('active');
}

// ── Toast (notificação rápida) ───────────────────────────────────────────────

let toastTimeout = null;

/**
 * Exibe uma notificação temporária (toast) na tela.
 * @param {string} msg     - Mensagem a exibir
 * @param {number} duration - Duração em ms (padrão: 2500)
 */
function showToast(msg, duration = 2500) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), duration);
}

// ── Inicialização ────────────────────────────────────────────────────────────

/**
 * Mensagem de boas-vindas do Treinador IA ao abrir o app.
 */
function showWelcomeMessage() {
  addChatMessage(
    'ai',
    'Saudações, Aventureiro! Eu sou o Mestre Zephyr, seu guia nessa ' +
    'jornada épica de fitness. Complete missões, derrote o Chefão da ' +
    'Semana e evolua seu personagem. Sua lenda começa AGORA! ⚔️🔥'
  );
}

/**
 * Ponto de entrada principal — executado quando o DOM está pronto.
 */
function init() {
  loadState();       // carrega estado salvo (state.js)
  render();          // renderiza a UI com o estado carregado (render.js)
  startStepSimulator(); // inicia o pedômetro simulado (game.js)
  showWelcomeMessage();  // mensagem inicial do treinador (ai.js)
}

// Aguarda o DOM estar pronto antes de iniciar
document.addEventListener('DOMContentLoaded', init);
