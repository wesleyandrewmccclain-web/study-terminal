/* Pop-up calculator: safe expression parser (no eval), tape of recent results,
   and "Insert" into the answer box you last focused. */
(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const MATH_PAGES = ['math', 'sheet', 'mathexam', 'exam', 'drill'];
  const FIELD_SEL = '[data-math-field],[data-ws],[data-wt]';
  let expr = '', tape = [], lastField = null, justEvaluated = false;

  /* ---------- parser: numbers, + − × ÷, parentheses, %, unary minus ---------- */
  function tokenize(s) {
    const t = []; let i = 0;
    s = s.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-').replace(/,/g, '');
    while (i < s.length) {
      const c = s[i];
      if (/\s/.test(c)) { i++; continue; }
      if (/[0-9.]/.test(c)) { let j = i; while (j < s.length && /[0-9.]/.test(s[j])) j++; const n = s.slice(i, j); if ((n.match(/\./g) || []).length > 1) throw Error('Two decimal points in one number'); t.push({ n: parseFloat(n) }); i = j; continue; }
      if ('+-*/()%^'.includes(c)) { t.push({ o: c }); i++; continue; }
      throw Error('Unknown symbol ' + c);
    }
    return t;
  }
  function evaluate(s) {
    const t = tokenize(s); let p = 0;
    const peek = () => t[p], take = () => t[p++];
    function primary() {
      const k = take(); if (!k) throw Error('Incomplete');
      if (k.o === '-') return -factor();
      if (k.o === '+') return factor();
      if (k.o === '(') { const v = sum(); if (!peek() || peek().o !== ')') throw Error('Missing )'); take(); return v; }
      if ('n' in k) return k.n;
      throw Error('Unexpected ' + k.o);
    }
    function postfix() { let v = primary(); while (peek() && peek().o === '%') { take(); v = v / 100; } return v; }
    function factor() { let v = postfix(); if (peek() && peek().o === '^') { take(); v = Math.pow(v, factor()); } return v; }
    function product() {
      let v = factor();
      while (peek() && (peek().o === '*' || peek().o === '/' || peek().o === '(' || 'n' in (peek() || {}))) {
        const k = peek(); if (k.o === '*' || k.o === '/') take();
        const r = factor(); if (k.o === '/') { if (r === 0) throw Error('Can’t divide by 0'); v /= r; } else v *= r;
      }
      return v;
    }
    function sum() { let v = product(); while (peek() && (peek().o === '+' || peek().o === '-')) { const k = take(); const r = product(); v = k.o === '+' ? v + r : v - r; } return v; }
    const v = sum(); if (p < t.length) throw Error('Check the parentheses');
    if (!Number.isFinite(v)) throw Error('Result too large');
    return Math.round(v * 1e10) / 1e10;
  }
  const show = v => Number(v).toLocaleString('en-US', { maximumFractionDigits: 10 });
  const plain = v => String(Math.round(v * 1e10) / 1e10);

  /* ---------- UI ---------- */
  function build() {
    if ($('#calc')) return;
    const keys = [['C', 'clear'], ['(', '('], [')', ')'], ['⌫', 'back'], ['7', '7'], ['8', '8'], ['9', '9'], ['÷', '÷'], ['4', '4'], ['5', '5'], ['6', '6'], ['×', '×'], ['1', '1'], ['2', '2'], ['3', '3'], ['−', '−'], ['0', '0'], ['.', '.'], ['%', '%'], ['+', '+']];
    const el = document.createElement('section');
    el.id = 'calc'; el.hidden = true; el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', 'Calculator');
    el.innerHTML = `<header class="calc-head" id="calc-drag"><span>CALCULATOR</span><button class="calc-x" data-action="calc-close" aria-label="Close calculator">×</button></header>
      <ol class="calc-tape" id="calc-tape" aria-label="Recent calculations"></ol>
      <div class="calc-screen"><div class="calc-expr" id="calc-expr" aria-live="polite"></div><div class="calc-err" id="calc-err" role="alert"></div></div>
      <div class="calc-keys">${keys.map(([l, v]) => `<button class="calc-k ${/[÷×−+]/.test(l) ? 'op' : ''} ${v === 'clear' ? 'clr' : ''}" data-action="calc-key" data-k="${esc(v)}">${l}</button>`).join('')}
        <button class="calc-k eq" data-action="calc-key" data-k="=">=</button></div>
      <div class="calc-foot"><button data-action="calc-insert" id="calc-insert">Insert into answer ↵</button><span class="calc-hint" id="calc-hint"></span></div>`;
    document.body.appendChild(el);
    makeDraggable(el, $('#calc-drag'));
    render();
  }
  function render() {
    $('#calc-expr').textContent = expr || '0';
    $('#calc-tape').innerHTML = tape.slice(-4).map(r => `<li><button data-action="calc-reuse" data-v="${esc(plain(r.v))}" title="Use this result"><span>${esc(r.e)} =</span> <b>${esc(show(r.v))}</b></button></li>`).join('');
    const f = lastField && lastField.isConnected && !lastField.disabled ? lastField : null;
    $('#calc-insert').disabled = !f || !currentValue();
    $('#calc-hint').textContent = f ? 'into: ' + (fieldLabel(f) || 'answer box') : 'Tap an answer box first';
  }
  function fieldLabel(f) { const l = f.closest('label'); return l ? (l.childNodes[0]?.textContent || l.textContent || '').trim().slice(0, 32) : f.getAttribute('aria-label') || ''; }
  function currentValue() {
    if (!expr) return tape.length ? tape[tape.length - 1].v : null;
    try { return evaluate(expr); } catch (e) { return null; }
  }
  function press(k) {
    $('#calc-err').textContent = '';
    if (k === 'clear') { expr = ''; justEvaluated = false; }
    else if (k === 'back') { expr = expr.slice(0, -1); justEvaluated = false; }
    else if (k === '=') {
      if (!expr) return render();
      try { const v = evaluate(expr); tape.push({ e: expr, v }); if (tape.length > 20) tape.shift(); expr = plain(v); justEvaluated = true; window.StudyAudio?.play('select'); }
      catch (e) { $('#calc-err').textContent = e.message; window.StudyAudio?.play('error'); }
    } else {
      if (justEvaluated && /[0-9.(]/.test(k)) expr = '';
      justEvaluated = false; expr += k;
    }
    render();
  }
  function insert() {
    const f = lastField && lastField.isConnected ? lastField : null, v = currentValue();
    if (!f || v == null) return;
    if (expr && !justEvaluated) { tape.push({ e: expr, v }); expr = plain(v); justEvaluated = true; }
    f.value = plain(v); f.dispatchEvent(new Event('input', { bubbles: true })); f.focus({ preventScroll: true });
    f.classList.add('calc-filled'); setTimeout(() => f.classList.remove('calc-filled'), 700);
    window.StudyAudio?.play('chip'); render();
  }
  function open() { build(); const el = $('#calc'); el.hidden = false; $('#calc-fab')?.classList.add('hidden'); render(); el.querySelector('.calc-k.eq').focus({ preventScroll: true }); }
  function close() { const el = $('#calc'); if (el) el.hidden = true; syncFab(); }
  const isOpen = () => $('#calc') && !$('#calc').hidden;

  function makeDraggable(el, handle) {
    let sx = 0, sy = 0, ox = 0, oy = 0, drag = false;
    handle.addEventListener('pointerdown', e => {
      if (e.target.closest('button') || matchMedia('(max-width:720px)').matches) return;
      drag = true; handle.setPointerCapture(e.pointerId); const r = el.getBoundingClientRect(); sx = e.clientX; sy = e.clientY; ox = r.left; oy = r.top;
    });
    handle.addEventListener('pointermove', e => {
      if (!drag) return;
      const x = Math.min(innerWidth - 60, Math.max(0, ox + e.clientX - sx)), y = Math.min(innerHeight - 40, Math.max(0, oy + e.clientY - sy));
      Object.assign(el.style, { left: x + 'px', top: y + 'px', right: 'auto', bottom: 'auto' });
    });
    handle.addEventListener('pointerup', () => { drag = false; });
  }

  /* ---------- entry points ---------- */
  function topButton() {
    const tools = $('.top-tools'); if (!tools || $('#calc-top')) return;
    const b = document.createElement('button'); b.id = 'calc-top'; b.dataset.action = 'calc-toggle'; b.textContent = 'Calculator'; b.setAttribute('aria-label', 'Open calculator');
    const vol = $('#vol-wrap'); vol ? tools.insertBefore(b, vol) : tools.appendChild(b);
  }
  function syncFab() {
    let fab = $('#calc-fab');
    const page = window.Study?.page, show = MATH_PAGES.includes(page) && !isOpen() && !!document.querySelector(FIELD_SEL);
    if (!fab) { fab = document.createElement('button'); fab.id = 'calc-fab'; fab.dataset.action = 'calc-toggle'; fab.innerHTML = '<span aria-hidden="true">±÷</span> Calculator'; document.body.appendChild(fab); }
    fab.classList.toggle('hidden', !show);
  }

  document.addEventListener('focusin', e => { if (e.target.matches?.(FIELD_SEL)) { lastField = e.target; if (isOpen()) render(); } });
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-action^="calc-"]'); if (!b) { setTimeout(syncFab, 0); return; }
    e.stopPropagation();
    const a = b.dataset.action;
    if (a === 'calc-toggle') isOpen() ? close() : open();
    else if (a === 'calc-close') close();
    else if (a === 'calc-key') press(b.dataset.k);
    else if (a === 'calc-insert') insert();
    else if (a === 'calc-reuse') { if (justEvaluated || !expr) expr = ''; expr += b.dataset.v; justEvaluated = false; render(); }
  }, true);
  document.addEventListener('keydown', e => {
    if (!isOpen()) return;
    const inCalc = e.target.closest?.('#calc');
    if (e.key === 'Escape' && inCalc) { close(); return; }
    if (!inCalc) return; // typing in an answer box stays in the answer box
    const map = { '*': '×', 'x': '×', '/': '÷', '-': '−', Enter: '=', '=': '=', Backspace: 'back', Delete: 'clear', c: 'clear', C: 'clear' };
    const k = /^[0-9.+()%]$/.test(e.key) ? e.key : map[e.key];
    if (k) { e.preventDefault(); press(k); }
  });
  new MutationObserver(() => { syncFab(); if (isOpen()) render(); }).observe(document.getElementById('app') || document.body, { childList: true });

  window.Calc = { open, close, _evaluate: evaluate, init() { topButton(); syncFab(); } };
})();
