/* Exam-format study modes: written answers, full mock exam, formula-sheet lookup drill,
   hands-free listen mode, and the per-topic readiness meter on Home. */
(() => {
  'use strict';
  const S = () => window.Study, B = () => window.BOOST_DATA || { written: [], lookup: [], sheet: [] };
  const $ = s => document.querySelector(s);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const exam = () => Number(S().data?.exam || window.ACTIVE_EXAM || 2);
  const ek = () => String(exam());
  const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const topicName = id => S().data.topics.find(t => t.id === id)?.name || id;
  const isTF = q => q.options.length === 2 && q.options[0] === 'True' && q.options[1] === 'False';
  const pct = (a, b) => b ? Math.round(a / b * 100) : 0;
  const fmtT = s => `${Math.floor(s / 60)}:${String(Math.max(0, s % 60)).padStart(2, '0')}`;
  const sub = key => { const st = S().state; st[key] = st[key] || {}; st[key][ek()] = st[key][ek()] || {}; return st[key][ek()]; };
  const onlyExam3 = what => `${S().heading('EXAM 3', what, '')}<section class="panel"><p>${esc(what)} is built from the Exam 3 material. Switch to Exam 3 in the sidebar (“Your course”) to use it.</p></section>`;

  /* ================= Written answers ================= */
  function norm(t) { return String(t || '').toLowerCase().replace(/[’']/g, "'").replace(/\s+/g, ' '); }
  function scoreWritten(item, text) {
    const t = norm(text);
    const hits = item.points.map(p => p.any.some(k => t.includes(norm(k))));
    return { hits, got: hits.filter(Boolean).length, of: item.points.length };
  }
  let wIndex = 0, sampleNS;
  async function sampleReady() { if (sampleNS !== undefined) return sampleNS; try { sampleNS = window.claude?.use ? await window.claude.use('sample') : null; } catch (e) { sampleNS = null; } return sampleNS; }
  function writtenPage(msg) {
    S().setPage('written');
    if (exam() !== 3) { $('#app').innerHTML = onlyExam3('Written answers'); return; }
    const list = B().written, it = list[wIndex] || list[0], saved = sub('written')[it.id];
    $('#app').innerHTML = S().heading('PRACTICE / WRITTEN', 'Written answers', 'Short answer and essay practice. Type your answer the way you would on the exam, then check it against the key points a full-credit answer hits.') +
      `<section class="panel written"><div class="config"><label class="field">Question<select id="w-pick">${list.map((w, i) => `<option value="${i}" ${i === wIndex ? 'selected' : ''}>${w.kind === 'essay' ? 'Essay' : 'Short answer'} · ${esc(topicName(w.topic))} · ${esc(w.prompt.slice(0, 60))}${w.prompt.length > 60 ? '…' : ''}</option>`).join('')}</select></label></div>
      <div class="source">${esc(it.source)} · ${it.kind === 'essay' ? 'Essay' : 'Short answer'}${saved ? ` · your best: ${saved.best}/${it.points.length}` : ''}</div>
      <h2 class="w-prompt">${esc(it.prompt)}</h2>
      <textarea id="w-answer" rows="${it.kind === 'essay' ? 10 : 6}" placeholder="Write your answer here. Lead with the definition, then the list, then an example.">${esc(saved?.draft || '')}</textarea>
      <div class="actions"><button class="primary" data-action="w-check">Check my answer</button><span id="w-claude-slot"></span><button data-action="w-model">Show model answer</button><button data-action="w-next">Next question →</button></div>
      <div id="w-result">${msg || ''}</div></section>`;
    $('#w-answer').addEventListener('input', e => { sub('written')[it.id] = { ...(sub('written')[it.id] || { best: 0 }), draft: e.target.value }; clearTimeout(writtenPage.t); writtenPage.t = setTimeout(() => S().save(), 800); });
    $('#w-pick').addEventListener('change', e => { wIndex = +e.target.value; writtenPage(); });
    sampleReady().then(ns => { const slot = $('#w-claude-slot'); if (ns && slot) slot.innerHTML = '<button data-action="w-claude">Grade with Claude</button>'; });
  }
  function writtenResult(it, text, r, claude) {
    const box = $('#w-result'); if (!box) return;
    const grade = r.got / r.of;
    box.innerHTML = `<div class="w-score ${grade >= 0.8 ? 'good' : grade >= 0.5 ? 'mid' : 'low'}"><strong>${r.got}/${r.of}</strong> key points${claude ? ' (graded by Claude)' : ''} · ${grade >= 0.8 ? 'Full credit territory.' : grade >= 0.5 ? 'Partial credit. Add what’s missing.' : 'Needs the missing points below.'}</div>
      <ul class="w-points">${it.points.map((p, i) => `<li class="${r.hits[i] ? 'hit' : 'miss'}"><span aria-hidden="true">${r.hits[i] ? '✓' : '○'}</span> ${esc(p.label)}${claude?.notes?.[i] ? `<small>${esc(claude.notes[i])}</small>` : ''}</li>`).join('')}</ul>
      ${claude?.feedback ? `<p class="w-feedback">${esc(claude.feedback)}</p>` : ''}
      <p class="source">${claude ? '' : 'Checked by matching key terms, so a correct answer in unusual wording can be missed. Read the model answer to judge.'}</p>
      <details class="w-modelbox" ${grade < 0.8 ? 'open' : ''}><summary>Model answer</summary><p>${esc(it.model)}</p></details>`;
  }
  async function writtenCheck(useClaude) {
    const it = B().written[wIndex], text = $('#w-answer').value.trim();
    if (text.length < 15) { S().toast('Write a sentence or two first.'); return; }
    let r = scoreWritten(it, text), claude = null;
    if (useClaude) {
      const ns = await sampleReady(); if (!ns) return;
      const btn = document.querySelector('[data-action="w-claude"]'); if (btn) { btn.disabled = true; btn.textContent = 'Grading…'; }
      try {
        const out = await ns.json(`You are grading a student's exam answer for MGT 354 Compensation Management. Grade ONLY against the key points and model answer below. Be fair to different wording; don't reward vague answers.\n\nQUESTION: ${it.prompt}\n\nKEY POINTS (in order):\n${it.points.map((p, i) => `${i + 1}. ${p.label}`).join('\n')}\n\nMODEL ANSWER: ${it.model}\n\nSTUDENT ANSWER: """${text.slice(0, 4000)}"""\n\nReturn JSON: {"hits":[true/false for each key point, in order], "notes":["one short note per key point, empty string if fully met"], "feedback":"2-3 sentences: what earns credit, what to add"}`, { modelTier: 'quick' });
        if (Array.isArray(out?.hits) && out.hits.length === it.points.length) { r = { hits: out.hits.map(Boolean), got: out.hits.filter(Boolean).length, of: it.points.length }; claude = { notes: out.notes || [], feedback: out.feedback || '' }; }
        else S().toast('Claude’s grade didn’t come back in the expected shape. Showing the key-term check.');
      } catch (e) { S().toast(e?.code === 'not_granted' ? 'Claude grading needs permission on this page.' : 'Claude grading isn’t available right now. Showing the key-term check.'); }
    }
    const rec = sub('written')[it.id] = { ...(sub('written')[it.id] || {}), best: Math.max(sub('written')[it.id]?.best || 0, r.got), last: r.got, draft: text, at: Date.now() };
    S().record(it.id, it.topic, r.got / r.of >= 0.8); S().save(); S().sound(r.got / r.of >= 0.8 ? 'correct' : 'incorrect');
    writtenResult(it, text, r, claude); void rec;
  }

  /* ================= Mock exam ================= */
  const DEF_FORMAT = { mc: 20, tf: 10, math: 3, written: 1, minutes: 75 };
  let FORMAT = DEF_FORMAT;
  const loadFormat = () => { FORMAT = { ...DEF_FORMAT, ...(S().state.mockFormat?.[ek()] || {}) }; return FORMAT; };
  let mockTimer = 0;
  function mockSetup() {
    S().setPage('mock'); clearInterval(mockTimer); loadFormat();
    const d = S().data, run = S().state.mockRun?.[ek()], past = (S().state.mocks?.[ek()] || []).slice(-5).reverse();
    const tfCount = Math.min(FORMAT.tf, d.questions.filter(isTF).length), mcCount = Math.min(FORMAT.mc + (FORMAT.tf - tfCount), d.questions.filter(q => !isTF(q)).length);
    const wr = exam() === 3 ? FORMAT.written : 0;
    $('#app').innerHTML = S().heading('SIMULATION / MOCK EXAM', `Mock Exam ${exam()}`, 'The real format in one sitting: multiple choice, true/false, word problems' + (wr ? ', and a short written answer' : '') + '. Nothing is graded until you submit, just like the real thing.') +
      `<section class="panel mock-setup"><div class="mock-format"><div><strong>${mcCount}</strong><span>multiple choice</span></div>${tfCount ? `<div><strong>${tfCount}</strong><span>true / false</span></div>` : ''}<div><strong>${FORMAT.math}</strong><span>word problems</span></div>${wr ? `<div><strong>${wr}</strong><span>written answer</span></div>` : ''}<div><strong>${FORMAT.minutes}</strong><span>minutes</span></div></div>
      <p>Scoring: 1 point per multiple choice and true/false, 3 points per word problem (partial credit by part), and 5 points for the written answer. You get a predicted grade and your weakest topics at the end.</p>
      <div class="actions">${run && !run.done ? `<button class="primary" data-action="mock-resume">Resume mock (${fmtT(Math.max(0, Math.round((run.deadline - Date.now()) / 1000)))} left)</button><button data-action="mock-start">Start a new one</button>` : `<button class="primary" data-action="mock-start">Start mock exam →</button>`}</div>
      <details class="mock-cfg" ${S().state.mockFormat?.[ek()] ? 'open' : ''}><summary>Match the real exam format${S().state.mockFormat?.[ek()] ? ' (custom)' : ''}</summary><p class="source">Once the professor tells you the format at Monday’s review, set it here and every mock follows it.</p>
      <div class="mock-cfg-grid">${[['mc', 'Multiple choice'], ['tf', 'True / false'], ['math', 'Word problems'], ['written', 'Written answers'], ['minutes', 'Minutes']].map(([k, l]) => `<label class="field">${l}<input type="number" min="0" max="${k === 'minutes' ? 180 : 60}" id="mf-${k}" value="${FORMAT[k]}"></label>`).join('')}</div>
      <div class="actions"><button data-action="mock-format-save">Save format</button><button class="text-button" data-action="mock-format-reset">Back to default</button></div></details></section>
      ${past.length ? `<div class="section-line"><h2>PAST MOCKS</h2></div><section class="panel">${past.map(m => `<div class="mock-past"><strong>${m.pct}%</strong><span>${letter(m.pct)} · ${new Date(m.at).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</span><span class="source">weakest: ${esc(m.weak || '—')}</span></div>`).join('')}</section>` : ''}`;
  }
  const letter = p => p >= 90 ? 'A' : p >= 80 ? 'B' : p >= 70 ? 'C' : p >= 60 ? 'D' : 'F';
  function buildMock() {
    loadFormat(); const d = S().data, tf = shuffle(d.questions.filter(isTF)).slice(0, FORMAT.tf), mc = shuffle(d.questions.filter(q => !isTF(q))).slice(0, FORMAT.mc + (FORMAT.tf - tf.length));
    const gens = shuffle(window.MathEngine.forExam(exam())).slice(0, Math.min(2, FORMAT.math)).map(t => window.MathEngine.generate(t.id));
    const src = shuffle(d.math).slice(0, FORMAT.math - gens.length);
    const math = shuffle([...gens, ...src]).slice(0, FORMAT.math);
    const written = exam() === 3 ? shuffle(B().written).slice(0, FORMAT.written).map(w => w.id) : [];
    return { v: 1, started: Date.now(), deadline: Date.now() + FORMAT.minutes * 60000, mc: mc.map(q => ({ id: q.id, order: shuffle(q.options.map((_, i) => i)) })), tf: tf.map(q => q.id), math, written, ans: {}, done: false };
  }
  function mockRun() { const st = S().state; st.mockRun = st.mockRun || {}; return st.mockRun[ek()]; }
  function mockRender() {
    const run = mockRun(); if (!run) return mockSetup();
    S().setPage('mock', false); const d = S().data, q = id => d.questions.find(x => x.id === id);
    let n = 0;
    const mcHTML = run.mc.map(({ id, order }) => { const x = q(id); if (!x) return ''; n++; return `<div class="mock-q" id="mq-${esc(id)}"><div class="mock-n">${n}</div><div><p>${esc(x.prompt)}</p><div class="mock-opts">${order.map((oi, k) => `<label class="${run.ans[id] === oi ? 'on' : ''}"><input type="radio" name="m-${esc(id)}" data-mock="${esc(id)}" value="${oi}" ${run.ans[id] === oi ? 'checked' : ''}> <b>${'abcd'[k]})</b> ${esc(x.options[oi])}</label>`).join('')}</div></div></div>`; }).join('');
    const tfHTML = run.tf.map(id => { const x = q(id); if (!x) return ''; n++; return `<div class="mock-q"><div class="mock-n">${n}</div><div><p>${esc(x.prompt.replace(/^True or false:\s*/i, ''))}</p><div class="mock-opts tf">${[0, 1].map(oi => `<label class="${run.ans[id] === oi ? 'on' : ''}"><input type="radio" name="m-${esc(id)}" data-mock="${esc(id)}" value="${oi}" ${run.ans[id] === oi ? 'checked' : ''}> ${oi ? 'False' : 'True'}</label>`).join('')}</div></div></div>`; }).join('');
    const mathHTML = run.math.map((p, i) => `<div class="mock-q"><div class="mock-n">W${i + 1}</div><div><p><strong>${esc(p.title)}.</strong> ${esc(p.prompt)}</p>${p.table ? S().tableHTML?.(p.table) || '' : ''}<div class="mock-fields">${p.fields.map(f => `<label class="field">${esc(f.label)}${f.unit ? ` (${esc(f.unit)})` : ''}<input type="text" inputmode="decimal" data-mockf="${i}:${esc(f.id)}" data-math-field value="${esc(run.ans['m' + i + ':' + f.id] ?? '')}"></label>`).join('')}</div></div></div>`).join('');
    const wrHTML = run.written.map((id, i) => { const w = B().written.find(x => x.id === id); return w ? `<div class="mock-q"><div class="mock-n">E${i + 1}</div><div><p>${esc(w.prompt)}</p><textarea rows="8" data-mockw="${esc(id)}" placeholder="Definition → list → example.">${esc(run.ans['w:' + id] || '')}</textarea></div></div>` : ''; }).join('');
    const answered = Object.keys(run.ans).filter(k => run.ans[k] !== '' && run.ans[k] != null).length;
    $('#app').innerHTML = S().heading(`MOCK EXAM ${exam()} / IN PROGRESS`, 'Mock exam', 'Answer in any order. Your answers save as you go.', `<div class="timer" id="mock-clock">${fmtT(Math.round((run.deadline - Date.now()) / 1000))}</div>`) +
      `<section class="panel mock-paper"><h2>Section A · Multiple choice</h2>${mcHTML}${tfHTML ? `<h2>Section B · True / False</h2>${tfHTML}` : ''}<h2>Section ${tfHTML ? 'C' : 'B'} · Word problems</h2><p class="source">Show-your-work credit is by part. Use the calculator if you need it.</p>${mathHTML}${wrHTML ? `<h2>Section ${tfHTML ? 'D' : 'C'} · Written answer</h2>${wrHTML}` : ''}
      <div class="actions mock-submit"><span class="source" id="mock-count">${answered} answered</span><button class="primary" data-action="mock-submit">Submit exam</button></div></section>`;
    clearInterval(mockTimer);
    mockTimer = setInterval(() => { const c = $('#mock-clock'), r = mockRun(); if (!c || !r || r.done || S().page !== 'mock') { clearInterval(mockTimer); return; } const left = Math.round((r.deadline - Date.now()) / 1000); c.textContent = fmtT(Math.max(0, left)); c.classList.toggle('low', left < 300); if (left <= 0) { clearInterval(mockTimer); S().toast('Time’s up. Submitting your exam.'); mockGrade(); } }, 1000);
  }
  document.addEventListener('input', e => {
    const t = e.target, run = S()?.state?.mockRun?.[ek()]; if (!run || run.done) return;
    if (t.dataset.mock) { run.ans[t.dataset.mock] = +t.value; t.closest('.mock-opts')?.querySelectorAll('label').forEach(l => l.classList.toggle('on', l.contains(t) )); }
    else if (t.dataset.mockf) { const [i, f] = t.dataset.mockf.split(':'); run.ans['m' + i + ':' + f] = t.value; }
    else if (t.dataset.mockw) run.ans['w:' + t.dataset.mockw] = t.value;
    else return;
    const c = $('#mock-count'); if (c) c.textContent = Object.keys(run.ans).filter(k => run.ans[k] !== '' && run.ans[k] != null).length + ' answered';
    clearTimeout(mockRender.t); mockRender.t = setTimeout(() => S().save(), 600);
  });
  document.addEventListener('change', e => { if (e.target.dataset?.mock) e.target.dispatchEvent(new Event('input', { bubbles: true })); });
  function mockGrade() {
    const run = mockRun(); if (!run || run.done) return; clearInterval(mockTimer);
    const d = S().data, q = id => d.questions.find(x => x.id === id), byTopic = {}, add = (t, got, of) => { const x = byTopic[t] = byTopic[t] || { got: 0, of: 0 }; x.got += got; x.of += of; };
    let got = 0, of = 0; const review = [];
    for (const { id } of run.mc) { const x = q(id); if (!x) continue; const ok = run.ans[id] === x.answer; got += ok; of++; add(x.topic, +ok, 1); S().record(id, x.topic, ok); if (!ok) review.push({ kind: 'MC', prompt: x.prompt, yours: run.ans[id] != null ? x.options[run.ans[id]] : '(blank)', right: x.options[x.answer], why: x.explanation, topic: x.topic }); }
    for (const id of run.tf) { const x = q(id); if (!x) continue; const ok = run.ans[id] === x.answer; got += ok; of++; add(x.topic, +ok, 1); S().record(id, x.topic, ok); if (!ok) review.push({ kind: 'T/F', prompt: x.prompt, yours: run.ans[id] != null ? x.options[run.ans[id]] : '(blank)', right: x.options[x.answer], why: x.explanation, topic: x.topic }); }
    run.math.forEach((p, i) => {
      const parts = p.fields.map(f => window.MathEngine.checkField(f, run.ans['m' + i + ':' + f.id]));
      const pts = Math.round(parts.filter(Boolean).length / parts.length * 3 * 10) / 10; got += pts; of += 3; add(p.topic, pts, 3);
      if (pts < 3) review.push({ kind: 'Word problem', prompt: p.title + ': ' + p.prompt, yours: p.fields.map(f => `${f.label}: ${run.ans['m' + i + ':' + f.id] || '(blank)'}`).join(' · '), right: p.fields.map(f => `${f.label}: ${f.answer}`).join(' · '), why: (p.steps || []).join(' '), topic: p.topic });
    });
    run.written.forEach(id => {
      const w = B().written.find(x => x.id === id); if (!w) return; const r = scoreWritten(w, run.ans['w:' + id]); const pts = Math.round(r.got / r.of * 5 * 10) / 10; got += pts; of += 5; add(w.topic, pts, 5);
      if (pts < 5) review.push({ kind: 'Written', prompt: w.prompt, yours: `${r.got}/${r.of} key points: missing ${w.points.filter((_, k) => !r.hits[k]).map(p => p.label).join('; ')}`, right: w.model, why: '', topic: w.topic });
    });
    const p = pct(got, of), weak = Object.entries(byTopic).map(([t, x]) => [t, pct(x.got, x.of)]).sort((a, b) => a[1] - b[1]);
    run.done = true; run.result = { got: Math.round(got * 10) / 10, of, pct: p, byTopic, review, secs: Math.round((Math.min(Date.now(), run.deadline) - run.started) / 1000) };
    const st = S().state; st.mocks = st.mocks || {}; st.mocks[ek()] = [...(st.mocks[ek()] || []), { at: Date.now(), pct: p, weak: weak.slice(0, 2).map(([t]) => topicName(t)).join(', ') }].slice(-12);
    st.history = [{ mode: 'mock', score: Math.round(got), total: of, date: new Date().toISOString() }, ...(st.history || [])].slice(0, 40);
    S().save(); S().sound(p >= 80 ? 'complete' : 'timer'); mockResults();
  }
  function mockResults() {
    const run = mockRun(); if (!run?.result) return mockSetup();
    S().setPage('mock'); const r = run.result, weak = Object.entries(r.byTopic).map(([t, x]) => [t, pct(x.got, x.of), x]).sort((a, b) => a[1] - b[1]);
    $('#app').innerHTML = S().heading(`MOCK EXAM ${exam()} / RESULTS`, `Predicted grade: ${letter(r.pct)} (${r.pct}%)`, `${r.got} of ${r.of} points in ${fmtT(r.secs)}. The prediction assumes the real exam mixes question types the same way.`) +
      `<section class="panel"><h2>By topic</h2><div class="ready-list">${weak.map(([t, p, x]) => `<div class="ready-row"><span>${esc(topicName(t))}</span><span class="ready-track"><i style="width:${p}%" class="${p >= 80 ? 'good' : p >= 60 ? 'mid' : 'low'}"></i></span><strong>${p}%</strong><small>${x.got}/${x.of}</small></div>`).join('')}</div>
      <div class="actions">${weak[0] ? `<button class="primary" data-action="mock-drill" data-topic="${esc(weak[0][0])}">Practice ${esc(topicName(weak[0][0]))} →</button>` : ''}<button data-action="mock-start">Take another mock</button><button data-action="mode" data-mode="written">Written answers</button></div></section>
      ${r.review.length ? `<div class="section-line"><h2>WHAT TO FIX (${r.review.length})</h2></div><section class="panel mock-review">${r.review.map(x => `<div class="mock-rv"><span class="eyebrow">${esc(x.kind)} · ${esc(topicName(x.topic))}</span><p>${esc(x.prompt)}</p><p class="bad">Yours: ${esc(x.yours)}</p><p class="good">Correct: ${esc(x.right)}</p>${x.why ? `<p class="source">${esc(x.why)}</p>` : ''}</div>`).join('')}</section>` : '<section class="panel"><p>Perfect paper. Nothing to fix.</p></section>'}`;
  }

  /* ================= Formula-sheet lookup drill ================= */
  let lk = null, lkTimer = 0;
  function lookupPage() {
    S().setPage('lookup'); clearInterval(lkTimer);
    if (exam() !== 3) { $('#app').innerHTML = onlyExam3('Formula lookup'); return; }
    const best = sub('lookup');
    $('#app').innerHTML = S().heading('FOCUS / FORMULA LOOKUP', 'Formula lookup drill', 'You only get a short look at your notes, so know where everything is before you sit down. Each round flashes 10 exam-style problems. Pick the formula and the section of your Exam 3 formula sheet as fast as you can.') +
      `<section class="panel"><div class="sheet-map">${B().sheet.map(s => `<div><b>${s.n}</b><span>${esc(s.name)}</span></div>`).join('')}</div>
      <p class="source">Sections match “MGT 354 – Formula Sheet (Exam 3)” in your MGT 354 folder. Keep it next to you while you play.</p>
      ${best.rounds ? `<p>Best round: <strong>${best.bestScore}/10</strong>, average <strong>${(best.bestAvg / 1000).toFixed(1)}s</strong> per problem · ${best.rounds} rounds played.</p>` : ''}
      <button class="primary" data-action="lk-start">Start a round →</button></section>`;
  }
  function lookupStart() {
    const items = shuffle(B().lookup).slice(0, 10), formulas = [...new Set(B().lookup.map(x => x.f))];
    lk = { items: items.map(it => ({ ...it, choices: shuffle([it.f, ...shuffle(formulas.filter(f => f !== it.f)).slice(0, 3)]) })), i: 0, results: [], t0: 0, pickF: null, pickS: null };
    lookupQ();
  }
  function lookupQ() {
    S().setPage('lookup', false); const it = lk.items[lk.i]; lk.t0 = performance.now(); lk.pickF = null; lk.pickS = null;
    $('#app').innerHTML = S().heading('FORMULA LOOKUP / ' + (lk.i + 1) + ' OF 10', 'Where is it on your sheet?', '', `<div class="timer" id="lk-clock">0.0s</div>`) +
      `<div class="progressbar"><span style="width:${lk.i * 10}%"></span></div><section class="question-card"><h2>${esc(it.q)}</h2>
      <p class="eyebrow">WHICH FORMULA OR RULE?</p><div class="options">${it.choices.map((c, k) => `<button class="option" data-action="lk-f" data-k="${k}"><span class="letter">${'ABCD'[k]}</span><span>${esc(c)}</span></button>`).join('')}</div>
      <p class="eyebrow" style="margin-top:18px">WHICH SECTION OF YOUR SHEET?</p><div class="sheet-pick">${B().sheet.map(s => `<button data-action="lk-s" data-n="${s.n}" title="${esc(s.name)}"><b>${s.n}</b><small>${esc(s.name)}</small></button>`).join('')}</div></section>`;
    clearInterval(lkTimer); lkTimer = setInterval(() => { const c = $('#lk-clock'); if (!c || !lk) return clearInterval(lkTimer); c.textContent = ((performance.now() - lk.t0) / 1000).toFixed(1) + 's'; }, 100);
  }
  function lookupPick(kind, val, btn) {
    if (!lk) return;
    if (kind === 'f') { lk.pickF = +val; document.querySelectorAll('[data-action="lk-f"]').forEach(b => b.classList.toggle('selected', b === btn)); }
    else { lk.pickS = +val; document.querySelectorAll('[data-action="lk-s"]').forEach(b => b.classList.toggle('on', b === btn)); }
    if (lk.pickF == null || lk.pickS == null) return;
    clearInterval(lkTimer);
    const it = lk.items[lk.i], ms = performance.now() - lk.t0, okF = it.choices[lk.pickF] === it.f, okS = lk.pickS === it.s;
    lk.results.push({ ms, okF, okS }); S().sound(okF && okS ? 'correct' : 'incorrect');
    document.querySelectorAll('[data-action="lk-f"]').forEach((b, k) => { b.disabled = true; if (it.choices[k] === it.f) b.classList.add('correct'); else if (k === lk.pickF) b.classList.add('incorrect'); });
    document.querySelectorAll('[data-action="lk-s"]').forEach(b => { b.disabled = true; if (+b.dataset.n === it.s) b.classList.add('correct'); else if (+b.dataset.n === lk.pickS) b.classList.add('incorrect'); });
    const card = document.querySelector('.question-card');
    card.insertAdjacentHTML('beforeend', `<div class="feedback ${okF && okS ? 'good' : 'bad'}"><h3>${okF && okS ? 'Found it' : 'Not quite'} · ${(ms / 1000).toFixed(1)}s</h3><p>${esc(it.f)} → section ${it.s}, ${esc(B().sheet.find(s => s.n === it.s)?.name || '')}.</p><button class="primary" data-action="lk-next">${lk.i < 9 ? 'Next →' : 'See results'}</button></div>`);
    document.querySelector('[data-action="lk-next"]').focus();
  }
  function lookupDone() {
    const r = lk.results, score = r.filter(x => x.okF && x.okS).length, avg = r.reduce((n, x) => n + x.ms, 0) / r.length, best = sub('lookup');
    best.rounds = (best.rounds || 0) + 1; best.lastAt = Date.now(); if (score > (best.bestScore || 0) || (score === best.bestScore && avg < (best.bestAvg || 1e9))) { best.bestScore = score; best.bestAvg = avg; }
    S().save(); S().setPage('lookup');
    const missed = lk.items.filter((_, i) => !(r[i].okF && r[i].okS));
    $('#app').innerHTML = S().heading('FORMULA LOOKUP / RESULTS', `${score}/10 found · ${(avg / 1000).toFixed(1)}s average`, avg < 6000 && score >= 8 ? 'Fast enough to use your short look well.' : 'Aim for 8/10 at under 6 seconds each.') +
      `<section class="panel">${missed.length ? `<h2>Go over these on your sheet</h2>${missed.map(it => `<p><strong>${esc(it.q)}</strong><br><span class="source">${esc(it.f)} · section ${it.s}</span></p>`).join('')}` : '<p>Every one right.</p>'}<div class="actions"><button class="primary" data-action="lk-start">Another round →</button></div></section>`;
    lk = null;
  }

  /* ================= Listen mode ================= */
  const synth = window.speechSynthesis;
  let ls = null;
  const voicePrefs = () => { try { return JSON.parse(localStorage.getItem('mgt354-voice') || '{}') || {}; } catch (e) { return {}; } };
  function speak(text, onend) {
    if (!synth) return onend?.();
    const u = new SpeechSynthesisUtterance(String(text).replace(/\(\$\)/g, '').replace(/→/g, ', then ').replace(/÷/g, ' divided by ').replace(/×/g, ' times ').replace(/−/g, ' minus ').replace(/≠/g, ' is not '));
    const p = voicePrefs(), v = synth.getVoices().find(x => x.name === p.voice); if (v) { try { u.voice = v; } catch (e) { } }
    u.lang = v?.lang || 'en-US'; u.rate = Math.min(2, Math.max(0.6, +(ls?.rate || p.rate || 1)));
    u.onend = () => onend?.(); u.onerror = () => onend?.();
    synth.speak(u);
  }
  function listenPage() {
    S().setPage('listen'); const d = S().data;
    $('#app').innerHTML = S().heading('MEMORIZE / LISTEN', 'Listen mode', 'Hands-free flashcards for the drive or the walk to class. It reads the front, pauses so you can answer out loud, then reads the answer.') +
      `<section class="panel"><div class="config"><label class="field">Topic<select id="ls-topic"><option value="all">All topics</option>${d.topics.map(t => `<option value="${esc(t.id)}">${esc(t.name)}</option>`).join('')}</select></label>
      <label class="field">Cards<select id="ls-deck"><option value="core">Core cards</option><option value="all">Every card</option><option value="again">Only cards marked “again”</option></select></label>
      <label class="field">Think time<select id="ls-pause"><option value="3">3 seconds</option><option value="5" selected>5 seconds</option><option value="8">8 seconds</option></select></label>
      <label class="field">Speed<select id="ls-rate"><option value="0.9">Slower</option><option value="1" selected>Normal</option><option value="1.15">Faster</option><option value="1.3">Fastest</option></select></label></div>
      ${synth ? '<button class="primary" data-action="ls-start">Start listening →</button>' : '<p>This browser can’t read aloud.</p>'}<p class="source">Keep the screen on. Phones pause speech when the screen locks. Voice choice is under Settings → voice.</p></section>`;
  }
  function listenStart() {
    const d = S().data, topic = $('#ls-topic').value, deck = $('#ls-deck').value, cards = S().state.cards || {};
    let list = d.flashcards.filter(c => (topic === 'all' || c.topic === topic) && (deck === 'all' || (deck === 'core' ? c.core !== false : cards[c.id] === 'again')));
    if (!list.length) { S().toast('No cards match. Try “Every card”.'); return; }
    ls = { list: shuffle(list), i: 0, pause: +$('#ls-pause').value * 1000, rate: +$('#ls-rate').value, playing: true, phase: 'front', t: 0, heard: 0 };
    try { navigator.wakeLock?.request('screen').then(l => { ls && (ls.lock = l); }).catch(() => { }); } catch (e) { }
    listenRender(); listenStep();
  }
  function listenRender() {
    if (!ls) return; S().setPage('listen', false); const c = ls.list[ls.i];
    $('#app').innerHTML = S().heading('LISTEN / ' + (ls.i + 1) + ' OF ' + ls.list.length, 'Listen mode', '') +
      `<section class="panel listen-card"><div class="source">${esc(topicName(c.topic))}</div><h2>${esc(c.front)}</h2><p class="listen-back ${ls.phase === 'back' || ls.phase === 'gap' ? '' : 'hidden-answer'}">${esc(c.back)}</p>
      <div class="listen-phase">${ls.playing ? (ls.phase === 'front' ? 'Reading the question…' : ls.phase === 'think' ? 'Your turn. Say the answer.' : 'Answer') : 'Paused'}</div>
      <div class="actions listen-controls"><button data-action="ls-prev" aria-label="Previous card">◀ Back</button><button class="primary" data-action="ls-toggle">${ls.playing ? 'Pause' : 'Play'}</button><button data-action="ls-next" aria-label="Next card">Next ▶</button><button data-action="ls-again">${(S().state.cards || {})[c.id] === 'again' ? 'Marked again ✓' : 'Mark “again”'}</button><button class="text-button" data-action="ls-stop">Stop</button></div></section>`;
  }
  function listenStep() {
    if (!ls || !ls.playing) return; const c = ls.list[ls.i], id = ls.id = Math.random();
    ls.phase = 'front'; listenRender();
    speak(c.front, () => {
      if (!ls || ls.id !== id || !ls.playing) return; ls.phase = 'think'; listenRender();
      ls.t = setTimeout(() => {
        if (!ls || ls.id !== id || !ls.playing) return; ls.phase = 'back'; listenRender();
        speak('Answer. ' + c.back, () => { if (!ls || ls.id !== id || !ls.playing) return; ls.phase = 'gap'; ls.heard++; { const L = sub('listen'), k = new Date().toDateString(); L[k] = (L[k] || 0) + 1; L.lastAt = Date.now(); } ls.t = setTimeout(() => { if (!ls || ls.id !== id) return; listenMove(1); }, 1500); });
      }, ls.pause);
    });
  }
  function listenMove(dir) { if (!ls) return; clearTimeout(ls.t); synth?.cancel(); ls.i = (ls.i + dir + ls.list.length) % ls.list.length; if (ls.i === 0 && dir > 0) ls.list = shuffle(ls.list); listenStep(); if (!ls.playing) listenRender(); }
  function listenStop() { if (!ls) return; clearTimeout(ls.t); synth?.cancel(); try { ls.lock?.release(); } catch (e) { } ls = null; }

  /* ================= Readiness meter ================= */
  function readiness() {
    const d = S().data, items = S().state.learning?.exams?.[ek()]?.items || {}, LM = window.LearningModel, now = Date.now();
    return d.topics.map(t => {
      const pool = [...d.questions.filter(q => q.topic === t.id), ...d.flashcards.filter(c => c.topic === t.id && c.core !== false), ...d.math.filter(m => m.topic === t.id)];
      let score = 0;
      for (const it of pool) {
        const r = items[it.id]; if (!r) continue; const st = LM ? LM.status(r, now) : 'learning';
        score += st === 'secure' ? 1 : r.lastCorrect ? (r.confidence === 'unsure' || r.assisted ? 0.45 : 0.65) : 0.15;
      }
      const s = S().state.stats[t.id], acc = s?.total ? s.correct / s.total : null;
      const cover = pool.length ? score / pool.length : 0;
      const value = Math.round(100 * (acc == null ? cover : 0.75 * cover + 0.25 * acc * Math.min(1, s.total / 20)));
      return { id: t.id, name: t.name, value: Math.min(100, value), n: pool.length };
    });
  }
  function readinessHTML() {
    const r = readiness(); if (!r.length) return '';
    const D = S().data, dt = D.examDate ? new Date(...D.examDate) : null, days = dt ? Math.ceil((dt - Date.now()) / 864e5) : null;
    const overall = Math.round(r.reduce((n, x) => n + x.value * x.n, 0) / Math.max(1, r.reduce((n, x) => n + x.n, 0)));
    const lastMock = (S().state.mocks?.[ek()] || []).slice(-1)[0];
    const lab = v => v >= 75 ? 'Ready' : v >= 45 ? 'Getting there' : v > 0 ? 'Needs work' : 'Not started';
    return `<section class="ready-section"><div class="section-heading"><h2>Exam ${D.exam || 2} readiness</h2><span class="section-note">${days != null ? (days > 0 ? `${days} day${days === 1 ? '' : 's'} to go · ${esc(D.examDay || '')}` : days === 0 ? 'Exam day' : 'Exam is behind you') : ''}</span></div>
      <div class="ready-card"><div class="ready-overall"><strong>${overall}%</strong><span>overall</span>${lastMock ? `<small>Last mock: ${lastMock.pct}% (${letter(lastMock.pct)})</small>` : `<button class="quiet-link" data-action="mode" data-mode="mock">Take a mock exam ↗</button>`}</div>
      <div class="ready-list">${r.map(x => `<button class="ready-row" data-action="dash-topic" data-topic="${esc(x.id)}"><span>${esc(x.name)}</span><span class="ready-track"><i style="width:${x.value}%" class="${x.value >= 75 ? 'good' : x.value >= 45 ? 'mid' : 'low'}"></i></span><strong>${x.value}%</strong><small>${lab(x.value)}</small></button>`).join('')}</div></div>
      <p class="source">Readiness grows as you answer items confidently on separate days. Guesses and misses count for less.</p></section>`;
  }

  /* ================= wiring ================= */
  const MODES = [['mock', 'Mock exam', 'The real exam format with a predicted grade.', 'exam-sim'], ['written', 'Written answers', 'Short answer and essay practice with key-point checks.', 'scenarios'], ['lookup', 'Formula lookup', 'Find the right formula and sheet section fast.', 'mathexam'], ['listen', 'Listen mode', 'Hands-free flashcards read aloud.', 'flashcards']];
  window.Boost = {
    modes: MODES,
    library: [['mock', 'Mock exam', 'Multiple choice, true/false, word problems, and a written answer. Predicted grade at the end.', 'exam-sim', 'study', 'REAL FORMAT'], ['written', 'Written answers', 'Practice short answers and essays, then check them against the key points.', 'scenarios', 'study', 'SHORT ANSWER & ESSAY'], ['lookup', 'Formula lookup', 'Train your short look at notes: which formula, which section of your sheet.', 'mathexam', 'tools', 'SPEED DRILL'], ['listen', 'Listen mode', 'Flashcards read aloud, hands-free.', 'flashcards', 'tools', 'AUDIO']],
    readinessHTML, readiness, _scoreWritten: scoreWritten,
    mode(p) {
      if (p !== 'listen') listenStop();
      if (p === 'written') { writtenPage(); return true; }
      if (p === 'mock') { const run = mockRun(); run?.done && run.result && S().page !== 'mock' ? mockResults() : mockSetup(); return true; }
      if (p === 'lookup') { lookupPage(); return true; }
      if (p === 'listen') { listenStop(); listenPage(); return true; }
      return false;
    },
    handle(a, b) {
      if (!/^(w|mock|lk|ls)-/.test(a)) { if (a === 'mode' || a === 'home') { listenStop(); clearInterval(mockTimer); clearInterval(lkTimer); } return false; }
      if (a === 'w-check') writtenCheck(false);
      else if (a === 'w-claude') writtenCheck(true);
      else if (a === 'w-model') { const it = B().written[wIndex]; $('#w-result').innerHTML = `<details class="w-modelbox" open><summary>Model answer</summary><p>${esc(it.model)}</p></details>`; }
      else if (a === 'w-next') { wIndex = (wIndex + 1) % B().written.length; writtenPage(); }
      else if (a === 'mock-start') { const st = S().state; st.mockRun = st.mockRun || {}; st.mockRun[ek()] = buildMock(); S().save(); S().sound('start'); mockRender(); }
      else if (a === 'mock-resume') mockRender();
      else if (a === 'mock-format-save') { const st = S().state, f = {}; for (const k of ['mc', 'tf', 'math', 'written', 'minutes']) { const v = Math.max(0, Math.min(k === 'minutes' ? 180 : 60, Math.round(+document.getElementById('mf-' + k).value || 0))); f[k] = v; } if (f.minutes < 5) f.minutes = 5; st.mockFormat = st.mockFormat || {}; st.mockFormat[ek()] = f; S().save(); S().toast('Mock format saved.'); mockSetup(); }
      else if (a === 'mock-format-reset') { const st = S().state; if (st.mockFormat) delete st.mockFormat[ek()]; S().save(); mockSetup(); }
      else if (a === 'mock-submit') { const run = mockRun(), blank = (run.mc.length + run.tf.length + run.math.reduce((n, p) => n + p.fields.length, 0) + run.written.length) - Object.keys(run.ans).filter(k => run.ans[k] !== '' && run.ans[k] != null).length; if (blank > 0 && b.dataset.sure !== '1') { b.dataset.sure = '1'; b.textContent = `Submit with ${blank} blank?`; return true; } mockGrade(); }
      else if (a === 'mock-drill') { S().mode('drill'); }
      else if (a === 'lk-start') lookupStart();
      else if (a === 'lk-f') lookupPick('f', b.dataset.k, b);
      else if (a === 'lk-s') lookupPick('s', b.dataset.n, b);
      else if (a === 'lk-next') { if (++lk.i < 10) lookupQ(); else lookupDone(); }
      else if (a === 'ls-start') listenStart();
      else if (a === 'ls-toggle') { ls.playing = !ls.playing; if (ls.playing) listenStep(); else { clearTimeout(ls.t); synth?.cancel(); listenRender(); } }
      else if (a === 'ls-next') listenMove(1);
      else if (a === 'ls-prev') listenMove(-1);
      else if (a === 'ls-again') { const c = ls.list[ls.i], st = S().state; st.cards = st.cards || {}; st.cards[c.id] = 'again'; S().save(); listenRender(); }
      else if (a === 'ls-stop') { listenStop(); listenPage(); }
      return true;
    }
  };
})();
