/* Read aloud: browser speech synthesis (works offline with the device's voices).
   Adds a Read button to questions, flashcards, explanations, lessons and cram sections,
   optional auto-read for new questions, and voice / speed settings in the sound panel. */
(() => {
  'use strict';
  const synth = window.speechSynthesis;
  if (!synth || typeof window.SpeechSynthesisUtterance !== 'function') { window.TTS = { init() { } }; return; }
  const $ = s => document.querySelector(s);
  const KEY = 'mgt354-voice';
  let prefs = { voice: '', rate: 1, auto: false };
  try { Object.assign(prefs, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(prefs)); } catch (e) { } };
  let speakingEl = null, lastAuto = '';

  /* ---------- text cleanup so numbers and symbols read naturally ---------- */
  function clean(t) {
    return String(t || '')
      .replace(/\s*\((\$|%)\)/g, '').replace(/→/g, ', then ').replace(/[·•|]/g, ', ').replace(/×/g, ' times ').replace(/÷/g, ' divided by ')
      .replace(/−/g, ' minus ').replace(/≈/g, ' about ').replace(/Σ/g, ' the sum of ').replace(/≥/g, ' at least ').replace(/≤/g, ' at most ')
      .replace(/(\d)\s*%/g, '$1 percent').replace(/\bQ([13])\b/g, 'Q $1').replace(/\bIQR\b/g, 'I Q R').replace(/\bFICA\b/g, 'FIE-ka')
      .replace(/\bvs\.?\b/gi, 'versus').replace(/\be\.g\.\b/gi, 'for example').replace(/[“”"]/g, '').replace(/_{2,}/g, ' blank ')
      .replace(/\s+/g, ' ').trim();
  }
  const txt = el => el ? el.innerText || el.textContent || '' : '';
  // Text of a detached clone, with a pause after each block so parts don't run together.
  function flat(c) { c.querySelectorAll('p,h1,h2,h3,h4,li,div,br,summary,strong').forEach(n => n.after(document.createTextNode(n.tagName === 'STRONG' ? ' ' : '. '))); return (c.textContent || '').replace(/([.:!?])\s*\.\s/g, '$1 ').replace(/\s*\.\s*\./g, '.'); }

  /* ---------- what each readable block says ---------- */
  const READERS = [
    ['.question-card', el => {
      const q = txt(el.querySelector('h2'));
      const opts = [...el.querySelectorAll('.option')].map(o => `${txt(o.querySelector('.letter'))}. ${txt(o.querySelector('span:last-child'))}.`);
      const fields = opts.length ? [] : [...el.querySelectorAll('.numeric-grid label')].map(l => (l.childNodes[0]?.textContent || '').trim()).filter(Boolean);
      return [q, opts.length ? 'Choices: ' + opts.join(' ') : '', fields.length ? 'Find: ' + fields.join(', ') + '.' : ''].join(' ');
    }],
    ['.battle-q', el => `${txt(el.querySelector('.q-prompt'))} Choices: ${[...el.querySelectorAll('.answer')].map(a => `${txt(a.querySelector('.letter'))}. ${txt(a.querySelector('span:last-child'))}.`).join(' ')}`],
    ['.flashcard', el => { const c = el.cloneNode(true); c.querySelectorAll('.source,.eyebrow,.tts-btn').forEach(n => n.remove()); return (el.querySelector('.eyebrow')?.textContent.includes('ANSWER') ? 'Answer: ' : '') + flat(c); }],
    ['.feedback', el => { const c = el.cloneNode(true); c.querySelectorAll('.tts-btn,.source,.eyebrow').forEach(n => n.remove()); return flat(c).replace(/ERROR: INCORRECT[^.]*/i, 'Incorrect').replace(/SIGNAL LOST: TIME EXPIRED/i, 'Time expired').replace(/HIT CONFIRMED[^.]*/i, 'Correct').replace(/ANSWER VERIFIED/i, 'Correct'); }],
    ['.wt-lesson', el => { const c = el.cloneNode(true); c.querySelectorAll('.tts-btn,.eyebrow').forEach(n => n.remove()); return flat(c); }],
    ['.cram .panel', el => { const c = el.cloneNode(true); c.querySelectorAll('.tts-btn,.meter').forEach(n => n.remove()); return flat(c); }],
    ['.why-wrong', el => { const c = el.cloneNode(true); c.querySelectorAll('.tts-btn,.source').forEach(n => n.remove()); return flat(c); }]
  ];

  /* ---------- speaking ---------- */
  // Rank voices so the most natural one on this device wins.
  const NOVELTY = /Albert|Bad News|Bahh|Bells|Boing|Bubbles|Cellos|Deranged|Good News|Hysterical|Jester|Organ|Pipe Organ|Superstar|Trinoids|Whisper|Wobble|Zarvox|Fred|Junior|Ralph|Kathy|Princess|Grandma|Grandpa|Rocko|Sandy|Shelley|Eddy|Flo|Reed/i;
  function score(v) {
    let s = 0; const n = v.name;
    if (/Premium/i.test(n)) s += 120; else if (/Enhanced|Neural|Natural/i.test(n)) s += 100;
    if (/Online/i.test(n) && /Microsoft/i.test(n)) s += 60;
    if (/^Google/i.test(n)) s += 45;
    if (/\b(Ava|Zoe|Evan|Nathan|Noelle|Aria|Jenny|Guy|Ana|Michelle|Christopher|Emma|Brian|Andrew|Serena|Allison|Susan)\b/i.test(n)) s += 25;
    if (/\bSamantha\b/i.test(n)) s += 20;
    if (/en[-_]US/i.test(v.lang)) s += 8; else if (/en[-_](GB|AU|CA|IE)/i.test(v.lang)) s += 4;
    if (/Compact|eSpeak|espeak/i.test(n)) s -= 60;
    if (NOVELTY.test(n)) s -= 200;
    return s;
  }
  const isBest = v => score(v) >= 45;
  function voices() { return synth.getVoices().filter(v => /^en/i.test(v.lang) && !NOVELTY.test(v.name)).sort((a, b) => score(b) - score(a) || a.name.localeCompare(b.name)); }
  function pickVoice() {
    const vs = voices(); if (!vs.length) return null;
    return vs.find(v => v.voiceURI === prefs.voice) || vs[0];
  }
  function stop() { synth.cancel(); queue = null; mark(null); bar(false); }
  function mark(el) {
    document.querySelectorAll('.tts-reading').forEach(n => n.classList.remove('tts-reading'));
    document.querySelectorAll('.tts-btn.on').forEach(b => { b.classList.remove('on'); b.innerHTML = '▶ Read'; b.setAttribute('aria-label', 'Read aloud'); });
    speakingEl = el;
    if (el) { el.classList.add('tts-reading'); const b = el._ttsBtn; if (b) { b.classList.add('on'); b.innerHTML = '■ Stop'; b.setAttribute('aria-label', 'Stop reading'); } }
  }
  /* Speak sentence by sentence, so speed changes apply mid-read and long text never cuts off. */
  let queue = null;
  function speak(text, el) {
    const t = clean(text); if (!t) return;
    synth.cancel();
    const parts = t.match(/[^.!?;:]+[.!?;:]*\s*/g) || [t];
    const chunks = []; let cur = '';
    for (const p of parts) { if ((cur + p).length > 160 && cur) { chunks.push(cur.trim()); cur = ''; } cur += p; }
    if (cur.trim()) chunks.push(cur.trim());
    queue = { chunks, i: 0, el, id: Math.random() };
    mark(el); bar(true); sayNext(queue.id);
  }
  function sayNext(id) {
    if (!queue || queue.id !== id) return;
    if (queue.i >= queue.chunks.length) { const el = queue.el; queue = null; if (speakingEl === el) mark(null); bar(false); return; }
    const v = pickVoice(), u = new SpeechSynthesisUtterance(queue.chunks[queue.i]);
    u.lang = (v && v.lang) || 'en-US'; if (v) { try { u.voice = v; } catch (e) { /* fall back to the default voice */ } }
    u.rate = prefs.rate; u.pitch = 1;
    u.onend = () => { if (queue && queue.id === id) { queue.i++; sayNext(id); } };
    u.onerror = e => { if (e.error !== 'interrupted' && e.error !== 'canceled' && queue && queue.id === id) { queue.i++; sayNext(id); } };
    synth.speak(u);
  }
  function setRate(r) {
    prefs.rate = Math.round(Math.min(2, Math.max(0.5, r)) * 20) / 20; save();
    const lab = $('#tts-bar-rate'); if (lab) lab.textContent = prefs.rate.toFixed(2).replace(/0$/, '') + '×';
    const sl = $('#tts-rate'); if (sl) sl.value = prefs.rate;
    const sv = $('#tts-rate-val'); if (sv) sv.textContent = prefs.rate.toFixed(2).replace(/0$/, '') + '×';
    if (queue) { const id = queue.id = Math.random(); synth.cancel(); setTimeout(() => sayNext(id), 60); } // restart the current sentence at the new speed
  }
  /* Floating player bar while reading. */
  function bar(on) {
    let b = $('#tts-bar');
    if (!b) {
      b = document.createElement('div'); b.id = 'tts-bar'; b.setAttribute('role', 'group'); b.setAttribute('aria-label', 'Reading controls');
      b.innerHTML = `<span class="tts-bar-dot" aria-hidden="true"></span><span class="tts-bar-lab">READING</span>
        <button type="button" data-action="tts-slower" aria-label="Slower">−</button><span id="tts-bar-rate" aria-live="polite"></span><button type="button" data-action="tts-faster" aria-label="Faster">+</button>
        <button type="button" data-action="tts-stop" class="tts-bar-stop" aria-label="Stop reading">■ Stop</button>`;
      document.body.appendChild(b);
    }
    $('#tts-bar-rate').textContent = prefs.rate.toFixed(2).replace(/0$/, '') + '×';
    b.classList.toggle('show', !!on);
  }
  function readBlock(el) {
    for (const [sel, fn] of READERS) if (el.matches(sel)) { if (speakingEl === el && queue) { stop(); return; } speak(fn(el), el); return; }
  }

  /* ---------- decorate the page with Read buttons ---------- */
  function decorate() {
    const app = document.getElementById('app'); if (!app) return;
    for (const [sel] of READERS) app.querySelectorAll(sel).forEach(el => {
      if (el._ttsBtn && el._ttsBtn.isConnected) return;
      const b = document.createElement('button'); b.className = 'tts-btn'; b.type = 'button'; b.dataset.action = 'tts-read'; b.innerHTML = '▶ Read'; b.setAttribute('aria-label', 'Read aloud');
      b._host = el; el._ttsBtn = b; el.classList.add('tts-host');
      if (el.tagName === 'BUTTON') { b.classList.add('outside'); el.before(b); } else el.prepend(b);
    });
    if (speakingEl && !speakingEl.isConnected) stop();
    if (prefs.auto) {
      const q = app.querySelector('.question-card h2, .battle-q .q-prompt, .flashcard');
      const host = q?.closest('.question-card, .battle-q, .flashcard');
      const sig = host ? txt(host).slice(0, 160) : '';
      if (host && sig !== lastAuto && !host.querySelector('.feedback')) { lastAuto = sig; setTimeout(() => host.isConnected && readBlock(host), 350); }
    }
  }

  /* ---------- settings inside the sound panel ---------- */
  function settings() {
    const pop = $('#vol-pop'); if (!pop || $('#tts-settings')) return;
    const box = document.createElement('div'); box.id = 'tts-settings';
    box.innerHTML = `<label for="tts-voice">Read aloud</label>
      <select id="tts-voice" aria-label="Voice"></select>
      <label for="tts-rate" class="tts-speed-lab">Speed <span class="vol-val" id="tts-rate-val">${prefs.rate.toFixed(2).replace(/0$/, '')}×</span></label>
      <div class="vol-row"><span aria-hidden="true">0.5×</span><input id="tts-rate" type="range" min="0.5" max="2" step="0.05" value="${prefs.rate}" aria-label="Reading speed"><span aria-hidden="true">2×</span></div>
      <p class="tts-note" id="tts-note"></p>
      <label class="checkbox vol-area"><input type="checkbox" id="tts-auto" ${prefs.auto ? 'checked' : ''}> Auto-read each new question</label>
      <button type="button" id="tts-test" data-action="tts-test">▶ Test voice</button>`;
    pop.appendChild(box);
    const fill = () => {
      const sel = $('#tts-voice'), vs = voices(); if (!sel) return;
      const cur = pickVoice();
      const best = vs.filter(isBest), rest = vs.filter(v => !isBest(v));
      const opt = v => `<option value="${v.voiceURI.replace(/"/g, '&quot;')}" ${cur && v.voiceURI === cur.voiceURI ? 'selected' : ''}>${isBest(v) ? '★ ' : ''}${v.name.replace(/</g, '&lt;')}${v.localService ? '' : ' (online)'}</option>`;
      sel.innerHTML = !vs.length ? '<option>Default voice</option>' : (best.length ? `<optgroup label="Most natural">${best.map(opt).join('')}</optgroup>` : '') + (rest.length ? `<optgroup label="${best.length ? 'Other voices' : 'Voices on this device'}">${rest.map(opt).join('')}</optgroup>` : '');
      const note = $('#tts-note'); if (note) note.innerHTML = best.length ? '' : 'Only basic voices found. For a much more natural voice, download a “Premium” or “Enhanced” English voice in your device’s speech settings, then reopen the game.';
    };
    fill(); synth.addEventListener?.('voiceschanged', fill);
    $('#tts-voice').addEventListener('change', e => { prefs.voice = e.target.value; save(); });
    $('#tts-rate').addEventListener('input', e => setRate(+e.target.value));
    $('#tts-rate').addEventListener('change', () => { if (!queue) speak('This is the reading speed.', null); });
    $('#tts-auto').addEventListener('change', e => { prefs.auto = e.target.checked; save(); lastAuto = ''; if (prefs.auto) decorate(); else stop(); });
  }

  document.addEventListener('click', e => {
    const b = e.target.closest('[data-action^="tts-"]'); if (!b) return;
    e.stopPropagation();
    if (b.dataset.action === 'tts-read') { if (b._host) readBlock(b._host); }
    else if (b.dataset.action === 'tts-test') speak('This is your study terminal. Take a moment to recall the answer, then check your work.', null);
    else if (b.dataset.action === 'tts-stop') stop();
    else if (b.dataset.action === 'tts-slower') setRate(prefs.rate - 0.1);
    else if (b.dataset.action === 'tts-faster') setRate(prefs.rate + 0.1);
  }, true);
  // Answering, flipping or navigating stops the current reading.
  document.addEventListener('click', e => { const a = e.target.closest('[data-action]')?.dataset.action || ''; if (/^(mode|home|answer|ops-answer|d-ans|next|previous|flip|rate-card|ops-next|jump|learn-answer|learn-next|learn-flip|learn-card|learn-grade|learn-pause|learn-start|learn-finish)$/.test(a)) stop(); }, true);
  document.addEventListener('keydown', e => {
    if (e.defaultPrevented || e.repeat || document.querySelector('[aria-modal="true"]') || document.body.classList.contains('nav-open') || e.target.closest('input, textarea, select, [contenteditable]') || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === '[' || e.key === ']') { e.preventDefault(); setRate(prefs.rate + (e.key === ']' ? 0.1 : -0.1)); return; }
    if (e.key === 'r' || e.key === 'R') {
      const host = document.querySelector('#app .question-card, #app .battle-q, #app .flashcard, #app .wt-lesson');
      if (host) { e.preventDefault(); readBlock(host); }
    }
  });
  window.addEventListener('pagehide', () => synth.cancel());
  // Chrome pauses long speech in background tabs; stop cleanly instead.
  document.addEventListener('visibilitychange', () => { if (document.hidden && queue) stop(); });

  window.TTS = {
    speak, stop, setRate, _voices: () => voices().map(v => [v.name, score(v)]),
    init() {
      new MutationObserver(() => { clearTimeout(decorate.t); decorate.t = setTimeout(decorate, 60); }).observe(document.getElementById('app'), { childList: true, subtree: true });
      decorate(); settings();
    }
  };
})();
