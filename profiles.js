/* Player profiles: each player gets a separate save slot in this browser.
   Loaded before app.js, which asks Profiles.storageKey() for the save key. */
(() => {
  'use strict';
  const BASE = 'mgt354-exam2-v1';
  const META = 'mgt354-profiles';
  const $ = s => document.querySelector(s);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const get = k => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  const set = (k, v) => { try { localStorage.setItem(k, v); return true; } catch (e) { return false; } };
  const del = k => { try { localStorage.removeItem(k); } catch (e) { } };

  let meta = null;
  try { meta = JSON.parse(get(META) || 'null'); } catch (e) { meta = null; }
  const firstRun = !meta || !Array.isArray(meta.list) || !meta.list.length;
  if (firstRun) meta = { list: [{ id: 'p1', name: 'Guest', created: Date.now() }], current: 'p1' };
  if (!meta.list.find(p => p.id === meta.current)) meta.current = meta.list[0].id;
  const saveMeta = () => set(META, JSON.stringify(meta));

  // p1 keeps the original key, so progress saved before profiles existed belongs to the first player.
  const keyFor = id => id === 'p1' ? BASE : BASE + '::' + id;
  const current = () => meta.list.find(p => p.id === meta.current);
  const initials = n => (n || '?').trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?';
  const summary = id => {
    try {
      const s = JSON.parse(get(keyFor(id)) || 'null'); if (!s) return 'No progress yet';
      const tries = Object.values(s.stats || {}).reduce((n, t) => n + (t.total || 0), 0);
      const ok = Object.values(s.stats || {}).reduce((n, t) => n + (t.correct || 0), 0);
      return `${s.ops?.xp || 0} XP · ${tries ? Math.round(ok / tries * 100) + '% accuracy' : 'no answers yet'} · ${(s.missed || []).length} to review`;
    } catch (e) { return 'No progress yet'; }
  };
  const cleanName = n => String(n || '').replace(/\s+/g, ' ').trim().slice(0, 24);

  function switchTo(id) {
    if (id === meta.current) { closePanel(); return; }
    meta.current = id; saveMeta();
    try { sessionStorage.removeItem('ops-booted'); } catch (e) { }
    location.reload();
  }
  function addPlayer(name) {
    name = cleanName(name); if (!name) return 'Type a name first.';
    if (meta.list.some(p => p.name.toLowerCase() === name.toLowerCase())) return 'That name is already taken.';
    const id = 'p' + Date.now().toString(36);
    meta.list.push({ id, name, created: Date.now() }); saveMeta(); switchTo(id); return null;
  }

  /* ---- chip in the top bar ---- */
  function renderChip() {
    const tools = $('.top-tools'); if (!tools) return;
    let b = $('#player-chip');
    if (!b) { b = document.createElement('button'); b.id = 'player-chip'; b.dataset.action = 'pf-open'; tools.prepend(b); }
    const p = current();
    b.innerHTML = `<span class="pf-avatar">${esc(initials(p.name || 'Guest'))}</span><span class="pf-name">${esc(p.name || 'Guest')}</span><span class="pf-caret" aria-hidden="true">▾</span>`;
    b.setAttribute('aria-label', `Player: ${p.name || 'Guest'}. Rename, switch or manage players`);
    b.setAttribute('aria-haspopup', 'dialog');
  }

  /* ---- manage panel ---- */
  let editing = null, confirmDel = null;
  function openPanel() {
    let m = $('#pf-modal'); if (m) m.remove();
    m = document.createElement('div'); m.id = 'pf-modal'; m.setAttribute('role', 'dialog'); m.setAttribute('aria-modal', 'true'); m.setAttribute('aria-labelledby', 'pf-title');
    const rows = meta.list.map(p => {
      const cur = p.id === meta.current;
      if (editing === p.id) return `<li class="pf-row"><span class="pf-avatar">${esc(initials(p.name))}</span><form class="pf-rename" data-id="${p.id}"><input id="pf-rename-${p.id}" value="${esc(p.name)}" maxlength="24" aria-label="New name"><button type="submit" class="primary">Save</button><button type="button" data-action="pf-cancel">Cancel</button></form></li>`;
      if (confirmDel === p.id) return `<li class="pf-row danger-row"><span class="pf-avatar">${esc(initials(p.name))}</span><div class="pf-info"><strong>Delete ${esc(p.name)}?</strong><span>All of their progress on this device is erased.</span></div><div class="pf-btns"><button data-action="pf-cancel">Keep</button><button class="reset-go" data-action="pf-del-go" data-id="${p.id}">Delete</button></div></li>`;
      return `<li class="pf-row ${cur ? 'current' : ''}"><span class="pf-avatar">${esc(initials(p.name || 'Guest'))}</span><div class="pf-info"><strong>${esc(p.name || 'Guest')}${cur ? ' <em>· playing now</em>' : ''}</strong><span>${esc(summary(p.id))}</span></div>
        <div class="pf-btns">${cur ? '' : `<button class="primary" data-action="pf-switch" data-id="${p.id}">Switch</button>`}<button data-action="pf-rename" data-id="${p.id}">Rename</button>${meta.list.length > 1 && !cur ? `<button class="danger" data-action="pf-del" data-id="${p.id}" aria-label="Delete ${esc(p.name)}">Delete</button>` : ''}</div></li>`;
    }).join('');
    m.innerHTML = `<div class="pf-box"><div class="eyebrow">PROGRESS ON THIS DEVICE</div><h2 id="pf-title">Players</h2>
      <p>Your progress saves automatically. Rename Guest at any time, or add a player for a separate save slot.</p>
      <ul class="pf-list">${rows}</ul>
      <form class="pf-add" id="pf-add"><label class="field">Add a player<input id="pf-new" maxlength="24" placeholder="Friend’s name"></label><button type="submit">Add &amp; switch →</button></form>
      <p class="pf-error" id="pf-err" role="alert"></p>
      <p class="source">Players share this device but never each other’s progress. Opening the online link on a different phone or laptop starts that device with its own players.</p>
      <div class="reset-actions"><button data-action="pf-close">Done</button></div></div>`;
    document.body.appendChild(m);
    window.NavUI?.openDialog();
    m.querySelector('#pf-add').addEventListener('submit', e => { e.preventDefault(); const err = addPlayer($('#pf-new').value); if (err) $('#pf-err').textContent = err; });
    m.querySelectorAll('.pf-rename').forEach(f => f.addEventListener('submit', e => {
      e.preventDefault(); const n = cleanName(f.querySelector('input').value), id = f.dataset.id;
      if (!n) { $('#pf-err').textContent = 'Names can’t be blank.'; return; }
      if (meta.list.some(p => p.id !== id && p.name.toLowerCase() === n.toLowerCase())) { $('#pf-err').textContent = 'That name is already taken.'; return; }
      meta.list.find(p => p.id === id).name = n; saveMeta(); editing = null; renderChip(); openPanel();
    }));
    const focusEl = editing ? m.querySelector('.pf-rename input') : confirmDel ? m.querySelector('.danger-row [data-action="pf-cancel"]') : m.querySelector('[data-action="pf-close"]');
    focusEl?.focus();
  }
  function closePanel() { editing = null; confirmDel = null; $('#pf-modal')?.remove(); window.NavUI?.closeDialog(); }

  window.Profiles = {
    storageKey: () => keyFor(meta.current),
    current: () => ({ ...current() }),
    close: closePanel,
    init() { if (!current().name) current().name = 'Guest'; saveMeta(); renderChip(); },
    handle(a, b) {
      if (!a.startsWith('pf-')) return false;
      if (a === 'pf-open') { window.NavUI?.closeDrawer(); openPanel(); }
      else if (a === 'pf-close') closePanel();
      else if (a === 'pf-switch') switchTo(b.dataset.id);
      else if (a === 'pf-rename') { editing = b.dataset.id; confirmDel = null; openPanel(); }
      else if (a === 'pf-del') { confirmDel = b.dataset.id; editing = null; openPanel(); }
      else if (a === 'pf-cancel') { editing = null; confirmDel = null; openPanel(); }
      else if (a === 'pf-del-go') {
        const id = b.dataset.id; if (id === meta.current || meta.list.length < 2) return true;
        del(keyFor(id)); meta.list = meta.list.filter(p => p.id !== id); saveMeta(); confirmDel = null; openPanel();
      }
      return true;
    }
  };
})();
