/**
 * ai.js — Integração com a API da Anthropic (Treinador IA)
 *
 * ⚠️  SEGURANÇA: Em produção, NUNCA exponha sua API key no frontend.
 *     Crie um backend (Node.js/Python/etc.) que faça as chamadas
 *     e exponha um endpoint seguro para o app consumir.
 *
 *     Exemplo de endpoint seguro:
 *       POST /api/trainer  { prompt: "..." }  → { reply: "..." }
 */

// Substitua pela sua chave da Anthropic (apenas para desenvolvimento local)
const ANTHROPIC_API_KEY = 'SUA_CHAVE_AQUI';

// Endpoint — em produção, aponte para seu backend:
// const API_ENDPOINT = 'https://seu-backend.com/api/trainer';
const API_ENDPOINT = 'https://api.anthropic.com/v1/messages';

// ── Ações rápidas do treinador ───────────────────────────────────────────────

/**
 * Dispara uma ação rápida do treinador via botões de atalho.
 * @param {'motivar'|'missao'|'dica'|'progresso'} type
 */
async function askTrainer(type) {
  const labels = {
    motivar:   '🔥 Me motive!',
    missao:    '⚔️ Gere uma nova missão!',
    dica:      '💡 Me dê uma dica!',
    progresso: '📊 Como está meu progresso?',
  };

  addChatMessage('user', labels[type] || type);

  const prompt = typeof TRAINER_PROMPTS[type] === 'function'
    ? TRAINER_PROMPTS[type]()
    : TRAINER_PROMPTS[type];

  await callClaudeAPI(prompt);

  // Se pediu missão, gera uma missão procedural na aba
  if (type === 'missao') generateAIMission();
}

// ── Chat livre ───────────────────────────────────────────────────────────────

/**
 * Envia uma mensagem digitada pelo usuário ao Mestre Zephyr.
 */
async function sendChat() {
  const input = document.getElementById('chatInput');
  const msg   = input.value.trim();
  if (!msg) return;

  input.value = '';
  addChatMessage('user', msg);

  const s = window.state;
  const contextualPrompt =
    `Você é Mestre Zephyr, um treinador lendário de um universo RPG de fitness. ` +
    `Responda em português (Brasil) de forma motivacional, usando metáforas de fantasia e RPG, ` +
    `mas com conselhos de fitness reais. Seja criativo, energético e conciso (máximo 4 frases). ` +
    `Contexto do herói: Nível ${s.level}, Força ${s.str}, Resistência ${s.end}, Agilidade ${s.agi}.\n\n` +
    `Pergunta do herói: ${msg}`;

  await callClaudeAPI(contextualPrompt);
}

// ── Chamada à API ────────────────────────────────────────────────────────────

/**
 * Faz a chamada à API da Anthropic e exibe a resposta no chat.
 * @param {string} prompt - Prompt completo a ser enviado
 */
async function callClaudeAPI(prompt) {
  const typing = showTypingIndicator();

  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type':       'application/json',
        'x-api-key':          ANTHROPIC_API_KEY,
        'anthropic-version':  '2023-06-01',
        // Necessário para chamadas diretas do browser (apenas dev)
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model:      'claude-sonnet-4-20250514',
        max_tokens: 300,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) throw new Error('API error: ' + response.status);

    const data = await response.json();
    const text = data.content?.[0]?.text || fallbackMessage();

    removeTypingIndicator(typing);
    addChatMessage('ai', text);

  } catch (err) {
    console.error('FitQuest AI error:', err);
    removeTypingIndicator(typing);
    addChatMessage('ai', fallbackMessage());
  }
}

// ── Missões procedurais geradas pela IA ─────────────────────────────────────

/**
 * Adiciona uma missão gerada proceduralmente na aba Treinador IA.
 * O nome/ícone é aleatório; em uma versão avançada, o título
 * pode vir parseado da resposta da IA.
 */
function generateAIMission() {
  const container = document.getElementById('aiMissions');

  // Remove o placeholder inicial se ainda existir
  if (container.textContent.includes('Peça ao')) container.innerHTML = '';

  const icon  = AI_MISSION_ICONS[Math.floor(Math.random() * AI_MISSION_ICONS.length)];
  const name  = AI_MISSION_NAMES[Math.floor(Math.random() * AI_MISSION_NAMES.length)];
  const xp    = 50 + Math.floor(Math.random() * 50);
  const coins = 20 + Math.floor(Math.random() * 20);

  const el = document.createElement('div');
  el.className = 'mission-item';
  el.innerHTML = `
    <div class="mission-icon">${icon}</div>
    <div class="mission-info">
      <div class="mission-name">${name}</div>
      <div class="mission-desc">Missão gerada pelo Mestre Zephyr</div>
    </div>
    <div class="mission-xp">+${xp} XP</div>
    <div class="check"></div>`;

  el.onclick = () => {
    gainXP(xp, coins);
    el.classList.add('done');
    el.style.opacity = '.6';
    el.onclick       = null;
    showToast('+' + xp + ' XP — Missão IA concluída!');
    render();
    saveState();
  };

  container.appendChild(el);
}

// ── Helpers do chat ──────────────────────────────────────────────────────────

/**
 * Adiciona uma mensagem ao chat (usuário ou IA).
 * @param {'user'|'ai'} role
 * @param {string} text
 */
function addChatMessage(role, text) {
  const box = document.getElementById('chatBox');
  const div = document.createElement('div');
  div.className = 'msg ' + (role === 'ai' ? 'msg-ai' : 'msg-user');

  if (role === 'ai') {
    div.innerHTML =
      '<span style="font-size:11px;color:var(--c-gold);font-weight:700;display:block;margin-bottom:4px">⚔️ Mestre Zephyr</span>' +
      text;
  } else {
    div.textContent = text;
  }

  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}

/**
 * Exibe o indicador de "digitando..." e retorna o elemento.
 * @returns {HTMLElement}
 */
function showTypingIndicator() {
  const chatBox = document.getElementById('chatBox');
  const el = document.createElement('div');
  el.className = 'msg msg-typing';
  el.innerHTML = '<div class="dots"><span></span><span></span><span></span></div>';
  chatBox.appendChild(el);
  chatBox.scrollTop = chatBox.scrollHeight;
  return el;
}

/**
 * Remove o indicador de digitando.
 * @param {HTMLElement} el
 */
function removeTypingIndicator(el) {
  try { document.getElementById('chatBox').removeChild(el); } catch (_) {}
}

/**
 * Mensagem de fallback quando a API não está disponível.
 * @returns {string}
 */
function fallbackMessage() {
  const fallbacks = [
    'O Mestre Zephyr está em treinamento astral... mas nunca desista! Cada rep conta, guerreiro! ⚔️',
    'A conexão com o reino foi perdida, mas sua força não! Continue sua jornada, campeão! 🔥',
    'Até os magos mais sábios ficam offline às vezes. Mas você? Você NUNCA para! 💪',
  ];
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}
