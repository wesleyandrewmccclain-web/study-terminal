/* Sidebar ("Study Terminal"): grouped, collapsible navigation with badges, exam countdown,
   mobile drawer, and a Reset-all-data dialog. */
(() => {
  'use strict';
  const S = () => window.Study;
  const $ = s => document.querySelector(s);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const NAV_KEY = 'mgt354-nav';
  const D0 = window.STUDY_DATA || {}, EXAMNO = D0.exam || 2;
  const EXAM = new Date(...(D0.examDate || [2026, 8, 28, 12, 35])); // class time 12:35 pm

  const GROUPS = [
    ['missions','Mission control',['missions','review','campaign']],
    ['focus', 'Focus', ['drill', 'cram', 'mathexam']],
    ['practice', 'Practice', ['quiz', 'exam', 'scenarios']],
    ['math', 'Math', ['math', 'sheet']],
    ['memorize', 'Memorize', ['flash', 'cue']],
    ['game', 'Game', ['assault', 'chips', 'duel', 'board']],
    ['tools', 'Tools', ['search','install']]
  ];

  const initialGroups = {focus:true, game:true, tools:true};
  let collapsed = {...initialGroups};
  try { collapsed = {...initialGroups, ...(JSON.parse(localStorage.getItem(NAV_KEY) || '{}') || {})}; } catch (e) { collapsed = {...initialGroups}; }
  const saveNav = () => { try { localStorage.setItem(NAV_KEY, JSON.stringify(collapsed)); } catch (e) { } };

  function badge(id) {
    const st = S()?.state; if (!st) return '';
    if (id === 'quiz' && st.missed?.length) return `<span class="nav-badge" title="Missed questions to review">${st.missed.length}</span>`;
    if (id === 'flash') { const n = Object.values(st.cards || {}).filter(v => v === 'again').length; if (n) return `<span class="nav-badge" title="Cards marked again">${n}</span>`; }
    if (id === 'assault') { const pre = window.ACTIVE_EXAM === 3 ? 'e3:' : '', n = Object.keys(st.ops?.cleared || {}).filter(k => pre ? k.startsWith(pre) : !k.includes(':')).length; return `<span class="nav-badge soft" title="Targets cleared">${n}/${(S()?.data?.topics?.length || 4) + 1}</span>`; }
    if (id === 'exam' && st.session && !st.session.finished && st.session.mode === 'exam') return `<span class="nav-badge" title="Exam in progress">LIVE</span>`;
    return '';
  }

  function render(page,modes) {
    const byId=Object.fromEntries(modes.map(m=>[m[0],m]));
    const entries=[['home','Home','⌂'],['missions','Study missions','→'],['review','Review queue','↺'],['campaign','Campaign','◇'],['library','All activities','▦']];
    const libraryPages=['quiz','exam','math','flash','cue','scenarios','sheet','assault','chips','duel','board','drill','cram','mathexam','search'];
    $('#navigation').innerHTML=entries.map(([id,name,icon])=>`<button class="nav-button ${page===id||(id==='library'&&libraryPages.includes(page))?'active':''}" data-action="${id==='home'?'home':'mode'}" data-mode="${id}" ${page===id||(id==='library'&&libraryPages.includes(page))?'aria-current="page"':''}><span class="nav-symbol" aria-hidden="true">${icon}</span><span class="nav-name">${name}</span></button>`).join('');
    renderBottom();
  }
  function renderBottom() {
    const box=$('.side-bottom');if(!box)return;
    box.innerHTML=`<button class="nav-utility" data-action="sync-open"><span aria-hidden="true">⇅</span> Sync devices</button><button class="nav-utility" data-action="progress"><span aria-hidden="true">↗</span> Progress & backups</button><button class="nav-utility" data-action="mode" data-mode="install"><span aria-hidden="true">▣</span> Phone & offline</button><span class="sidebar-caption">MGT 354 · Study at your pace</span>`;
  }
  /* ---- keyboard focus and mobile drawer ---- */
  const mobile = window.matchMedia('(max-width: 720px)');
  const focusable = box => [...box.querySelectorAll('button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])')]
    .filter(el => !el.closest('[hidden], [inert]') && el.getClientRects().length);
  let dialogReturnFocus = null;
  function syncAccess() {
    const narrow = mobile.matches, open = narrow && document.body.classList.contains('nav-open');
    const modal = $('#pf-modal, #reset-modal, #ops-boot');
    const sidebar = $('.sidebar');
    if (sidebar) {
      sidebar.inert = !!modal || (narrow && !open);
      if (narrow && !open) sidebar.setAttribute('aria-hidden', 'true'); else sidebar.removeAttribute('aria-hidden');
      if (open && !modal) { sidebar.setAttribute('role', 'dialog'); sidebar.setAttribute('aria-modal', 'true'); sidebar.setAttribute('aria-label', 'Study menu'); }
      else { sidebar.removeAttribute('role'); sidebar.removeAttribute('aria-modal'); sidebar.removeAttribute('aria-label'); }
    }
    $('#menu-toggle')?.setAttribute('aria-expanded', String(open));
    $('#menu-toggle')?.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if ($('#nav-close-button')) $('#nav-close-button').hidden = !narrow;
    document.querySelectorAll('.topbar, #app, footer').forEach(el => { el.inert = !!modal || open; });
    document.body.style.overflow = modal || open ? 'hidden' : '';
  }
  function openDialog() {
    if (!dialogReturnFocus) dialogReturnFocus = document.activeElement;
    syncAccess();
  }
  function closeDialog() {
    syncAccess();
    const target = dialogReturnFocus?.isConnected && !dialogReturnFocus.closest('[inert]') ? dialogReturnFocus : $('#menu-toggle');
    dialogReturnFocus = null;
    target?.focus({ preventScroll: true });
  }
  function ensureMenuButton() {
    if ($('#menu-toggle')) return;
    const sidebar = $('.sidebar');
    if (sidebar) { sidebar.id = 'study-sidebar'; sidebar.tabIndex = -1; }
    const b = document.createElement('button');
    b.id = 'menu-toggle'; b.dataset.action = 'nav-menu'; b.setAttribute('aria-label', 'Open menu'); b.setAttribute('aria-controls', 'study-sidebar'); b.setAttribute('aria-expanded', 'false'); b.innerHTML = '☰ <span>Menu</span>';
    $('.topbar')?.insertBefore(b, $('.topbar').firstChild);
    const close = document.createElement('button'); close.id = 'nav-close-button'; close.className = 'text-button'; close.dataset.action = 'nav-close'; close.textContent = 'Close menu ×'; sidebar?.prepend(close);
    const bd = document.createElement('div'); bd.id = 'nav-backdrop'; bd.dataset.action = 'nav-close'; bd.setAttribute('aria-hidden', 'true'); document.body.appendChild(bd);
    syncAccess();
    mobile.addEventListener('change', () => {
      const sidebarHadFocus = sidebar?.contains(document.activeElement);
      if (!mobile.matches) document.body.classList.remove('nav-open');
      syncAccess();
      if (mobile.matches && sidebarHadFocus && sidebar.inert) $('#menu-toggle')?.focus({ preventScroll: true });
    });
  }
  function closeDrawer(restoreFocus = true) {
    const wasOpen = document.body.classList.contains('nav-open');
    document.body.classList.remove('nav-open'); syncAccess();
    if (wasOpen && restoreFocus) $('#menu-toggle')?.focus({ preventScroll: true });
  }
  function toggleDrawer() {
    if (document.body.classList.contains('nav-open')) { closeDrawer(); return; }
    closeVol(); document.body.classList.add('nav-open'); syncAccess();
    const sidebar = $('.sidebar');
    (sidebar.querySelector('[aria-current="page"]') || focusable(sidebar)[0] || sidebar).focus({ preventScroll: true });
  }

  /* ---- volume sliders (music and effects) ---- */
  function volumeControl() {
    const tools = $('.top-tools'); if (!tools || $('#vol-wrap')) return;
    const A = () => window.StudyAudio;
    const pm = () => Math.round((A()?.state.musicVolume ?? 0.35) * 100), pf = () => Math.round((A()?.state.sfxVolume ?? 0.35) * 100);
    const w = document.createElement('div'); w.id = 'vol-wrap';
    const row = (id, label, v) => `<label for="vol-${id}">${label} <span class="vol-val" id="vol-${id}-val">${v}</span></label>
      <div class="vol-row"><span aria-hidden="true">0</span><input id="vol-${id}" type="range" min="0" max="100" step="5" value="${v}"><span aria-hidden="true">100</span></div>
      <p class="vol-hint" id="vol-${id}-hint"></p>`;
    w.innerHTML = `<button id="vol-btn" data-action="nav-vol" aria-expanded="false" aria-controls="vol-pop" aria-label="Sound and reading settings">Settings</button>
      <div id="vol-pop" hidden>${row('music', 'Music', pm())}<label class="checkbox vol-area"><input type="checkbox" id="vol-area" ${A()?.state.areaMusic === false ? '' : 'checked'}> Different music for each area</label>${row('sfx', 'Sound effects', pf())}</div>`;
    tools.appendChild(w);const toggles=document.createElement('div');toggles.className='sound-toggles';for(const id of ['music-toggle','sfx-toggle']){const el=document.getElementById(id);if(el)toggles.appendChild(el);}w.querySelector('#vol-pop').prepend(toggles);
    const hint = () => {
      const st = A()?.state || {};
      $('#vol-music-hint').textContent = !st.music ? 'Music is off. Tap “Music” to turn it on.' : '';
      $('#vol-sfx-hint').textContent = !st.effects ? 'Effects are off. Tap “SFX” to turn them on.' : '';
    };
    hint();
    $('#vol-music').addEventListener('input', e => { const v = +e.target.value; A()?.setMusicVolume(v / 100); $('#vol-music-val').textContent = v; hint(); });
    let t = 0;
    $('#vol-sfx').addEventListener('input', e => { const v = +e.target.value; A()?.setSfxVolume(v / 100); $('#vol-sfx-val').textContent = v; clearTimeout(t); t = setTimeout(() => A()?.play('select'), 120); hint(); });
    $('#vol-area').addEventListener('change', e => A()?.setAreaMusic(e.target.checked));
    document.addEventListener('click', e => { if (!w.contains(e.target)) closeVol(); });
    window.addEventListener('study-audio-change', hint);
  }
  const closeVol = (restoreFocus = false) => { const p = $('#vol-pop'); if (p && !p.hidden) { p.hidden = true; $('#vol-btn').setAttribute('aria-expanded', 'false'); if (restoreFocus) $('#vol-btn').focus({ preventScroll: true }); } };

  /* ---- reset dialog ---- */
  function openReset() {
    closeDrawer();
    let m = $('#reset-modal'); if (m) m.remove();
    const st = S().state, xp = st.ops?.xp || 0;
    m = document.createElement('div'); m.id = 'reset-modal'; m.setAttribute('role', 'dialog'); m.setAttribute('aria-modal', 'true'); m.setAttribute('aria-labelledby', 'reset-title');
    m.innerHTML = `<div class="reset-box"><div class="eyebrow">SYSTEM / DATA</div><h2 id="reset-title">Reset ${esc(window.Profiles?.current().name || 'this player')}’s saved data?</h2>
      <p>This wipes this player’s saved progress in this browser and starts them fresh. Other players are not affected. It can’t be undone.</p>
      <ul><li>Scores, accuracy by topic, and session history</li><li>${st.missed?.length || 0} missed ${(st.missed?.length || 0) === 1 ? 'question' : 'questions'} and your flashcard ratings</li><li>Any unfinished quiz or exam</li><li>XP (${xp}), rank, chips, and Assault clears</li><li>Worksheet and walkthrough entries</li></ul>
      <label class="checkbox"><input type="checkbox" id="reset-audio"> Also reset sound settings</label>
      <p class="source">Course content (questions, cards, math) is never deleted.</p>
      <div class="reset-actions"><button data-action="nav-reset-cancel">Cancel</button><button class="reset-go" data-action="nav-reset-go">Reset everything</button></div></div>`;
    document.body.appendChild(m);
    openDialog();
    m.querySelector('[data-action="nav-reset-cancel"]').focus();
    S().sound('timer');
  }
  function doReset() {
    const audio = $('#reset-audio')?.checked;
    S().resetAll();
    try { if (audio) localStorage.removeItem('mgt354-audio-prefs'); localStorage.removeItem(NAV_KEY); sessionStorage.removeItem('ops-booted'); } catch (e) { }
    location.reload();
  }
  function closeReset() { $('#reset-modal')?.remove(); closeDialog(); }
  document.addEventListener('keydown', e => {
    const modal = $('#pf-modal, #reset-modal, #ops-boot');
    const box = modal || (mobile.matches && document.body.classList.contains('nav-open') ? $('.sidebar') : null);
    if (box && e.key === 'Tab') {
      const items = focusable(box), first = items[0], last = items[items.length - 1];
      if (!items.length) { e.preventDefault(); box.tabIndex = -1; box.focus(); }
      else if (e.shiftKey && (document.activeElement === first || !box.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && (document.activeElement === last || !box.contains(document.activeElement))) { e.preventDefault(); first.focus(); }
    }
    if (e.key === 'Escape') {
      if (modal?.id === 'reset-modal') closeReset();
      else if (modal?.id === 'pf-modal') window.Profiles?.close();
      else if (modal?.id === 'ops-boot') window.Ops?.skipIntro();
      else { closeDrawer(); closeVol(true); }
      if (box) { e.preventDefault(); e.stopImmediatePropagation(); }
    }
  }, true);

  window.NavUI = {
    render,
    closeDrawer,
    openDialog,
    closeDialog,
    init() {
      ensureMenuButton();
      volumeControl();
      const lab = document.querySelector('.side-label');
      if (lab && !document.getElementById('exam-pick')) {
        lab.innerHTML = `<label class="exam-pick"><span>Your course</span><select id="exam-pick" aria-label="Choose which exam to study for"><option value="2" ${EXAMNO === 2 ? 'selected' : ''}>Exam 2</option><option value="3" ${EXAMNO === 3 ? 'selected' : ''}>Exam 3</option></select></label>`;
        document.getElementById('exam-pick').addEventListener('change', e => { try { localStorage.setItem('mgt354-exam', e.target.value); sessionStorage.removeItem('ops-booted'); } catch (_) { } location.reload(); });
      }
    },
    handle(a, b) {
      if (a === 'reset' || a === 'nav-reset') { openReset(); return true; }
      if (a === 'nav-reset-cancel') { closeReset(); return true; }
      if (a === 'nav-reset-go') { doReset(); return true; }
      if (a === 'nav-vol') { const p = $('#vol-pop'); p.hidden = !p.hidden; b.setAttribute('aria-expanded', String(!p.hidden)); if (!p.hidden) $('#vol-music').focus(); return true; }
      if (a === 'nav-menu') { toggleDrawer(); return true; }
      if (a === 'nav-close') { closeDrawer(); return true; }
      if (a === 'nav-group') {
        const g = b.dataset.group, wrap = b.parentElement, open = !wrap.classList.contains('open');
        wrap.classList.toggle('open', open); b.setAttribute('aria-expanded', open); collapsed[g] = !open; saveNav(); S().sound('select');
        return true;
      }
      if (a === 'mode' || a === 'home' || a === 'progress') closeDrawer(false);
      return false;
    }
  };
})();
