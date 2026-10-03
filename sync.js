/* Sync devices: keeps one player's progress the same on a laptop and a phone.
   Three routes, all built on SyncMerge (sync-merge.js):
     1. Transfer code / file / QR   — no account, works offline, manual.
     2. Cloud sync (Supabase)       — automatic, a sync key per player.
     3. Claude account              — automatic on the private Claude link (owner only).
   Nothing here runs until the player opens Sync or turns a route on. */
(() => {
  'use strict';
  const S = () => window.Study, M = () => window.SyncMerge;
  const $ = s => document.querySelector(s);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const LS = {
    get(k) { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } },
    del(k) { try { localStorage.removeItem(k); } catch (e) { } }
  };
  const pk = () => S()?.storageKey || 'mgt354-exam2-v1';
  const cfgKey = () => 'mgt354-sync::' + pk();
  const baseKey = route => 'mgt354-sync-base::' + pk() + '::' + route;
  // Last state known to be shared with another device. If this route has none yet, borrow one from another route,
  // so a device that already traded progress by code doesn't count it twice when it starts cloud sync.
  const baseFor = route => LS.get(baseKey(route)) || ['xfer', 'cloud', 'claude'].map(r => r !== route && LS.get(baseKey(r))).find(Boolean) || null;
  const PROJECT_KEY = 'mgt354-sync-project';
  const cfg = () => LS.get(cfgKey()) || {};
  const setCfg = patch => LS.set(cfgKey(), { ...cfg(), ...patch });
  const project = () => { const c = window.SYNC_CONFIG || {}; const saved = LS.get(PROJECT_KEY) || {}; return { url: (saved.url || c.url || '').replace(/\/+$/, ''), anon: saved.anon || c.anon || '', playUrl: c.playUrl || '' }; };
  // Inside a Claude link the page can't reach other servers, the camera, or file downloads.
  const inClaude = () => !!(window.claude && typeof window.claude.use === 'function');
  const hasProject = () => { const p = project(); return !!(p.url && p.anon) && !inClaude(); };
  const hash = str => { let h = 5381; for (let i = 0; i < str.length; i++) h = (h * 33 ^ str.charCodeAt(i)) >>> 0; return h.toString(36) + ':' + str.length; };
  const stateHash = s => hash(JSON.stringify(M().outgoing(s)));
  const profileName = () => window.Profiles?.current?.().name || 'Guest';
  const when = t => { if (!t) return 'never'; const s = Math.round((Date.now() - t) / 1000); return s < 10 ? 'just now' : s < 60 ? s + ' seconds ago' : s < 3600 ? Math.round(s / 60) + ' min ago' : new Date(t).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }); };

  /* ---------- sync keys ---------- */
  const WORDS = 'amber anchor apple arrow aspen atlas autumn badge basil beacon birch bison blaze bloom breeze brick bridge brook cabin cactus camel candle canyon cedar cello chalk cherry cider cinder clover cobalt comet copper coral cosmos cotton crane crest cricket crystal dahlia daisy delta desert dune eagle ember falcon fern fiddle fjord flint forest fossil fox galaxy garnet geyser ginger glacier globe granite grove harbor hazel heron hollow honey horizon indigo iris island ivory jade jasper juniper kayak kettle kiwi lagoon lantern larch lemon lilac linen lotus lunar magnet mango maple marble meadow mesa meteor mint mocha monsoon moss nectar nickel nova oak oasis ocean olive onyx opal orbit orchid otter owl panda papaya pebble pepper pine planet plum polar poppy prairie prism quail quartz quill raven reef ridge river robin rocket saffron sage salmon sapphire savanna shadow shell sierra silver sparrow spruce summit sunset swallow tango tiger timber topaz tulip tundra velvet violet walnut willow winter yarrow zephyr zinc'.split(' ');
  function newKey() {
    const r = new Uint32Array(6); crypto.getRandomValues(r);
    return [0, 1, 2, 3, 4].map(i => WORDS[r[i] % WORDS.length]).join('-') + '-' + String(r[5] % 1000).padStart(3, '0');
  }
  const cleanKey = k => String(k || '').trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  /* ---------- codes: compress + base64url ---------- */
  const b64u = bytes => { let s = ''; bytes.forEach(b => s += String.fromCharCode(b)); return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); };
  const unb64u = str => { str = str.replace(/-/g, '+').replace(/_/g, '/'); while (str.length % 4) str += '='; const s = atob(str); return Uint8Array.from(s, c => c.charCodeAt(0)); };
  async function pipe(bytes, stream) { const out = new Response(new Blob([bytes]).stream().pipeThrough(stream)); return new Uint8Array(await out.arrayBuffer()); }
  async function encode(kind, obj) {
    const raw = new TextEncoder().encode(JSON.stringify(obj));
    if (typeof CompressionStream === 'function') { try { return 'ST1.' + kind + '.' + b64u(await pipe(raw, new CompressionStream('deflate-raw'))); } catch (e) { } }
    return 'ST0.' + kind + '.' + b64u(raw);
  }
  async function decode(text) {
    text = String(text || '').trim();
    const m = text.match(/(?:#|[?&])(?:st|sync)=([^&\s]+)/); if (m) text = decodeURIComponent(m[1]);
    const parts = text.replace(/\s+/g, '').match(/^ST([01])\.(X|P|F)\.([A-Za-z0-9_-]+)$/);
    if (!parts) throw Error('That doesn’t look like a Study Terminal code. Copy the whole thing, starting with “ST”.');
    let bytes = unb64u(parts[3]);
    if (parts[1] === '1') { if (typeof DecompressionStream !== 'function') throw Error('This browser can’t open compressed codes. Update it, or use a file instead.'); bytes = await pipe(bytes, new DecompressionStream('deflate-raw')); }
    return { kind: parts[2], data: JSON.parse(new TextDecoder().decode(bytes)) };
  }

  /* ---------- backends ---------- */
  const CONFLICT = 'conflict';
  function cloudBackend(key) {
    const p = project();
    const call = async (fn, body) => {
      const r = await fetch(p.url + '/rest/v1/rpc/' + fn, { method: 'POST', headers: { apikey: p.anon, Authorization: 'Bearer ' + p.anon, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!r.ok) { const t = await r.text().catch(() => ''); throw Error(r.status === 404 ? 'The cloud database isn’t set up yet (run the setup SQL).' : r.status === 401 ? 'The cloud key was rejected. Check the anon key.' : 'Cloud error ' + r.status + (t ? ': ' + t.slice(0, 120) : '')); }
      return r.json();
    };
    return {
      id: 'cloud', label: 'Cloud',
      async pull() { const rows = await call('get_progress', { k: key }); const row = Array.isArray(rows) ? rows[0] : null; return row ? { state: row.data, rev: Number(row.rev) } : null; },
      async push(state, rev) { const n = await call('put_progress', { k: key, d: state, expected: rev || 0 }); return Number(n) === -1 ? CONFLICT : Number(n); }
    };
  }
  let claudeDb = null, claudeUid = null;
  function claudeBackend() {
    const slug = pk().replace(/[^A-Za-z0-9_.~:@+-]/g, '_').slice(0, 120);
    const col = () => claudeDb.collection('data/users/' + claudeUid);
    // Split so no single document gets near the 256 KiB limit: core + one document per exam's review history.
    return {
      id: 'claude', label: 'Claude account',
      async pull() {
        const core = await col().doc('p-' + slug).get(); if (!core.exists) return null;
        const state = JSON.parse(JSON.stringify(core.data().state || {}));
        const exams = core.data().exams || [];
        state.learning = state.learning || { version: 1, exams: {} }; state.learning.exams = state.learning.exams || {};
        for (const ex of exams) { const d = await col().doc('p-' + slug + '-learn-' + ex).get(); if (d.exists) state.learning.exams[ex] = d.data().exam || {}; }
        return { state, rev: core.data().rev || 0 };
      },
      async push(state, rev) {
        const cur = await col().doc('p-' + slug).get();
        if (cur.exists && (cur.data().rev || 0) !== (rev || 0)) return CONFLICT;
        const copy = JSON.parse(JSON.stringify(state)); const exams = Object.keys(copy.learning?.exams || {});
        for (const ex of exams) { await col().doc('p-' + slug + '-learn-' + ex).set({ exam: copy.learning.exams[ex], at: Date.now() }); }
        if (copy.learning) copy.learning.exams = {};
        const next = (rev || 0) + 1;
        await col().doc('p-' + slug).set({ state: copy, exams, rev: next, at: Date.now(), player: profileName() });
        return next;
      }
    };
  }

  /* ---------- the sync loop ---------- */
  const status = { busy: false, route: null, msg: '', ok: null, at: 0 };
  let lastHash = '', timer = 0;
  function activeBackends() {
    const list = [];
    if (claudeDb && claudeUid && cfg().claude !== false) list.push(claudeBackend());
    if (hasProject() && cfg().cloudKey) list.push(cloudBackend(cfg().cloudKey));
    return list;
  }
  async function syncWith(b, attempt = 0) {
    const remote = await b.pull();
    const local = S().state, base = baseFor(b.id);
    const merged = remote ? M().merge(base, local, remote.state) : JSON.parse(JSON.stringify(local));
    if (stateHash(merged) !== stateHash(local)) { S().adopt(merged); if (remote) S().toast?.('Progress synced from your other device.'); }
    const out = M().outgoing(S().state);
    if (!remote || stateHash(out) !== stateHash(remote.state)) {
      const r = await b.push(out, remote ? remote.rev : 0);
      if (r === CONFLICT) { if (attempt < 2) return syncWith(b, attempt + 1); throw Error('Another device was saving at the same moment. Try again.'); }
    }
    LS.set(baseKey(b.id), out);
  }
  async function syncNow(reason) {
    const list = activeBackends(); if (!list.length || status.busy) return false;
    if (!navigator.onLine) { status.ok = null; status.msg = 'Offline. Will sync when you’re back online.'; paintPill(); return false; }
    status.busy = true; status.msg = 'Syncing…'; paintPill();
    try {
      for (const b of list) { status.route = b.label; await syncWith(b); }
      status.ok = true; status.at = Date.now(); status.msg = 'Synced'; lastHash = stateHash(S().state); setCfg({ lastSync: status.at });
    } catch (e) {
      // A guest on the private Claude link can read but not save there: turn Claude sync off for them quietly.
      if (e && e.code === 'invalid_argument' && status.route === 'Claude account') { claudeDb = null; status.ok = null; status.msg = ''; }
      else { status.ok = false; status.msg = e.message || 'Sync failed'; }
    }
    status.busy = false; paintPill(); if (S().page === 'sync') render();
    return status.ok;
  }
  const schedule = (ms = 4000) => { clearTimeout(timer); timer = setTimeout(() => syncNow('change'), ms); };
  setInterval(() => { if (!activeBackends().length || document.visibilityState !== 'visible') return; if (stateHash(S().state) !== lastHash) schedule(1500); }, 15000);
  setInterval(() => { if (activeBackends().length && document.visibilityState === 'visible') syncNow('poll'); }, 90000);
  document.addEventListener('visibilitychange', () => { if (!activeBackends().length) return; if (document.visibilityState === 'hidden') { if (stateHash(S().state) !== lastHash) syncNow('hide'); } else syncNow('show'); });
  window.addEventListener('online', () => schedule(500));

  /* ---------- top-bar status ---------- */
  function paintPill() {
    const tools = $('.top-tools'); if (!tools) return;
    let b = $('#sync-pill');
    if (!b) { b = document.createElement('button'); b.id = 'sync-pill'; b.dataset.action = 'sync-open'; const anchor = tools.querySelector('#profile-btn, .pf-btn, [data-action^="pf-"]'); anchor ? tools.insertBefore(b, anchor) : tools.appendChild(b); }
    const on = activeBackends().length > 0;
    b.className = 'sync-pill ' + (!on ? 'off' : status.busy ? 'busy' : status.ok === false ? 'bad' : status.ok ? 'good' : 'idle');
    b.innerHTML = `<span aria-hidden="true">⇅</span> ${!on ? 'Sync' : status.busy ? 'Syncing' : status.ok === false ? 'Sync issue' : status.ok ? 'Synced' : navigator.onLine ? 'Sync' : 'Offline'}`;
    b.title = on ? (status.msg || '') + (status.at ? ' · ' + when(status.at) : '') : 'Sync progress between devices';
    b.setAttribute('aria-label', 'Sync devices: ' + (b.textContent || '').trim());
  }

  /* ---------- page ---------- */
  let showKey = false, lastQR = '', scanStop = null;
  function qrSVG(text) {
    if (typeof window.qrcode !== 'function') return '';
    try { const q = window.qrcode(0, 'L'); q.addData(text, 'Byte'); q.make(); return q.createSvgTag({ cellSize: 4, margin: 2, scalable: true }); } catch (e) { return ''; }
  }
  const linkFor = code => { const base = /^https?:/.test(location.protocol) ? location.origin + location.pathname : project().playUrl; return base ? base + '#st=' + code : ''; };

  function render(note) {
    S().setPage('sync');
    const c = cfg(), p = project(), cloudOn = !!(hasProject() && c.cloudKey), claudeAvail = !!(claudeDb && claudeUid), claudeOn = claudeAvail && c.claude !== false;
    const statusLine = r => status.route === r && status.msg ? `<p class="sync-status ${status.ok === false ? 'bad' : ''}" role="status">${esc(status.msg)}${status.ok && status.at ? ' · ' + when(status.at) : ''}</p>` : '';
    const player = `<p class="source">Syncing player: <strong>${esc(profileName())}</strong>. Each player syncs separately.</p>`;
    $('#app').innerHTML = S().heading('TOOLS / SYNC', 'Sync your devices', 'Keep your laptop and phone on the same progress. Both devices keep working offline and merge when they reconnect. Your scores, XP, review schedule, and missed questions combine instead of overwriting.') +
      (note ? `<div class="sync-note" role="status">${note}</div>` : '') + player +
      `<div class="sync-grid">
      <section class="panel sync-card ${cloudOn ? 'is-on' : ''}"><span class="eyebrow">OPTION 1 · AUTOMATIC</span><h2>Cloud sync</h2>
        ${inClaude() ? `<p>Cloud sync works in the downloaded game folder and on a regular web link. Claude links can’t reach outside servers, so here use Claude sync or a transfer code.</p>` : !hasProject() ? `<p>Syncs by itself whenever you’re online, on any device and any link. It needs a free cloud database set up once. The steps are in <strong>SYNC-SETUP.md</strong> in the game folder.</p>
          <details class="sync-setup"><summary>I have the Project URL and anon key</summary><label class="field">Project URL<input id="sync-url" type="url" placeholder="https://xxxx.supabase.co" autocomplete="off"></label><label class="field">Anon (public) key<input id="sync-anon" type="text" placeholder="eyJ…" autocomplete="off" spellcheck="false"></label><button class="primary" data-action="sync-project-save">Save cloud settings</button></details>
          <p class="source">Or paste a setup/pairing code from your other device under “Receive” below.</p>`
        : !cloudOn ? `<p>Cloud is set up. Give this player a sync key, then enter the same key (or scan the pairing code) on your other device.</p>
          <div class="actions"><button class="primary" data-action="sync-key-new">Create a sync key</button></div>
          <label class="field">Already have a key?<input id="sync-key-in" type="text" placeholder="maple-orbit-lantern-quiet-river-482" autocomplete="off" spellcheck="false"></label><button data-action="sync-key-join">Use this key</button>`
        : `<p class="sync-on">On. This player syncs automatically.</p>
          <label class="field">Sync key <span class="source">(anyone with this key can see this player’s progress)</span><div class="sync-key"><code>${showKey ? esc(c.cloudKey) : '••••••••••••••••••••••'}</code><button data-action="sync-key-show">${showKey ? 'Hide' : 'Show'}</button><button data-action="sync-copy" data-copy="key">Copy</button></div></label>
          <div class="actions"><button class="primary" data-action="sync-now">Sync now</button><button data-action="sync-pair">Pair another device</button><button class="text-button danger" data-action="sync-key-off">Stop syncing here</button></div>`}
        ${statusLine('Cloud')}
        ${hasProject() ? `<p class="source">Friend on another device? <button class="text-button" data-action="sync-share-setup">Copy a setup code for them</button> (their progress stays separate).</p>` : ''}
      </section>
      <section class="panel sync-card ${claudeOn ? 'is-on' : ''}"><span class="eyebrow">OPTION 2 · CLAUDE ACCOUNT</span><h2>Claude sync</h2>
        ${claudeAvail ? (claudeOn ? `<p class="sync-on">On. Progress saves to your Claude account, so it’s the same on every device where you open this Claude link.</p><div class="actions"><button class="primary" data-action="sync-now">Sync now</button><button class="text-button" data-action="sync-claude-off">Turn off</button></div>` : `<p>Off on this device.</p><button class="primary" data-action="sync-claude-on">Turn on</button>`)
          : `<p>Works when you play from your private Claude link while signed in to Claude. It isn’t available in this copy${location.protocol === 'file:' ? ' (you opened the downloaded folder)' : ''}.</p>`}
        ${statusLine('Claude account')}
      </section>
      <section class="panel sync-card"><span class="eyebrow">OPTION 3 · NO ACCOUNT</span><h2>Send progress</h2>
        <p>Make a one-time code with this player’s progress, then open it on your other device. Copying on a Mac and pasting on an iPhone works with Universal Clipboard.</p>
        <div class="actions"><button class="primary" data-action="sync-xfer-make">Make transfer code</button>${inClaude() ? '' : '<button data-action="sync-xfer-file">Save as file</button>'}</div>
        <div id="sync-out"></div>
      </section>
      <section class="panel sync-card"><span class="eyebrow">RECEIVE</span><h2>Receive on this device</h2>
        <p>Paste a transfer, pairing, or setup code. It merges into <strong>${esc(profileName())}</strong> and keeps what’s already here.</p>
        <textarea id="sync-in" rows="3" placeholder="ST1.X.…" spellcheck="false" autocomplete="off"></textarea>
        <div class="actions"><button class="primary" data-action="sync-receive">Merge it in</button>${inClaude() ? '' : '<button data-action="sync-scan">Scan QR</button>'}<label class="sync-file-btn"><input type="file" id="sync-file" accept=".json,.txt,application/json,text/plain"> Open file</label></div>
        <div id="sync-scan-box" hidden><video id="sync-video" playsinline muted></video><canvas id="sync-canvas" hidden></canvas><button data-action="sync-scan-stop">Stop camera</button></div>
      </section></div>`;
    $('#sync-file')?.addEventListener('change', async e => { const f = e.target.files?.[0]; if (!f) return; try { await receive(await f.text()); } catch (err) { S().toast(err.message); } });
  }

  function showOut(code, label) {
    const qr = code.length <= 2200 && !inClaude() ? qrSVG(linkFor(code) || code) : '';
    lastQR = code;
    $('#sync-out').innerHTML = `<div class="sync-out"><label class="field">${esc(label)}<textarea readonly rows="3" id="sync-code">${esc(code)}</textarea></label>
      <div class="actions"><button class="primary" data-action="sync-copy" data-copy="code">Copy code</button>${navigator.share && !inClaude() ? '<button data-action="sync-share">Share…</button>' : ''}</div>
      ${qr ? `<div class="sync-qr">${qr}<p class="source">Scan with the game’s <strong>Scan QR</strong> button on the other device${linkFor(code) ? ', or with your phone camera to open the game with it' : ''}.</p></div>` : (inClaude() ? '' : `<p class="source">Too much progress to fit in a QR code. Use Copy, Share, or Save as file.</p>`)}</div>`;
  }

  async function receive(text) {
    const { kind, data } = await decode(text);
    if (kind === 'F') { // setup only (friend): project settings, no key
      if (!data.u || !data.a) throw Error('That setup code is incomplete.');
      LS.set(PROJECT_KEY, { url: data.u, anon: data.a }); render('Cloud settings added. Now create a sync key for this player.'); return;
    }
    if (kind === 'P') { // pairing: project + key
      if (!data.u || !data.a || !data.k) throw Error('That pairing code is incomplete.');
      LS.set(PROJECT_KEY, { url: data.u, anon: data.a }); setCfg({ cloudKey: cleanKey(data.k) }); LS.del(baseKey('cloud'));
      render('Paired. Syncing now…'); await syncNow('pair'); render(status.ok ? 'Paired and synced. This device now stays in step automatically.' : 'Paired, but the first sync didn’t finish: ' + esc(status.msg)); return;
    }
    // transfer
    if (data.app !== 'mgt354' || !data.state) throw Error('That code isn’t Study Terminal progress.');
    const before = M().size(S().state);
    const merged = M().merge(baseFor('xfer'), S().state, data.state);
    S().adopt(merged); LS.set(baseKey('xfer'), M().outgoing(data.state));
    const after = M().size(S().state);
    render(`Merged progress from ${esc(data.from || 'your other device')} (${esc(data.name || 'player')}, made ${esc(when(data.at))}). Answers on record: ${before.answers} → ${after.answers}. XP: ${before.xp} → ${after.xp}.`);
    if (activeBackends().length) syncNow('receive');
  }

  const deviceName = () => /iPhone|iPad|Android/i.test(navigator.userAgent) ? (navigator.userAgent.match(/iPhone|iPad|Android/i)[0]) : /Mac/i.test(navigator.userAgent) ? 'Mac' : 'computer';
  async function makeTransfer() {
    const out = M().outgoing(S().state);
    const code = await encode('X', { app: 'mgt354', v: 1, name: profileName(), from: deviceName(), at: Date.now(), state: out });
    LS.set(baseKey('xfer'), out); // what the other device will have after it merges this
    return code;
  }
  async function copy(text) {
    try { await navigator.clipboard.writeText(text); S().toast('Copied.'); }
    catch (e) { const t = $('#sync-code') || $('#sync-in'); if (t) { t.value = text; t.select(); } S().toast('Select the code and copy it.'); }
  }
  function download(name, text) {
    try { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type: 'text/plain' })); a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500); }
    catch (e) { S().toast('Saving files isn’t allowed here. Use Copy instead.'); }
  }

  /* ---------- QR scanning (camera + jsQR, loaded only when needed) ---------- */
  function loadScanner() {
    if (window.jsQR) return Promise.resolve();
    return new Promise((ok, bad) => { const s = document.createElement('script'); s.src = 'vendor/jsQR.js'; s.onload = ok; s.onerror = () => bad(Error('Scanner failed to load.')); document.head.appendChild(s); });
  }
  async function startScan() {
    const box = $('#sync-scan-box'), video = $('#sync-video'), canvas = $('#sync-canvas');
    try {
      await loadScanner();
      if (!navigator.mediaDevices?.getUserMedia) throw Error('No camera access here.');
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      box.hidden = false; video.srcObject = stream; await video.play();
      let alive = true; scanStop = () => { alive = false; stream.getTracks().forEach(t => t.stop()); box.hidden = true; scanStop = null; };
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      const tick = () => {
        if (!alive) return;
        if (video.readyState >= 2) {
          canvas.width = video.videoWidth; canvas.height = video.videoHeight; ctx.drawImage(video, 0, 0);
          const hit = window.jsQR(ctx.getImageData(0, 0, canvas.width, canvas.height).data, canvas.width, canvas.height, { inversionAttempts: 'dontInvert' });
          if (hit && hit.data) { scanStop(); window.StudyAudio?.play?.('select'); receive(hit.data).catch(e => S().toast(e.message)); return; }
        }
        requestAnimationFrame(tick);
      };
      tick();
    } catch (e) { S().toast((e && e.name === 'NotAllowedError' ? 'Camera permission was blocked.' : e.message || 'Camera isn’t available here.') + ' Paste the code instead.'); }
  }

  /* ---------- actions ---------- */
  document.addEventListener('click', async e => {
    const b = e.target.closest('[data-action^="sync-"]'); if (!b) return;
    e.stopPropagation(); e.preventDefault();
    const a = b.dataset.action;
    try {
      if (a === 'sync-open') { window.Study?.mode ? S().mode('sync') : render(); return; }
      if (a === 'sync-project-save') { const url = $('#sync-url').value.trim(), anon = $('#sync-anon').value.trim(); if (!/^https:\/\/.+/.test(url) || anon.length < 20) return S().toast('Paste the full Project URL (https://…) and the anon key.'); LS.set(PROJECT_KEY, { url, anon }); render('Cloud settings saved. Now create a sync key.'); return; }
      if (a === 'sync-key-new') { setCfg({ cloudKey: newKey() }); LS.del(baseKey('cloud')); showKey = true; render('Sync key created. Syncing…'); await syncNow('new'); render(status.ok ? 'Sync key created and your progress is in the cloud. Pair your other device next.' : 'Key created, but the first sync failed: ' + esc(status.msg)); return; }
      if (a === 'sync-key-join') { const k = cleanKey($('#sync-key-in').value); if (k.length < 20) return S().toast('That key looks too short. It should be five words and three digits.'); setCfg({ cloudKey: k }); LS.del(baseKey('cloud')); render('Joined. Syncing…'); await syncNow('join'); render(status.ok ? 'Joined and synced.' : 'Joined, but the first sync failed: ' + esc(status.msg)); return; }
      if (a === 'sync-key-show') { showKey = !showKey; render(); return; }
      if (a === 'sync-key-off') { setCfg({ cloudKey: '' }); LS.del(baseKey('cloud')); render('Cloud sync is off on this device. Your progress here is unchanged.'); paintPill(); return; }
      if (a === 'sync-now') { await syncNow('button'); render(status.ok ? 'All synced.' : esc(status.msg)); return; }
      if (a === 'sync-claude-on') { setCfg({ claude: true }); await syncNow('claude-on'); render(); return; }
      if (a === 'sync-claude-off') { setCfg({ claude: false }); render('Claude sync is off on this device.'); paintPill(); return; }
      if (a === 'sync-pair') { const p = project(); showOut(await encode('P', { u: p.url, a: p.anon, k: cfg().cloudKey }), 'Pairing code: open Sync on your other device and paste or scan this'); return; }
      if (a === 'sync-share-setup') { const p = project(); const code = await encode('F', { u: p.url, a: p.anon }); await copy(code); render('Setup code copied. Send it to your friend. They paste it under Receive, then create their own sync key.'); return; }
      if (a === 'sync-xfer-make') { showOut(await makeTransfer(), 'Transfer code for ' + profileName()); return; }
      if (a === 'sync-xfer-file') { const code = await makeTransfer(); download('study-terminal-' + profileName().toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + new Date().toISOString().slice(0, 10) + '.txt', code); return; }
      if (a === 'sync-copy') { await copy(b.dataset.copy === 'key' ? cfg().cloudKey : ($('#sync-code')?.value || lastQR)); return; }
      if (a === 'sync-share') { try { await navigator.share({ title: 'Study Terminal progress', text: $('#sync-code').value }); } catch (err) { } return; }
      if (a === 'sync-receive') { const t = $('#sync-in').value; if (!t.trim()) return S().toast('Paste a code first.'); await receive(t); return; }
      if (a === 'sync-scan') { startScan(); return; }
      if (a === 'sync-scan-stop') { scanStop?.(); return; }
    } catch (err) { S().toast(err.message || 'Something went wrong.'); }
  }, true);

  /* ---------- start ---------- */
  async function init() {
    paintPill();
    // A code in the link (#st=…) from a scanned QR: merge it, then clean the address bar.
    if (/[#&?]st=/.test(location.hash)) { const code = location.hash; history.replaceState(null, '', location.pathname + location.search); try { await receive(code); } catch (e) { S().toast(e.message); } }
    // Claude account sync, only on the Claude link.
    try {
      if (window.claude?.use) {
        const [db, user] = await Promise.all([window.claude.use('db'), window.claude.use('user')]);
        const uid = user ? await user.id() : null;
        if (db && uid) { claudeDb = db; claudeUid = uid; }
      }
    } catch (e) { }
    paintPill();
    if (activeBackends().length) syncNow('start');
  }
  window.SyncUI = { open: render, syncNow, init, _decode: decode, _encode: encode, get status() { return status; } };
})();
