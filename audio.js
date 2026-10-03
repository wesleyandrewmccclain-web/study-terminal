/* Quiet Relay (menus): offline, original score composed with the Midify plugin.
 * Area music (study / combat / exam) and all effects: original Web Audio synthesis.
 * Music: assets/audio/quiet-relay.wav. Effects: original Web Audio synthesis.
 * Sound is opt-in. No network or third-party audio libraries are needed.
 */
(() => {
  'use strict';
  const music = new Audio('assets/audio/quiet-relay.wav');
  music.loop = true;
  music.preload = 'none';
  const storageKey = 'mgt354-audio-prefs';
  const preferences = { enabled: false, music: false, effects: false, volume: 0.35, musicVolume: 0.35, sfxVolume: 0.35, areaMusic: true };
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
    if (saved && typeof saved === 'object') {
      for (const key of ['enabled', 'music', 'effects', 'areaMusic']) {
        if (typeof saved[key] === 'boolean') preferences[key] = saved[key];
      }
      if (typeof saved.volume === 'number' && Number.isFinite(saved.volume)) {
        preferences.volume = Math.min(1, Math.max(0, saved.volume));
        preferences.musicVolume = preferences.sfxVolume = preferences.volume;
      }
    }
    for (const k of ['musicVolume', 'sfxVolume']) if (saved && typeof saved[k] === 'number' && Number.isFinite(saved[k])) preferences[k] = Math.min(1, Math.max(0, saved[k]));
  } catch (_) { /* Private browsing and file URLs may restrict storage. */ }
  const state = {
    enabled: preferences.enabled,
    music: preferences.enabled && preferences.music,
    effects: preferences.enabled && preferences.effects,
    volume: preferences.volume,
    musicVolume: preferences.musicVolume,
    sfxVolume: preferences.sfxVolume,
    areaMusic: preferences.areaMusic
  };
  let context = null;
  let lastEffect = 0;
  let unlocked = false;
  let musicRequest = 0;
  const activeTones = new Set();
  function remember() {
    try { localStorage.setItem(storageKey, JSON.stringify(preferences)); } catch (_) {}
  }
  function syncState() {
    state.enabled = preferences.enabled;
    state.music = preferences.enabled && preferences.music;
    state.effects = preferences.enabled && preferences.effects;
    state.volume = preferences.volume;
    state.musicVolume = preferences.musicVolume;
    state.sfxVolume = preferences.sfxVolume;
    state.areaMusic = preferences.areaMusic;
  }
  function muteEffects() {
    for (const oscillator of activeTones) {
      try { oscillator.stop(); } catch (_) {}
    }
    activeTones.clear();
  }
  function changed(error) {
    window.dispatchEvent(new CustomEvent('study-audio-change', {
      detail: { ...state, error: error || null }
    }));
  }
  function audioContext() {
    const Context = window.AudioContext || window.webkitAudioContext;
    if (!Context) return null;
    if (!context) context = new Context();
    if (context.state === 'suspended') context.resume().catch(() => {});
    return context;
  }
  function tone(ctx, frequency, start, duration, gain, type = 'sine', endFrequency) {
    const oscillator = ctx.createOscillator();
    const envelope = ctx.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, start);
    if (endFrequency) oscillator.frequency.exponentialRampToValueAtTime(endFrequency, start + duration);
    envelope.gain.setValueAtTime(0.0001, start);
    envelope.gain.exponentialRampToValueAtTime(Math.max(gain * state.sfxVolume, .0002), start + .008);
    envelope.gain.exponentialRampToValueAtTime(.0001, start + duration);
    oscillator.connect(envelope);
    envelope.connect(ctx.destination);
    oscillator.start(start);
    oscillator.stop(start + duration + .02);
    activeTones.add(oscillator);
    oscillator.onended = () => { activeTones.delete(oscillator); oscillator.disconnect(); envelope.disconnect(); };
  }
  const patterns = {
    navigation: [[660,0,.09,.09],[880,.04,.10,.045]],
    select: [[740,0,.07,.09]],
    correct: [[587,0,.16,.11],[740,.08,.17,.10],[880,.16,.28,.09]],
    incorrect: [[294,0,.15,.075],[247,.12,.24,.055]],
    flip: [[523,0,.12,.065,'sine',784]],
    match: [[587,0,.14,.095],[880,.10,.24,.08]],
    timer: [[880,0,.14,.085],[880,.23,.13,.06]],
    complete: [[587,0,.30,.09],[740,.12,.30,.08],[880,.24,.35,.07],[1175,.42,.65,.055]],
    start: [[440,0,.12,.07],[587,.08,.18,.08],[880,.18,.25,.065]],
    reset: [[440,0,.15,.065],[330,.10,.20,.045]],
    hint: [[659,0,.14,.065],[784,.08,.23,.055]],
    error: [[220,0,.15,.07]],
    hit: [[1320,0,.05,.05,'square',660],[1760,.03,.06,.04,'square',880],[990,.06,.09,.05,'triangle',330]],
    damage: [[180,0,.28,.13,'sawtooth',60],[95,.02,.35,.11,'square',45]],
    explode: [[220,0,.6,.12,'sawtooth',40],[110,.05,.9,.12,'square',30]],
    victory: [[523,.35,.16,.08,'triangle'],[659,.5,.16,.08,'triangle'],[784,.65,.16,.08,'triangle'],[1047,.8,.7,.09,'triangle'],[784,.8,.7,.05,'sine']],
    defeat: [[392,0,.35,.08,'triangle'],[330,.3,.35,.08,'triangle'],[262,.6,.35,.08,'triangle'],[196,.9,1.1,.09,'triangle',180]],
    rankup: [[440,0,.12,.07,'square'],[554,.1,.12,.07,'square'],[659,.2,.12,.07,'square'],[880,.3,.5,.08,'square'],[1109,.45,.6,.05,'triangle']],
    goal: [[784,0,.12,.08,'triangle'],[988,.1,.12,.08,'triangle'],[1175,.2,.45,.08,'triangle'],[1568,.35,.5,.04,'sine']],
    tick: [[1400,0,.04,.05,'square']],
    type: [[1800,0,.02,.02,'square']],
    duelwin: [[659,0,.14,.08,'square'],[784,.12,.14,.08,'square'],[988,.24,.14,.08,'square'],[1319,.36,.6,.08,'triangle']],
    duellose: [[494,0,.2,.07,'triangle'],[440,.18,.2,.07,'triangle'],[370,.36,.6,.07,'triangle']],
    shield: [[880,0,.3,.06,'sine',1760],[1320,.05,.3,.04,'sine',2640]],
    chip: [[1046,0,.06,.06,'square'],[1568,.05,.1,.05,'square']]
  };
  const noiseFx = { damage: [.25, .16, 900], explode: [1.1, .22, 1400], hit: [.06, .05, 6000] };
  let noiseBuf = null;
  function noise(ctx, start, dur, gain, freq) {
    if (!noiseBuf) { noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate); const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; }
    const src = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    src.buffer = noiseBuf; f.type = 'lowpass'; f.frequency.setValueAtTime(freq, start); f.frequency.exponentialRampToValueAtTime(Math.max(80, freq / 8), start + dur);
    g.gain.setValueAtTime(gain * state.sfxVolume, start); g.gain.exponentialRampToValueAtTime(.0001, start + dur);
    src.connect(f); f.connect(g); g.connect(ctx.destination); src.start(start); src.stop(start + dur + .05);
  }
  const aliases = { click:'select', next:'navigation', back:'navigation', wrong:'incorrect', right:'correct', finish:'complete', success:'match', reveal:'flip', tab:'navigation', warning:'timer' };
  function play(name = 'select') {
    if (!state.enabled || !state.effects || state.sfxVolume === 0) return;
    const now = performance.now();
    if (now - lastEffect < 40) return;
    lastEffect = now;
    const ctx = audioContext();
    if (!ctx) return;
    const pattern = patterns[aliases[name] || name] || patterns.select;
    const start = ctx.currentTime + .015;
    for (const [frequency, delay, duration, gain, type, end] of pattern) {
      tone(ctx, frequency, start + delay, duration, gain, type, end);
    }
    const nz = noiseFx[aliases[name] || name]; if (nz) noise(ctx, start, nz[0], nz[1], nz[2]);
  }

  /* ---------- area music: original synthesized loops ---------- */
  const hz = m => 440 * Math.pow(2, (m - 69) / 12);
  let musicBus = null, synth = null, scene = 'terminal';
  function bus() {
    const ctx = audioContext(); if (!ctx) return null;
    if (!musicBus) { musicBus = ctx.createGain(); musicBus.connect(ctx.destination); }
    musicBus.gain.setTargetAtTime(state.musicVolume * .45, ctx.currentTime, .05);
    return musicBus;
  }
  function voice(ctx, out, freq, t, dur, { type = 'sine', gain = .05, attack = .01, release = .3, cutoff = 0, q = .7 } = {}) {
    const o = ctx.createOscillator(), g = ctx.createGain(); o.type = type; o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(gain, t + attack);
    g.gain.setValueAtTime(gain, t + Math.max(attack, dur - release)); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    let node = o; if (cutoff) { const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = cutoff; f.Q.value = q; o.connect(f); node = f; }
    node.connect(g); g.connect(out); o.start(t); o.stop(t + dur + .05);
  }
  function kick(ctx, out, t, gain = .22) {
    const o = ctx.createOscillator(), g = ctx.createGain(); o.frequency.setValueAtTime(130, t); o.frequency.exponentialRampToValueAtTime(42, t + .16);
    g.gain.setValueAtTime(gain, t); g.gain.exponentialRampToValueAtTime(.0001, t + .28); o.connect(g); g.connect(out); o.start(t); o.stop(t + .3);
  }
  function hat(ctx, out, t, gain = .03, dur = .05, freq = 7000) {
    if (!noiseBuf) { noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate); const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; }
    const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain(); s.buffer = noiseBuf; f.type = 'highpass'; f.frequency.value = freq;
    g.gain.setValueAtTime(gain, t); g.gain.exponentialRampToValueAtTime(.0001, t + dur); s.connect(f); f.connect(g); g.connect(out); s.start(t, Math.random() * .5); s.stop(t + dur + .02);
  }
  const TRACKS = {
    // "Archive Drift": slow, warm, for studying. 72 bpm, D dorian.
    study: { bpm: 72, bars: 4, level: 4.6, step(ctx, out, i, t, sp) {
      const bar = Math.floor(i / 16) % 4, s = i % 16;
      const chords = [[50, 57, 60, 64, 69], [46, 53, 57, 62, 65], [41, 53, 57, 60, 64], [48, 55, 59, 62, 67]];
      const ch = chords[bar];
      if (s === 0) { ch.forEach((m, k) => voice(ctx, out, hz(m), t, sp * 16 + .8, { type: k ? 'triangle' : 'sine', gain: k ? .018 : .05, attack: 1.2, release: 1.4, cutoff: 1400 })); }
      const arp = { 2: 3, 5: 4, 8: 2, 11: 4, 14: 3 }; if (s in arp && (bar !== 3 || s < 11)) voice(ctx, out, hz(ch[arp[s]] + 12), t, .9, { gain: .03, attack: .005, release: .8 });
    } },
    // "Core Breach": driving, for boss battles. 124 bpm, A minor.
    combat: { bpm: 124, bars: 4, level: 4.2, step(ctx, out, i, t, sp) {
      const bar = Math.floor(i / 16) % 4, s = i % 16, roots = [45, 41, 48, 43], r = roots[bar];
      const tri = [[57, 60, 64], [53, 57, 60], [55, 60, 64], [55, 59, 62]][bar];
      if (s % 4 === 0) kick(ctx, out, t);
      if (s % 4 === 2) hat(ctx, out, t, .035);
      if (s === 4 || s === 12) hat(ctx, out, t, .05, .12, 2500);
      if (s % 2 === 0) voice(ctx, out, hz(r - 12 + (s % 8 === 6 ? 12 : 0)), t, sp * 1.8, { type: 'sawtooth', gain: .05, release: .08, cutoff: 700, q: 4 });
      voice(ctx, out, hz(tri[(i >> 0) % 3] + 12 + ((s >> 2) % 2) * 12), t, sp * .9, { type: 'square', gain: .012, release: .05, cutoff: 2600 });
      if (s === 0) tri.forEach(m => voice(ctx, out, hz(m), t, sp * 16, { type: 'sawtooth', gain: .008, attack: .4, release: .6, cutoff: 1100 }));
    } },
    // "Countdown Protocol": tense and sparse, for timed exams and duels. 92 bpm, E phrygian.
    exam: { bpm: 92, bars: 4, level: 4.8, step(ctx, out, i, t, sp) {
      const bar = Math.floor(i / 16) % 4, s = i % 16;
      if (s % 4 === 0) hat(ctx, out, t, s === 0 ? .045 : .028, .04, 5000);
      if (s === 0 || s === 10) voice(ctx, out, hz(bar === 3 ? 29 : 28), t, sp * 5, { gain: .09, attack: .01, release: .5, cutoff: 300 });
      if (s === 0 && bar % 2 === 0) [52, 53, 59].forEach(m => voice(ctx, out, hz(m), t, sp * 32, { type: 'triangle', gain: .016, attack: 2, release: 2, cutoff: 900 }));
      if ((bar === 1 && s === 6) || (bar === 3 && s === 14)) { const m = bar === 1 ? 71 : 76; voice(ctx, out, hz(m), t, 1.8, { gain: .035, release: 1.6 }); voice(ctx, out, hz(m + 19), t, 1.2, { gain: .01, release: 1 }); }
    } }
  };
  function startSynth(name) {
    const ctx = audioContext(), out0 = bus(); if (!ctx || !out0 || !TRACKS[name]) return null;
    const def = TRACKS[name], out = ctx.createGain(); out.gain.value = 0; out.connect(out0);
    const sp = 60 / def.bpm / 4; let i = 0, next = ctx.currentTime + .08;
    const tick = () => { while (next < ctx.currentTime + .25) { def.step(ctx, out, i, next, sp); i++; next += sp; } };
    tick(); const timer = setInterval(tick, 40);
    out.gain.setTargetAtTime(def.level || 1, ctx.currentTime, .6);
    return { name, stop() { clearInterval(timer); out.gain.setTargetAtTime(0, ctx.currentTime, .35); setTimeout(() => out.disconnect(), 2500); } };
  }
  function stopSynth() { if (synth) { synth.stop(); synth = null; } }
  function fadeWav(to, done) {
    const from = music.volume, steps = 12; let k = 0; clearInterval(fadeWav.t);
    fadeWav.t = setInterval(() => { k++; music.volume = Math.max(0, Math.min(1, from + (to - from) * k / steps)); if (k >= steps) { clearInterval(fadeWav.t); done && done(); } }, 60);
  }
  function applyScene() {
    if (!state.enabled || !state.music) return;
    if (scene === 'terminal') { stopSynth(); if (music.paused) { music.volume = 0; music.play().then(() => fadeWav(state.musicVolume * .45)).catch(() => {}); } else fadeWav(state.musicVolume * .45); }
    else { if (!music.paused) fadeWav(0, () => music.pause()); if (!synth || synth.name !== scene) { stopSynth(); synth = startSynth(scene); } }
  }
  let lastScene = 'terminal';
  function setScene(name) {
    lastScene = name;
    const n = preferences.areaMusic === false ? 'terminal' : (TRACKS[name] ? name : 'terminal');
    if (n === scene) return; scene = n;
    if (unlocked) applyScene();
  }
  async function startMusic() {
    const request = ++musicRequest;
    if (!state.enabled || !state.music) {
      music.pause(); stopSynth();
      return false;
    }
    if (scene !== 'terminal') { music.pause(); if (!synth || synth.name !== scene) { stopSynth(); synth = startSynth(scene); } changed(); return !!synth; }
    stopSynth();
    music.volume = state.musicVolume * .45;
    try {
      await music.play();
      if (request !== musicRequest || !state.enabled || !state.music) {
        if (!state.enabled || !state.music) music.pause();
        return false;
      }
      changed();
      return true;
    } catch (error) {
      if (request === musicRequest) changed('Music could not start. Tap the music button again.');
      return false;
    }
  }
  async function setMusic(on) {
    preferences.music = Boolean(on);
    if (on) preferences.enabled = true;
    syncState();
    remember();
    changed();
    return startMusic();
  }
  function setEffects(on) {
    preferences.effects = Boolean(on);
    if (on) preferences.enabled = true;
    syncState();
    if (state.effects) {
      if (!audioContext()) {
        preferences.effects = false;
        state.effects = false;
        remember();
        changed('This browser does not support sound effects.');
        return false;
      }
      play('select');
    } else {
      muteEffects();
    }
    remember();
    changed();
    return state.effects;
  }
  async function setSound(on) {
    preferences.enabled = Boolean(on);
    if (on && !preferences.music && !preferences.effects) {
      preferences.music = true;
      preferences.effects = true;
    }
    syncState();
    remember();
    changed();
    if (!on) {
      ++musicRequest;
      music.pause(); stopSynth();
      muteEffects();
      return false;
    }
    unlocked = true;
    if (state.effects) { audioContext(); play('select'); }
    if (state.music) await startMusic();
    return state.enabled;
  }
  const clamp = v => Math.min(1, Math.max(0, Number(v) || 0));
  function setVolume(value) {
    preferences.volume = preferences.musicVolume = preferences.sfxVolume = clamp(value);
    syncState(); music.volume = state.musicVolume * .45; if (musicBus) bus(); remember(); changed();
  }
  function setMusicVolume(value) {
    preferences.musicVolume = clamp(value);
    syncState(); clearInterval(fadeWav.t); if (scene === 'terminal') music.volume = state.musicVolume * .45; if (musicBus) bus(); remember(); changed();
  }
  function setSfxVolume(value) {
    preferences.sfxVolume = clamp(value);
    syncState(); remember(); changed();
  }
  // A remembered ON choice resumes only after a real user interaction.
  function unlock() {
    if (unlocked) return;
    unlocked = true;
    document.removeEventListener('pointerdown', unlock);
    document.removeEventListener('keydown', unlock);
    if (state.enabled && state.effects) audioContext();
    if (state.enabled && state.music) startMusic();
  }
  document.addEventListener('pointerdown', unlock, { passive: true });
  document.addEventListener('keydown', unlock);
  // Pause when a phone switches apps; resume only if music was enabled.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { music.pause(); stopSynth(); }
    else if (unlocked && state.enabled && state.music) startMusic();
  });
  music.addEventListener('error', () => {
    changed('The offline music file could not be loaded.');
  });
  window.StudyAudio = Object.freeze({
    get state() { return { ...state }; },
    play,
    setMusic,
    setEffects,
    setSound,
    setVolume,
    setMusicVolume,
    setSfxVolume,
    setScene,
    _tracks: TRACKS,
    get scene() { return scene; },
    setAreaMusic(on) { preferences.areaMusic = !!on; syncState(); remember(); const target = on && TRACKS[lastScene] ? lastScene : 'terminal'; if (target !== scene) { scene = target; if (unlocked) applyScene(); } changed(); },
    toggleSound: () => setSound(!state.enabled),
    toggleMusic: () => setMusic(!state.music),
    toggleEffects: () => setEffects(!state.effects),
    stop: () => setSound(false)
  });
})();
