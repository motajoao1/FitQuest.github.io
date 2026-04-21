/**
 * render.js — Funções de renderização do DOM
 * Todas as funções que atualizam a interface com base no estado.
 */

// ── Render principal ─────────────────────────────────────────────────────────
function render() {
  const s = window.state;

  // XP Bar
  const xpPct = Math.min(100, (s.xp / s.xpNext) * 100);
  document.getElementById('xpBar').style.width = xpPct + '%';
  document.getElementById('xpLabel').textContent = s.xp + ' / ' + s.xpNext + ' XP';

  // Nível e classe
  document.getElementById('lvlBadge').textContent = s.level;
  document.getElementById('heroName').textContent  = s.name;
  const classIdx = Math.min(s.level - 1, CLASSES.length - 1);
  document.getElementById('heroClass').textContent  = CLASSES[classIdx];
  document.getElementById('charClass').textContent  = CLASSES[classIdx];

  // Avatar (muda com o nível)
  const avatarNode = document.getElementById('avatarEl');
  avatarNode.childNodes[0].textContent = AVATARS[classIdx];

  // Moedas e HP
  document.getElementById('coins').textContent    = s.coins;
  document.getElementById('hpDisplay').textContent = 'HP ' + s.hp + '/' + s.maxHp;
  document.getElementById('hpFull').textContent   = s.hp + ' / ' + s.maxHp;
  const hpPct = (s.hp / s.maxHp) * 100;
  document.getElementById('hpBarEl').style.width  = hpPct + '%';

  // Atributos
  document.getElementById('strVal').textContent = s.str;
  document.getElementById('endVal').textContent = s.end;
  document.getElementById('agiVal').textContent = s.agi;

  // Desbloqueio de equipamentos por nível
  if (s.level >= 5)  document.getElementById('eq2').classList.remove('locked');
  if (s.level >= 10) document.getElementById('eq3').classList.remove('locked');

  renderMissions();
  renderBoss();
  renderWeek();
  renderSteps();
}

// ── Missões ──────────────────────────────────────────────────────────────────
function renderMissions() {
  const s = window.state;

  // Missões diárias
  const list = document.getElementById('missionList');
  list.innerHTML = '';
  let done = 0;

  MISSIONS.forEach(m => {
    const isDone = !!s.missionsCompleted[m.id];
    if (isDone) done++;
    list.appendChild(buildMissionEl(m, isDone));
  });

  document.getElementById('missionCount').textContent = done + '/' + MISSIONS.length;

  // Missões da academia (GPS)
  if (s.gpsCheckedIn) {
    document.getElementById('gymMissionCard').style.display = 'block';
    const gl = document.getElementById('gymMissionList');
    gl.innerHTML = '';
    GYM_MISSIONS.forEach(m => {
      const isDone = !!s.missionsCompleted[m.id];
      gl.appendChild(buildMissionEl(m, isDone));
    });
  }

  // Missões semanais (com barra de progresso)
  const wl = document.getElementById('weeklyMissions');
  wl.innerHTML = '';
  WEEKLY_MISSIONS.forEach(m => {
    const isDone = !!s.missionsCompleted[m.id];
    const prog = m.id === 'w1'
      ? Object.keys(s.missionsCompleted).filter(k => k.startsWith('m') || k.startsWith('g')).length
      : Math.floor(s.steps / 1000);
    const pct = Math.min(100, (prog / m.total) * 100);
    const el = document.createElement('div');
    el.className = 'mission-item' + (isDone ? ' done' : '');
    el.style.flexDirection = 'column';
    el.style.alignItems    = 'stretch';
    el.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px">
        <div class="mission-icon">${m.icon}</div>
        <div class="mission-info">
          <div class="mission-name">${m.name}</div>
          <div class="mission-desc">${m.desc}</div>
        </div>
        <div class="mission-xp">+${m.xp} XP</div>
      </div>
      <div style="margin-top:6px">
        <div class="bar-wrap" style="height:6px">
          <div class="bar-fill bar-xp" style="width:${pct}%"></div>
        </div>
        <div style="font-size:10px;color:var(--c-muted);margin-top:3px;text-align:right">${prog} / ${m.total}</div>
      </div>`;
    wl.appendChild(el);
  });
}

/**
 * Constrói um elemento de missão clicável.
 * @param {object} m     - Objeto de missão
 * @param {boolean} isDone - Se já foi concluída
 */
function buildMissionEl(m, isDone) {
  const el = document.createElement('div');
  el.className = 'mission-item' + (isDone ? ' done' : '');
  el.innerHTML = `
    <div class="mission-icon">${m.icon}</div>
    <div class="mission-info">
      <div class="mission-name">${m.name}</div>
      <div class="mission-desc">${m.desc}</div>
    </div>
    <div class="mission-xp">+${m.xp} XP</div>
    <div class="check ${isDone ? 'done' : ''}">
      <span>${isDone ? '✓' : ''}</span>
    </div>`;
  if (!isDone) el.onclick = () => completeMission(m);
  return el;
}

// ── Chefão ───────────────────────────────────────────────────────────────────
function renderBoss() {
  const s     = window.state;
  const phase = Math.min(Math.floor((s.level - 1) / 3), BOSS_PHASES.length - 1);
  const boss  = BOSS_PHASES[phase];

  document.getElementById('bossIcon').textContent     = boss.icon;
  document.getElementById('bossName').textContent     = s.bossDefeated ? 'DERROTADO!' : boss.name;
  document.getElementById('bossSub').textContent      = boss.sub;
  document.getElementById('bossWeek').textContent     = 'Semana ' + (phase + 1);
  document.getElementById('bossHPLabel').textContent  = s.bossHp + ' / ' + s.bossMaxHp;

  const pct = (s.bossHp / s.bossMaxHp) * 100;
  document.getElementById('bossBar').style.width = pct + '%';

  if (s.bossDefeated) {
    document.getElementById('bossIcon').style.filter = 'grayscale(1)';
  }
}

// ── Série semanal ────────────────────────────────────────────────────────────
function renderWeek() {
  const s     = window.state;
  const DAYS  = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
  const today = new Date().getDay();
  const grid  = document.getElementById('weekGrid');
  grid.innerHTML = '';

  DAYS.forEach((d, i) => {
    const el = document.createElement('div');
    el.className = 'day-dot'
      + (s.trainedDays.includes(i) ? ' trained' : '')
      + (i === today ? ' today' : '');
    el.textContent = d;
    grid.appendChild(el);
  });

  document.getElementById('streakBadge').textContent = s.streak + ' dias';
}

// ── Pedômetro ────────────────────────────────────────────────────────────────
function renderSteps() {
  const s   = window.state;
  const pct = Math.min(100, (s.steps / 10000) * 100);
  document.getElementById('stepCount').textContent = s.steps.toLocaleString('pt-BR');
  document.getElementById('stepBar').style.width   = pct + '%';
}
