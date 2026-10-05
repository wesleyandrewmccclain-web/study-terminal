/* Game layer: boss "Assault" battles, XP + ranks, equippable chips, boot sequence.
   Original design. Uses only course content already in data.js. */
(() => {
  'use strict';
  const S = () => window.Study;
  const $ = s => document.querySelector(s);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- ranks & chips ---------- */
  const RANKS = [
    [0, 'RECRUIT UNIT'], [120, 'FIELD UNIT'], [300, 'SCOUT UNIT'], [550, 'COMBAT UNIT'],
    [900, 'ELITE UNIT'], [1400, 'COMMAND UNIT'], [2100, 'ARCHIVE KEEPER']
  ];
  const CHIPS = [
    { id: 'repair', name: 'AUTO-REPAIR', rank: 0, cost: 1, desc: '+1 integrity at the start of every Assault.' },
    { id: 'overclock', name: 'OVERCLOCK', rank: 1, cost: 1, desc: '+10 seconds on every Assault answer timer.' },
    { id: 'scanner', name: 'SCANNER', rank: 2, cost: 2, desc: 'Once per battle: strike out two wrong answers.' },
    { id: 'damage', name: 'DAMAGE UP', rank: 3, cost: 2, desc: '+25% damage on every correct answer.' },
    { id: 'counter', name: 'COUNTER SHIELD', rank: 4, cost: 2, desc: 'Your first wrong answer in a battle deals no damage.' },
    { id: 'combo', name: 'CHAIN AMPLIFIER', rank: 5, cost: 3, desc: 'Combo bonus builds twice as fast.' }
  ];
  const CAPACITY = 4;
  const BK = id => (window.ACTIVE_EXAM === 3 ? 'e3:' : '') + id;
  const BOSSES = window.ACTIVE_EXAM === 3 ? [
    { id: 'benefits', name: 'ACTUARY-12', sub: 'Benefits', sides: 7, hp: 150 },
    { id: 'compa', name: 'AUDITOR-09', sub: 'Compa-Ratios', sides: 4, hp: 100 },
    { id: 'payroll', name: 'LEDGER-09', sub: 'Payroll', sides: 6, hp: 120 },
    { id: 'flex', name: 'CONTRACTOR-10', sub: 'Flexible Workforce', sides: 5, hp: 150 },
    { id: 'exec', name: 'EXECUTIVE-10', sub: 'Executive Pay', sides: 3, hp: 90 },
    { id: 'all', name: 'CORE ARCHIVE 3', sub: 'Final: every Exam 3 topic', sides: 8, hp: 220 }
  ] : [
    { id: 'competitiveness', name: 'SENTINEL-06', sub: 'Defining Competitiveness', sides: 6, hp: 150 },
    { id: 'structures', name: 'ARCHITECT-07', sub: 'Pay Levels, Mix & Structures', sides: 4, hp: 150 },
    { id: 'merit', name: 'ASSESSOR-08', sub: 'Merit, Incentives & Appraisals', sides: 5, hp: 150 },
    { id: 'sam', name: 'FOREMAN', sub: 'Guest Speaker: Sam Lewis', sides: 3, hp: 120 },
    { id: 'all', name: 'CORE ARCHIVE', sub: 'Final: every Exam 2 topic', sides: 8, hp: 260 }
  ];

  const ops = () => { const st = S().state; st.ops = st.ops || { xp: 0, equipped: ['repair'], cleared: {}, best: {} }; return st.ops; };
  const rankIndex = xp => RANKS.reduce((r, [t], i) => (xp >= t ? i : r), 0);
  const rankInfo = () => {
    const xp = ops().xp, i = rankIndex(xp), next = RANKS[i + 1];
    return { i, name: RANKS[i][1], xp, floor: RANKS[i][0], next: next ? next[0] : null };
  };
  const chipOn = id => ops().equipped.includes(id);

  function gainXP(n, why) {
    const before = rankIndex(ops().xp);
    ops().xp += n;
    const after = rankIndex(ops().xp);
    S().save(); renderHUD();
    if (after > before) {
      const unlocked = CHIPS.filter(c => c.rank > before && c.rank <= after).map(c => c.name);
      setTimeout(() => S().sound('rankup'), 1400);
      banner(`RANK UP // ${RANKS[after][1]}`, unlocked.length ? `Chip unlocked: ${unlocked.join(', ')}. Equip it in Chips.` : 'Keep going.');
    }
  }

  /* ---------- HUD in top bar ---------- */
  function renderHUD() {
    let el = $('#ops-hud');
    const tools = $('.top-tools');
    if (!tools || !S()) return;
    if (!el) { el = document.createElement('button'); el.id = 'ops-hud'; el.dataset.action = 'mode'; el.dataset.mode = 'chips'; tools.prepend(el); }
    const r = rankInfo();
    const pct = r.next ? Math.round((r.xp - r.floor) / (r.next - r.floor) * 100) : 100;
    el.innerHTML = `<span class="hud-rank">${esc(r.name)}</span><span class="hud-bar"><i style="width:${pct}%"></i></span><span class="hud-xp">${r.xp} XP</span>`;
    el.title = r.next ? `${r.next - r.xp} XP to next rank` : 'Max rank';
  }

  function banner(title, text) {
    let b = $('#ops-banner');
    if (!b) { b = document.createElement('div'); b.id = 'ops-banner'; b.setAttribute('role', 'status'); document.body.appendChild(b); }
    b.innerHTML = `<strong>${esc(title)}</strong><span>${esc(text)}</span>`;
    b.classList.remove('show'); void b.offsetWidth; b.classList.add('show');
    clearTimeout(banner.t); banner.t = setTimeout(() => b.classList.remove('show'), 3600);
  }

  /* ---------- Chips page ---------- */
  function chipsPage() {
    S().setPage('chips');
    const r = rankInfo(), used = ops().equipped.reduce((n, id) => n + (CHIPS.find(c => c.id === id)?.cost || 0), 0);
    const pct = r.next ? Math.round((r.xp - r.floor) / (r.next - r.floor) * 100) : 100;
    $('#app').innerHTML = S().heading('SYSTEM / CHIPS', 'Unit configuration', 'Earn XP in every mode (+10 per correct answer, more in Assault). Ranking up unlocks chips that change how Assault battles play.') +
      `<section class="panel ops-rank"><div><div class="eyebrow">CURRENT RANK</div><h2>${esc(r.name)}</h2><p class="source">${r.xp} XP${r.next ? ` · ${r.next - r.xp} XP to ${esc(RANKS[r.i + 1][1])}` : ' · maximum rank'}</p></div><div class="ops-meter"><i style="width:${pct}%"></i></div></section>
      <div class="section-line"><h2>CHIP SLOTS</h2><span>CAPACITY ${used} / ${CAPACITY}</span></div>
      <section class="chip-grid">${CHIPS.map(c => {
        const locked = c.rank > r.i, on = chipOn(c.id);
        return `<button class="chip ${on ? 'on' : ''} ${locked ? 'locked' : ''}" data-action="ops-chip" data-chip="${c.id}" ${locked ? 'disabled' : ''} aria-pressed="${on}">
          <span class="chip-top"><span class="chip-name">${esc(c.name)}</span><span class="chip-cost">${'■'.repeat(c.cost)}${'□'.repeat(3 - c.cost)}</span></span>
          <span class="chip-desc">${esc(c.desc)}</span>
          <span class="chip-state">${locked ? 'LOCKED · REACH ' + esc(RANKS[c.rank][1]) : on ? 'EQUIPPED' : 'TAP TO EQUIP'}</span></button>`;
      }).join('')}</section>
      <div class="section-line"><h2>ASSAULT RECORD</h2><span>${BOSSES.filter(b => ops().cleared[BK(b.id)]).length} / ${BOSSES.length} CLEARED</span></div>
      <section class="panel">${BOSSES.map(b => `<p class="source">${esc(b.name)} · ${esc(b.sub)} — ${ops().cleared[BK(b.id)] ? 'CLEARED · best integrity ' + ops().best[BK(b.id)] : 'NOT CLEARED'}</p>`).join('')}
      <div class="actions"><button class="primary" data-action="mode" data-mode="assault">Go to Assault →</button><button data-action="ops-intro">Replay terminal intro</button></div></section>`;
  }
  function toggleChip(id) {
    const c = CHIPS.find(x => x.id === id), eq = ops().equipped;
    if (eq.includes(id)) ops().equipped = eq.filter(x => x !== id);
    else {
      const used = eq.reduce((n, x) => n + (CHIPS.find(y => y.id === x)?.cost || 0), 0);
      if (used + c.cost > CAPACITY) { S().sound('error'); S().toast('Not enough chip capacity. Unequip something first.'); return; }
      eq.push(id);
    }
    S().sound('chip'); S().save(); chipsPage();
  }

  /* ---------- Assault (boss battle) ---------- */
  let battle = null, raf = 0;

  function assaultSetup() {
    stopLoop();
    S().setPage('assault');
    const o = ops();
    $('#app').innerHTML = S().heading('COMBAT / 07', 'Assault', 'Answer to fire. Miss, and the target hits back. Clear a target by bringing its core to zero before your integrity runs out.') +
      `<section class="boss-grid">${BOSSES.map((b, i) => {
        const n = S().data.questions.filter(q => b.id === 'all' || q.topic === b.id).length;
        return `<button class="boss-card ${o.cleared[BK(b.id)] ? 'cleared' : ''}" data-action="ops-start" data-boss="${b.id}">
          <span class="eyebrow">TARGET ${String(i + 1).padStart(2, '0')} ${o.cleared[BK(b.id)] ? '· CLEARED' : ''}</span>
          <canvas class="boss-thumb" width="88" height="88" data-sides="${b.sides}"></canvas>
          <strong>${esc(b.name)}</strong><span>${esc(b.sub)}</span><span class="source">${n} questions · core ${b.hp}</span></button>`;
      }).join('')}</section>
      <p class="source" style="margin-top:16px">Equipped chips: ${ops().equipped.map(id => esc(CHIPS.find(c => c.id === id)?.name)).join(', ') || 'none'} · <button class="text-button" data-action="mode" data-mode="chips">Configure ↗</button></p>`;
    document.querySelectorAll('.boss-thumb').forEach(c => drawThumb(c, +c.dataset.sides));
  }

  function drawThumb(c, sides) {
    const g = c.getContext('2d'); g.clearRect(0, 0, 88, 88); g.strokeStyle = '#353831'; g.lineWidth = 1.5;
    for (let r = 12; r <= 38; r += 13) poly(g, 44, 44, r, sides, r / 30);
    g.fillStyle = '#a5463b'; g.fillRect(40, 40, 8, 8);
  }
  function poly(g, x, y, r, n, rot) {
    g.beginPath();
    for (let i = 0; i <= n; i++) { const a = rot + i * Math.PI * 2 / n; g[i ? 'lineTo' : 'moveTo'](x + Math.cos(a) * r, y + Math.sin(a) * r); }
    g.stroke();
  }

  function startBattle(id) {
    const boss = BOSSES.find(b => b.id === id);
    const pool = S().shuffle(S().data.questions.filter(q => id === 'all' || q.topic === id));
    const maxHp = 3 + (chipOn('repair') ? 1 : 0);
    battle = {
      boss, pool, qi: 0, hp: boss.hp, maxHp, integrity: maxHp, combo: 0, bestCombo: 0,
      shield: chipOn('counter'), scanUsed: false, struck: [], answered: null, deadline: 0,
      order: null, fx: { shake: 0, flash: 0, bossFlash: 0, beams: [], bullets: [], parts: [], t: 0, dead: 0 },
      correct: 0, wrong: 0, over: false, won: false, charged: false, charge: null,
      lines: window.Fun?.bossLines?.(id === 'all' ? 'all' : id) || null
    };
    battle.line = battle.lines?.intro || '';
    S().sound('start');
    renderBattle(); nextQuestion(true); loop();
  }


  /* ---------- boss voice + charge attack ---------- */
  const pickLine = arr => Array.isArray(arr) && arr.length ? arr[Math.floor(Math.random() * arr.length)] : '';
  function setLine(t) { const b = battle; if (!b) return; b.line = t || ''; const el = $('#b-line'); if (el) { el.textContent = b.line; el.classList.remove('say'); void el.offsetWidth; el.classList.add('say'); } }
  const CHARGE_TYPES = window.ACTIVE_EXAM === 3
    ? { benefits: ['workcomp'], compa: ['groupcompa', 'compa'], payroll: ['overtime', 'netpay'], flex: ['lease'], exec: ['exec'], all: ['workcomp', 'groupcompa', 'overtime', 'lease', 'exec', 'netpay'] }
    : { competitiveness: ['labor'], structures: ['annualize', 'points'], merit: ['piecework', 'per-unit'], sam: ['annualize', 'labor'], all: ['annualize', 'weighted', 'piecework', 'labor', 'points'] };
  function makeCharge(id) {
    const types = CHARGE_TYPES[id] || CHARGE_TYPES.all; if (!types || !window.MathEngine) return null;
    try { const p = window.MathEngine.generate(types[Math.floor(Math.random() * types.length)]); const field = p.fields[p.fields.length - 1]; return { p, field, deadline: Date.now() + 75000 }; } catch (e) { return null; }
  }
  function renderCharge() {
    const b = battle, c = b.charge, box = $('#b-q'); if (!box) return;
    const done = c.result;
    box.innerHTML = `<div class="charge-warn">⚠ CHARGE ATTACK · solve it to block and counter</div><p class="source">${esc(c.p.title)}</p><h2 class="q-prompt">${esc(c.p.prompt)}</h2>${c.p.table && S().tableHTML ? S().tableHTML(c.p.table) : ''}
      <label class="field charge-field">${esc(c.field.label)}${c.field.unit ? ` (${esc(c.field.unit)})` : ''}<input id="charge-in" type="text" inputmode="decimal" data-math-field autocomplete="off" ${done ? 'disabled' : ''} value="${esc(c.input || '')}"></label>
      ${done ? `<div class="feedback ${c.result.ok ? '' : 'wrong'}"><h3>${c.result.ok ? 'BLOCKED · COUNTER −25 CORE' : c.result.timeout ? 'TOO SLOW · INTEGRITY −2' : 'BLOCK FAILED · INTEGRITY −2'}</h3><p><strong>Answer:</strong> ${esc(String(c.field.answer))}</p><p class="source">${esc((c.p.steps || []).join(' '))}</p></div><div class="actions"><span></span><button class="primary" data-action="ops-next">${b.over ? 'Debrief →' : 'Continue →'}</button></div>`
        : `<div class="actions"><span class="source">You only need the final answer. The calculator is at the top.</span><button class="primary" data-action="ops-block">Block →</button></div>`}`;
    if (!done) setTimeout(() => $('#charge-in')?.focus({ preventScroll: true }), 30); else box.querySelector('[data-action="ops-next"]')?.focus({ preventScroll: true });
  }
  function resolveCharge(timeout) {
    const b = battle, c = b?.charge; if (!c || c.result) return;
    c.input = $('#charge-in')?.value || ''; const ok = !timeout && window.MathEngine.checkField(c.field, c.input);
    c.result = { ok, timeout }; b.answered = { ok, charge: true };
    if (ok) { b.hp -= 25; b.correct++; fire(); S().sound('hit'); gainXP(15, 'assault'); setLine(pickLine(b.lines?.hurt) || 'Blocked.'); if (b.hp <= 0) endBattle(true); }
    else { b.wrong++; const dmg = b.shield ? 1 : 2; b.shield = false; b.integrity -= dmg; hitFx(); S().sound('damage'); setLine(pickLine(b.lines?.taunt)); if (b.integrity <= 0) endBattle(false); }
    updateBars(); renderCharge();
  }

  const timeLimit = () => 25 + (chipOn('overclock') ? 10 : 0);

  function nextQuestion(first) {
    const b = battle;
    if (b.charge) { b.charge = null; b.answered = null; }
    else if (!first && !b.charged && b.hp <= b.boss.hp * 0.5) {
      const c = makeCharge(b.boss.id);
      if (c) { b.charged = true; b.charge = c; b.answered = null; b.deadline = c.deadline; setLine(b.lines?.charge || 'Charging…'); S().sound('timer'); renderCharge(); return; }
    }
    if (!first) b.qi++;
    if (b.qi >= b.pool.length) { b.pool = S().shuffle(b.pool); b.qi = 0; }
    b.answered = null; b.struck = [];
    b.order = S().shuffle([0, 1, 2, 3]).filter(i => b.pool[b.qi].options[i] != null);
    b.deadline = Date.now() + timeLimit() * 1000;
    renderQuestion();
  }

  function renderBattle() {
    const b = battle;
    $('#app').innerHTML = `<div class="battle">
      <div class="battle-top"><div><div class="eyebrow">ASSAULT // ${esc(b.boss.sub.toUpperCase())}</div><h1>${esc(b.boss.name)}</h1></div>
      <button data-action="ops-retreat">Retreat</button></div><p class="boss-line" id="b-line" aria-live="polite">${esc(b.line || '')}</p>
      <div class="bars"><div class="bar-label">CORE <span id="b-hp"></span></div><div class="bar boss"><i id="b-hpbar"></i></div>
      <div class="bar-label">INTEGRITY <span id="b-int"></span> <span id="b-combo" class="combo"></span></div><div class="pips" id="b-pips"></div></div>
      <canvas id="arena" aria-hidden="true"></canvas>
      <div class="timer"><i id="b-timer"></i></div>
      <section class="panel battle-q" id="b-q"></section></div>`;
    sizeArena(); updateBars();
  }

  function updateBars() {
    const b = battle; if (!b || !$('#b-hp')) return;
    $('#b-hp').textContent = Math.max(0, Math.ceil(b.hp)) + ' / ' + b.boss.hp;
    $('#b-hpbar').style.width = Math.max(0, b.hp / b.boss.hp * 100) + '%';
    $('#b-int').textContent = b.integrity + ' / ' + b.maxHp + (b.shield ? ' · SHIELD' : '');
    $('#b-pips').innerHTML = Array.from({ length: b.maxHp }, (_, i) => `<i class="${i < b.integrity ? 'on' : ''}"></i>`).join('');
    $('#b-combo').textContent = b.combo > 1 ? `CHAIN ×${b.combo}` : '';
  }

  function renderQuestion() {
    const b = battle, q = b.pool[b.qi], box = $('#b-q'); if (!box) return;
    const L = 'ABCD';
    const opts = b.order.map((oi, k) => {
      let cls = '';
      if (b.answered) { if (oi === q.answer) cls = 'right'; else if (oi === b.answered.pick) cls = 'wrong'; }
      if (b.struck.includes(oi)) cls += ' struck';
      return `<button class="answer ${cls}" data-action="ops-answer" data-opt="${oi}" ${b.answered || b.struck.includes(oi) ? 'disabled' : ''}><span class="letter">${L[k]}</span><span>${esc(q.options[oi])}</span></button>`;
    }).join('');
    const fb = b.answered ? `<div class="feedback ${b.answered.ok ? '' : 'wrong'}"><h3>${b.answered.timeout ? 'SIGNAL LOST: TIME EXPIRED' : b.answered.ok ? 'HIT CONFIRMED · −' + b.answered.dmg + ' CORE' : b.answered.blocked ? 'SHIELD ABSORBED THE HIT' : 'ERROR: INCORRECT · INTEGRITY −1'}</h3>
      <p><strong>Keyed answer:</strong> ${esc(q.answerKeyText || q.options[q.answer])}</p>${q.explanation ? `<p>${esc(q.explanation)}</p>` : ''}</div>
      <div class="actions"><span></span><button class="primary" data-action="ops-next">${b.over ? (b.won ? 'Debrief →' : 'Debrief →') : 'Continue →'}</button></div>` : '';
    const scan = chipOn('scanner') && !b.scanUsed && !b.answered ? `<button class="text-button scan" data-action="ops-scan">▣ Run SCANNER (strike 2 wrong answers)</button>` : '';
    box.innerHTML = `<p class="source">${esc(q.source || '')}</p><h2 class="q-prompt">${esc(q.prompt)}</h2><div class="answers">${opts}</div>${scan}${fb}`;
    if (b.answered) box.querySelector('[data-action="ops-next"]')?.focus({ preventScroll: true });
  }

  function answerQ(pick, timeout) {
    const b = battle; if (!b || b.answered || b.over) return;
    if (b.charge) { if (timeout) resolveCharge(true); return; }
    const q = b.pool[b.qi], ok = !timeout && pick === q.answer;
    S().record(q.id, q.topic, ok);
    if (ok) {
      b.combo += chipOn('combo') ? 2 : 1; b.bestCombo = Math.max(b.bestCombo, b.combo); b.correct++;
      const mult = 1 + Math.min(1, (b.combo - 1) * 0.15);
      const dmg = Math.round(12.5 * mult * (chipOn('damage') ? 1.25 : 1));
      b.hp -= dmg; b.answered = { pick, ok, dmg };
      fire(); S().sound('hit'); gainXP(5, 'assault'); setLine(pickLine(b.lines?.hurt));
      if (b.hp <= 0) endBattle(true);
    } else {
      b.combo = 0; b.wrong++; setLine(pickLine(b.lines?.taunt));
      if (b.shield) { b.shield = false; b.answered = { pick, ok, blocked: true, timeout }; S().sound('shield'); shieldFx(); }
      else { b.integrity--; b.answered = { pick, ok, timeout }; hitFx(); S().sound('damage'); if (b.integrity <= 0) endBattle(false); }
    }
    updateBars(); renderQuestion();
  }

  function endBattle(won) {
    const b = battle; b.over = true; b.won = won;
    if (won) {
      const o = ops(), k = BK(b.boss.id), first = !o.cleared[k];
      o.cleared[k] = true; o.best[k] = Math.max(o.best[k] || 0, b.integrity);
      b.fx.dead = 1; setLine(b.lines?.defeat || ''); S().sound('explode'); setTimeout(() => S().sound('victory'), 750); gainXP(first ? 150 : 60, 'clear');
    } else { setTimeout(() => S().sound('defeat'), 350); }
  }

  function debrief() {
    const b = battle; stopLoop();
    S().setPage('assault');
    const acc = b.correct + b.wrong ? Math.round(b.correct / (b.correct + b.wrong) * 100) : 0;
    $('#app').innerHTML = S().heading(b.won ? 'ASSAULT // TARGET DESTROYED' : 'ASSAULT // UNIT DOWN', b.won ? `${b.boss.name} neutralized` : 'Integrity lost',
      b.won ? (b.lines?.defeat ? '“' + b.lines.defeat + '” Core reduced to zero. Record updated.' : 'Core reduced to zero. Record updated.') : 'The target outlasted you this time. Missed questions were added to your review list.') +
      `<section class="panel"><div class="result-score">${b.correct}<small> hits / ${b.wrong} misses</small></div>
      <p class="source">Accuracy ${acc}% · longest chain ×${b.bestCombo} · integrity left ${Math.max(0, b.integrity)} / ${b.maxHp}</p>
      <div class="actions"><button data-action="mode" data-mode="assault">Target select</button><button class="primary" data-action="ops-start" data-boss="${b.boss.id}">${b.won ? 'Run it again' : 'Retry'} →</button></div></section>
      <p class="source" style="margin-top:14px">Tip: Quiz → “Missed questions only” replays every question you missed here.</p>`;
    battle = null;
  }

  /* ---------- arena rendering ---------- */
  let W = 0, H = 0, dpr = 1;
  function sizeArena() {
    const c = $('#arena'); if (!c) return;
    dpr = Math.min(2, window.devicePixelRatio || 1);
    W = c.clientWidth; H = c.clientHeight;
    c.width = W * dpr; c.height = H * dpr;
  }
  window.addEventListener('resize', () => { if (battle) sizeArena(); });

  function fire() {
    const f = battle.fx;
    for (let i = 0; i < 5; i++) f.beams.push({ x: 0, t: 0, off: (i - 2) * 7, delay: i * 0.05 });
    f.bossFlash = 1;
  }
  function hitFx() { battle.fx.shake = 1; battle.fx.flash = 1; }
  function shieldFx() { battle.fx.flash = 0.4; }

  function stopLoop() { cancelAnimationFrame(raf); raf = 0; }
  function loop() {
    stopLoop();
    let last = performance.now();
    const step = now => {
      const c = $('#arena');
      if (!battle || !c || S().page !== 'assault') { raf = 0; return; }
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      tickTimer(); draw(c, dt);
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
  }

  function tickTimer() {
    const b = battle, el = $('#b-timer'); if (!el) return;
    if (b.answered || b.over) { el.style.width = el.style.width || '0%'; return; }
    const left = (b.deadline - Date.now()) / 1000, pct = Math.max(0, Math.min(100, left / (b.charge ? 75 : timeLimit()) * 100));
    el.style.width = pct + '%'; el.classList.toggle('low', left < 6);
    const sec = Math.ceil(left); if (left < 5.5 && left > 0 && sec !== b.lastTick) { b.lastTick = sec; S().sound('tick'); }
    if (left <= 0) answerQ(-1, true);
  }

  function draw(c, dt) {
    const b = battle, f = b.fx, g = c.getContext('2d');
    f.t += dt * (reduced ? 0.3 : 1);
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    let sx = 0, sy = 0;
    if (f.shake > 0 && !reduced) { sx = (Math.random() - .5) * 12 * f.shake; sy = (Math.random() - .5) * 8 * f.shake; }
    f.shake = Math.max(0, f.shake - dt * 3);
    g.clearRect(0, 0, W, H);
    g.save(); g.translate(sx, sy);
    // grid
    g.strokeStyle = 'rgba(53,56,49,.08)'; g.lineWidth = 1;
    for (let x = (f.t * 12) % 32; x < W; x += 32) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); }
    for (let y = 0; y < H; y += 32) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
    const bx = W / 2, by = H * 0.3, px = W / 2 + Math.sin(f.t * 1.3) * Math.min(160, W * 0.3), py = H * 0.84;
    // bullets (decorative bullet-hell spiral)
    if (!b.over || !b.won) {
      const rate = reduced ? 0.25 : 0.07; f.spawn = (f.spawn || 0) + dt;
      while (f.spawn > rate) {
        f.spawn -= rate; const n = b.boss.sides;
        for (let k = 0; k < 2; k++) { const a = f.t * 1.7 + k * Math.PI + (f.bullets.length % n) * 0.02; f.bullets.push({ x: bx, y: by, vx: Math.cos(a) * 70, vy: Math.sin(a) * 70, r: 4 + (k % 2) * 2 }); }
      }
    }
    f.bullets = f.bullets.filter(p => (p.x += p.vx * dt, p.y += p.vy * dt, p.x > -20 && p.x < W + 20 && p.y > -20 && p.y < H + 20));
    for (const p of f.bullets) { g.fillStyle = p.r > 5 ? '#b8663f' : '#a5463b'; g.beginPath(); g.arc(p.x, p.y, p.r, 0, 7); g.fill(); g.strokeStyle = 'rgba(238,235,223,.8)'; g.lineWidth = 1; g.stroke(); }
    // boss
    const dead = b.over && b.won;
    if (dead) f.dead = Math.min(3, f.dead + dt);
    if (!dead || f.dead < 0.6) {
      g.save(); g.translate(bx, by);
      const pulse = 1 + Math.sin(f.t * 3) * 0.03 + f.bossFlash * 0.08;
      g.scale(pulse, pulse);
      g.strokeStyle = f.bossFlash > 0.2 ? '#eeebdf' : '#353831'; g.lineWidth = 2;
      const R = Math.min(62, H * 0.24);
      for (let i = 0; i < 3; i++) poly(g, 0, 0, R * (0.45 + i * 0.28), b.boss.sides, (i % 2 ? -1 : 1) * f.t * (0.5 + i * 0.3));
      g.fillStyle = f.bossFlash > 0.2 ? '#eeebdf' : '#353831'; g.fillRect(-9, -9, 18, 18);
      g.fillStyle = '#a5463b'; g.fillRect(-4, -4, 8, 8);
      g.restore();
    }
    if (dead && !f.exploded) { f.exploded = 1; for (let i = 0; i < 70; i++) { const a = Math.random() * 7, v = 60 + Math.random() * 220; f.parts.push({ x: bx, y: by, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 1.4, s: 3 + Math.random() * 7 }); } f.bullets = []; }
    f.bossFlash = Math.max(0, f.bossFlash - dt * 3);
    // beams
    f.beams = f.beams.filter(bm => { bm.delay -= dt; if (bm.delay > 0) return true; bm.t += dt * 3.2; return bm.t < 1; });
    for (const bm of f.beams) if (bm.delay <= 0) {
      const y = py - (py - by) * bm.t, x = px + (bx - px) * bm.t + bm.off;
      g.strokeStyle = '#353831'; g.lineWidth = 3; g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + 18); g.stroke();
      if (bm.t > 0.9) for (let i = 0; i < 3; i++) f.parts.push({ x: bx + bm.off, y: by, vx: (Math.random() - .5) * 160, vy: (Math.random() - .5) * 160, life: .5, s: 3 });
    }
    // particles
    f.parts = f.parts.filter(p => (p.x += p.vx * dt, p.y += p.vy * dt, p.life -= dt, p.life > 0));
    for (const p of f.parts) { g.globalAlpha = Math.min(1, p.life * 1.5); g.fillStyle = '#353831'; g.fillRect(p.x, p.y, p.s, p.s); }
    g.globalAlpha = 1;
    // player unit
    if (b.integrity > 0) {
      g.save(); g.translate(px, py);
      g.fillStyle = '#353831'; g.beginPath(); g.moveTo(0, -13); g.lineTo(10, 0); g.lineTo(0, 13); g.lineTo(-10, 0); g.closePath(); g.fill();
      g.fillStyle = '#eeebdf'; g.fillRect(-2.5, -2.5, 5, 5);
      if (b.shield) { g.strokeStyle = 'rgba(69,98,71,.7)'; g.lineWidth = 1.5; g.beginPath(); g.arc(0, 0, 20, 0, 7); g.stroke(); }
      g.restore();
    }
    g.restore();
    if (f.flash > 0) { g.fillStyle = `rgba(165,70,59,${f.flash * 0.28})`; g.fillRect(0, 0, W, H); f.flash = Math.max(0, f.flash - dt * 2.5); }
    // scan text
    g.fillStyle = 'rgba(53,56,49,.55)'; g.font = '10px "Courier New", monospace';
    g.fillText(dead ? 'TARGET DESTROYED' : `LOCK // ${b.boss.name}`, 10, 16);
    g.fillText(`CHAIN ×${b.combo}`, W - 70, 16);
  }

  /* ---------- boot sequence ---------- */
  let skipIntro = null;
  function boot() {
    if ($('#ops-boot')) return;
    const el = document.createElement('div'); el.id = 'ops-boot';
    el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', 'Study terminal intro');
    const r = rankInfo();
    const exam = String(window.ACTIVE_EXAM || S().data.exam || 2).padStart(2, '0');
    const lines = ['BOOTING STUDY TERMINAL ........ OK', `LOADING ARCHIVE: EXAM ${exam} ....... OK`, `QUESTIONS ${S().data.questions.length} · CARDS ${S().data.flashcards.length} · MATH ${S().data.math.length}`, `OPERATOR: ${(window.Profiles?.current().name || 'GUEST').toUpperCase()}`, `UNIT STATUS: ${r.name} · ${r.xp} XP`, 'ALL SYSTEMS NOMINAL.'];
    el.innerHTML = '<pre aria-hidden="true"></pre><button type="button" style="align-self:flex-start;margin-top:24px">Skip intro →</button>'; document.body.appendChild(el);
    window.NavUI?.openDialog(); el.querySelector('button').focus();
    const pre = el.querySelector('pre'); let li = 0, ci = 0, done = false;
    const end = () => { if (done) return; done = true; el.classList.add('out'); setTimeout(() => { el.remove(); skipIntro = null; window.NavUI?.closeDialog(); }, reduced ? 0 : 450); };
    skipIntro = end;
    el.addEventListener('click', end);
    const type = () => {
      if (done) return;
      if (li >= lines.length) { setTimeout(end, 450); return; }
      if (ci === 0) S().sound('type');
      pre.textContent += lines[li][ci++] || '';
      if (ci > lines[li].length) { pre.textContent += '\n'; li++; ci = 0; setTimeout(type, 110); } else setTimeout(type, 9);
    };
    if (reduced) { pre.textContent = lines.join('\n'); setTimeout(end, 1000); } else type();
  }

  /* ---------- wiring ---------- */
  window.Ops = {
    modes: [['assault', 'Assault', 'Boss battles. Answer to fire.', 'assault'], ['chips', 'Chips & Rank', 'Spend your XP on upgrades.', 'chips']],
    mode(p) { if (p === 'assault') { assaultSetup(); return true; } if (p === 'chips') { stopLoop(); chipsPage(); return true; } return false; },
    onRecord(correct) { if (correct) gainXP(10); },
    handle(a, b) {
      if (!a.startsWith('ops-')) return false;
      if (a === 'ops-intro') boot();
      else if (a === 'ops-start') startBattle(b.dataset.boss);
      else if (a === 'ops-answer') answerQ(+b.dataset.opt);
      else if (a === 'ops-block') resolveCharge(false);
      else if (a === 'ops-next') { if (battle?.over) debrief(); else { nextQuestion(); } }
      else if (a === 'ops-retreat') { battle = null; stopLoop(); assaultSetup(); }
      else if (a === 'ops-chip') toggleChip(b.dataset.chip);
      else if (a === 'ops-scan' && battle && !battle.scanUsed) {
        const q = battle.pool[battle.qi]; battle.scanUsed = true;
        battle.struck = S().shuffle(battle.order.filter(i => i !== q.answer)).slice(0, 2); S().sound('hint'); renderQuestion();
      }
      return true;
    },
    leave() { stopLoop(); },
    skipIntro() { skipIntro?.(); },
    init() { ops(); renderHUD(); }
  };
  document.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.id === 'charge-in' && battle?.charge && !battle.charge.result) { e.preventDefault(); resolveCharge(false); } });
  document.addEventListener('keydown', e => {
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || !battle || S().page !== 'assault' || document.querySelector('[role="dialog"][aria-modal="true"]') || document.body.classList.contains('nav-open') || e.target.closest('input, textarea, select, [contenteditable="true"]')) return;
    const k = e.key.toUpperCase(), idx = 'ABCD1234'.indexOf(k);
    if (!battle.answered && idx >= 0) { const oi = battle.order[idx % 4]; if (oi != null && !battle.struck.includes(oi)) answerQ(oi); }
    else if (battle.answered && (e.key === 'Enter' || e.key === ' ') && !e.target.closest('button, a')) { e.preventDefault(); battle.over ? debrief() : nextQuestion(); }
  });
})();
