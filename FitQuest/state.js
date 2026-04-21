/**
 * state.js — Gerenciamento de estado e persistência
 *
 * Em produção (Flutter), substitua localStorage por:
 *   - Hive  → hive.dart
 *   - SQLite → sqflite package
 */

const STATE_KEY = 'fitquest-v1';

// Estado inicial do herói
window.state = {
  // Identidade
  name: 'Aventureiro',

  // Progressão
  level:   1,
  xp:      0,
  xpNext:  200,    // XP necessário para próximo nível (×1.4 a cada level)

  // Atributos de combate
  hp:      100,
  maxHp:   100,
  str:     10,     // Força
  end:     10,     // Resistência
  agi:     10,     // Agilidade

  // Economia
  coins: 0,

  // Atividade
  steps:          0,
  streak:         0,
  trainedDays:    [],    // índices dos dias da semana treinados

  // Progresso de missões
  missionsCompleted: {},

  // Chefão da semana
  bossHp:       1000,
  bossMaxHp:    1000,
  bossDefeated: false,

  // Integrações nativas (simuladas no web)
  gpsCheckedIn: false,
};

/**
 * Carrega o estado salvo do localStorage.
 * No Flutter: leia do Hive/SQLite aqui.
 */
function loadState() {
  try {
    const raw = localStorage.getItem(STATE_KEY);
    if (raw) {
      window.state = { ...window.state, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.warn('FitQuest: falha ao carregar estado', e);
  }
}

/**
 * Salva o estado atual no localStorage.
 * No Flutter: escreva no Hive/SQLite aqui.
 */
function saveState() {
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify(window.state));
  } catch (e) {
    console.warn('FitQuest: falha ao salvar estado', e);
  }
}

/**
 * Reseta o estado para o padrão (útil para testes).
 */
function resetState() {
  localStorage.removeItem(STATE_KEY);
  location.reload();
}
