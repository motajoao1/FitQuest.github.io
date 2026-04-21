/**
 * game.js — Lógica principal do jogo
 * XP, level up, missões, batalha com chefão, GPS, pedômetro.
 */

// ── XP & Level Up ────────────────────────────────────────────────────────────

/**
 * Concede XP e moedas ao herói.
 * Verifica automaticamente o level up em cascata.
 * @param {number} amount - Quantidade de XP
 * @param {number} coins  - Quantidade de moedas
 */
function gainXP(amount, coins = 0) {
  const s = window.state;
  s.xp    += amount;
  s.coins += coins;

  // Verifica level up (pode ocorrer várias vezes seguidas)
  while (s.xp >= s.xpNext) {
    s.xp     -= s.xpNext;
    s.level++;
    s.xpNext  = Math.floor(s.xpNext * 1.4);
    s.maxHp  += 10;
    s.hp      = s.maxHp;     // cura completa ao subir de nível
    showToast('🎉 NÍVEL ' + s.level + '! Você subiu de nível!');
  }
}

// ── Missões ──────────────────────────────────────────────────────────────────

/**
 * Conclui uma missão: concede XP, melhora atributo e causa dano no chefão.
 * @param {object} m - Objeto da missão
 */
function completeMission(m) {
  const s = window.state;
  if (s.missionsCompleted[m.id]) return;

  s.missionsCompleted[m.id] = true;

  // Recompensas
  gainXP(m.xp, m.coins || 10);

  // Melhoria de atributo
  if      (m.attr === 'str') s.str++;
  else if (m.attr === 'end') s.end++;
  else if (m.attr === 'agi') s.agi++;

  // A missão concluída causa dano automático no chefão da semana
  s.bossHp = Math.max(0, s.bossHp - 60);
  addBossLog(`Missão "${m.name}" concluída! Chefão perde 60 HP.`, 'gold');
  if (s.bossHp === 0 && !s.bossDefeated) defeatBoss();

  // Atualiza streak semanal
  const today = new Date().getDay();
  if (!s.trainedDays.includes(today)) {
    s.trainedDays.push(today);
    s.streak++;
  }

  showToast('+' + m.xp + ' XP — Missão concluída!');
  render();
  saveState();
}

// ── Chefão ───────────────────────────────────────────────────────────────────

/**
 * Ataca o chefão com o tipo selecionado.
 * @param {'forca'|'cardio'|'descanso'} type
 */
function attackBoss(type) {
  const s = window.state;
  if (s.bossDefeated) { showToast('Chefão já foi derrotado!'); return; }

  const phase = Math.min(Math.floor((s.level - 1) / 3), BOSS_PHASES.length - 1);
  let dmg = 0, msg = '';

  if (type === 'forca') {
    dmg = 40 + Math.floor(Math.random() * 20) + Math.floor(s.str / 2);
    msg = `💪 Golpe de Força! ${dmg} dano!`;

  } else if (type === 'cardio') {
    dmg = 25 + Math.floor(Math.random() * 20) + Math.floor(s.agi / 2);
    msg = `🏃 Ataque de Cardio! ${dmg} dano!`;

  } else {
    // Descanso = cura o herói
    const heal = 10 + Math.floor(Math.random() * 10);
    s.hp = Math.min(s.maxHp, s.hp + heal);
    addBossLog(`💤 Recuperação! +${heal} HP!`, 'heal');
    gainXP(5, 0);
    render();
    saveState();
    return;
  }

  // Aplica dano no chefão
  s.bossHp = Math.max(0, s.bossHp - dmg);
  addBossLog(msg, 'dmg');
  gainXP(10, 3);

  // Contra-ataque do chefão
  const bossCounterDmg = 5 + Math.floor(Math.random() * 15);
  s.hp = Math.max(1, s.hp - bossCounterDmg);
  addBossLog(
    `${BOSS_PHASES[phase].icon} ${BOSS_PHASES[phase].name} contra-ataca! -${bossCounterDmg} HP`,
    'dmg'
  );

  // Animação de hit no ícone do chefão
  const bossIconEl = document.getElementById('bossIcon');
  bossIconEl.classList.remove('hit-anim');
  void bossIconEl.offsetWidth; // força o reflow para reiniciar a animação
  bossIconEl.classList.add('hit-anim');

  if (s.bossHp === 0 && !s.bossDefeated) defeatBoss();

  render();
  saveState();
}

/**
 * Registra a derrota do chefão e concede recompensas.
 */
function defeatBoss() {
  window.state.bossDefeated = true;
  gainXP(300, 500);
  addBossLog('🏆 CHEFÃO DERROTADO! +300 XP e 500 Moedas!', 'gold');
  showToast('🏆 VITÓRIA! Chefão derrotado!');
}

/**
 * Adiciona uma linha ao log de batalha.
 * @param {string} msg - Mensagem
 * @param {'dmg'|'heal'|'gold'|''} cls - Classe CSS de cor
 */
function addBossLog(msg, cls = '') {
  const log = document.getElementById('battleLog');
  const div = document.createElement('div');
  div.className   = 'log-line' + (cls ? ' ' + cls : '');
  div.textContent = msg;
  log.appendChild(div);
  log.scrollTop   = log.scrollHeight;
}

// ── GPS Check-in (simulado) ──────────────────────────────────────────────────
// No Flutter: substitua por geolocator + geofencing (smart_fit coords)

/**
 * Simula o check-in GPS na academia.
 * No app real: use o package 'geolocator' e verifique se o
 * usuário está dentro do raio da academia (geofencing).
 */
function simulateGPS() {
  const btn = document.getElementById('gpsBtn');
  btn.textContent = '📡 Detectando...';
  btn.disabled    = true;

  // Simula latência de GPS (~1.5s)
  setTimeout(() => {
    const s = window.state;
    s.gpsCheckedIn = true;
    saveState();

    document.getElementById('gpsBadge').className   = 'badge badge-green';
    document.getElementById('gpsBadge').textContent = 'Ativo';
    document.getElementById('gpsZone').innerHTML =
      '<div style="font-size:13px;color:var(--c-muted)">' +
      '<span style="width:10px;height:10px;border-radius:50%;display:inline-block;' +
      'background:var(--c-green-hp);margin-right:6px"></span>' +
      'Smart Fit — Check-in confirmado! Missões especiais liberadas.</div>';

    gainXP(30, 10);
    showToast('📍 Check-in confirmado! +30 XP');
    render();
    saveState();
  }, 1500);
}

// ── Pedômetro (simulado) ─────────────────────────────────────────────────────
// No Flutter: substitua pelo package 'pedometer' e StreamSubscription

/**
 * Inicia o simulador de passos.
 * No app real: use o pacote pedometer:
 *   Pedometer.stepCountStream.listen((event) { gainPassiveXP(event.steps); });
 */
function startStepSimulator() {
  setInterval(() => {
    const s   = window.state;
    const inc = Math.floor(Math.random() * 8) + 2;
    s.steps  += inc;

    renderSteps();

    // XP passivo a cada 1.000 passos
    if (s.steps % 1000 < inc) {
      gainXP(5, 1);
      saveState();
    }

    // Conquista: 10.000 passos no dia
    if (s.steps >= 10000 && !s.missionsCompleted['steps10k']) {
      s.missionsCompleted['steps10k'] = true;
      gainXP(50, 20);
      showToast('👟 10.000 passos! +50 XP');
      render();
      saveState();
    }
  }, 800);
}

// ── Equipamentos ─────────────────────────────────────────────────────────────

/**
 * Equipa um item pelo índice.
 * TODO: implementar sistema completo de inventário.
 * @param {number} idx - Índice do equipamento em EQUIPMENT[]
 */
function equipItem(idx) {
  const item = EQUIPMENT[idx];
  if (!item) return;
  showToast(`${item.icon} ${item.name} equipado! ${item.stat}`);
}
