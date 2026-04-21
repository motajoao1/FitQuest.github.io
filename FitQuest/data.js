/**
 * data.js — Constantes e dados estáticos do jogo
 * Missões, chefões, classes, equipamentos, etc.
 */

// ── Classes e avatares por nível ─────────────────────────────────────────────
const CLASSES = [
  'Guerreiro Iniciante',
  'Guerreiro',
  'Paladino',
  'Campeão',
  'Lendário',
];

const AVATARS = ['⚔️', '🛡️', '🏆', '👑', '🌟'];

// ── Missões diárias fixas ────────────────────────────────────────────────────
const MISSIONS = [
  {
    id: 'm1',
    icon: '🏋️',
    name: 'Treino de Força',
    desc: 'Complete uma série de musculação',
    xp: 50,
    coins: 20,
    attr: 'str',
  },
  {
    id: 'm2',
    icon: '🏃',
    name: 'Corrida Leve',
    desc: '30 minutos de cardio moderado',
    xp: 40,
    coins: 15,
    attr: 'agi',
  },
  {
    id: 'm3',
    icon: '🧘',
    name: 'Alongamento',
    desc: '15 min de mobilidade e flexibilidade',
    xp: 25,
    coins: 10,
    attr: 'end',
  },
  {
    id: 'm4',
    icon: '💧',
    name: 'Hidratação',
    desc: 'Beba 2L de água hoje',
    xp: 20,
    coins: 8,
    attr: 'end',
  },
  {
    id: 'm5',
    icon: '😴',
    name: 'Descanso Ativo',
    desc: '8h de sono reparador',
    xp: 30,
    coins: 12,
    attr: 'end',
  },
];

// ── Missões especiais da academia (desbloqueadas via GPS) ────────────────────
const GYM_MISSIONS = [
  {
    id: 'g1',
    icon: '🏆',
    name: 'Supino Máximo',
    desc: 'Bata seu recorde no supino!',
    xp: 80,
    coins: 35,
    attr: 'str',
  },
  {
    id: 'g2',
    icon: '🔥',
    name: 'HIIT Explosivo',
    desc: '20 min de treino intervalado de alta intensidade',
    xp: 70,
    coins: 30,
    attr: 'agi',
  },
];

// ── Missões semanais ─────────────────────────────────────────────────────────
const WEEKLY_MISSIONS = [
  {
    id: 'w1',
    icon: '📅',
    name: '5 Treinos na Semana',
    desc: 'Complete 5 sessões até domingo',
    xp: 150,
    coins: 60,
    total: 5,
  },
  {
    id: 'w2',
    icon: '🚶',
    name: '50.000 Passos',
    desc: 'Caminhe bastante durante a semana',
    xp: 100,
    coins: 40,
    total: 50000,
  },
];

// ── Fases do Chefão Semanal ──────────────────────────────────────────────────
const BOSS_PHASES = [
  {
    name: 'A Preguiça',
    icon: '😴',
    sub: 'Chefão da Semana 1',
    maxHp: 1000,
  },
  {
    name: 'A Procrastinação',
    icon: '📱',
    sub: 'Chefão da Semana 2',
    maxHp: 1200,
  },
  {
    name: 'O Desânimo',
    icon: '🌧️',
    sub: 'Chefão da Semana 3',
    maxHp: 1500,
  },
];

// ── Equipamentos ─────────────────────────────────────────────────────────────
const EQUIPMENT = [
  { id: 'eq0', icon: '🗡️', name: 'Espada Básica',     stat: '+5 Força',       unlockLevel: 1  },
  { id: 'eq1', icon: '🛡️', name: 'Escudo de Madeira', stat: '+5 Resistência', unlockLevel: 1  },
  { id: 'eq2', icon: '🏹', name: 'Arco Mágico',        stat: '+8 Agilidade',   unlockLevel: 5  },
  { id: 'eq3', icon: '🧿', name: 'Amuleto Lendário',   stat: '+15 em tudo',    unlockLevel: 10 },
];

// ── Prompts do Treinador IA ──────────────────────────────────────────────────
// Os prompts usam uma função para capturar o estado atual do herói
const TRAINER_PROMPTS = {
  motivar: () =>
    'Você é Mestre Zephyr, um treinador RPG carismático e motivacional. O herói quer motivação. ' +
    'Responda em português (Brasil) com entusiasmo, usando metáforas de RPG/fantasia. ' +
    'Máximo 3 frases. Seja energético e criativo!',

  missao: () =>
    'Você é Mestre Zephyr, um treinador RPG. Crie uma missão de treino criativa e específica. ' +
    'Responda em português (Brasil) com o nome da missão, descrição breve e recompensa em XP (40-100 XP). ' +
    'Use emojis e seja divertido!',

  dica: () =>
    'Você é Mestre Zephyr, um treinador RPG sábio. Dê uma dica de treino ou nutrição valiosa. ' +
    'Responda em português (Brasil) misturando linguagem de RPG com conselho fitness real. ' +
    'Máximo 3 frases.',

  progresso: () => {
    const s = window.state;
    return (
      `Você é Mestre Zephyr, um treinador RPG. Analise o progresso do herói: ` +
      `nível ${s.level}, Força ${s.str}, Resistência ${s.end}, Agilidade ${s.agi}. ` +
      `Responda em português (Brasil) com entusiasmo, citando os atributos. Máximo 4 frases.`
    );
  },
};

// ── Nomes aleatórios para missões geradas por IA ─────────────────────────────
const AI_MISSION_ICONS  = ['🔥', '💎', '🌟', '⚡', '🏅', '🎯', '🦁', '🌀'];
const AI_MISSION_NAMES  = [
  'Desafio do Titã',
  'Missão Relâmpago',
  'Ordálio do Guerreiro',
  'Prova do Campeão',
  'Teste do Dragão',
  'Julgamento Final',
];
