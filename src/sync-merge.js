/* Progress merge for syncing one player between devices.
   Three-way: merge(base, local, remote) where base is the last state both sides agreed on.
   Counters add both sides' new work (never dropping below either side), per-item review records keep
   the most recent answer, and unfinished sessions stay on the device they were started on.
   Pure functions: no DOM, no storage. Runs in the browser and in Node tests. */
(function (global) {
  'use strict';
  const isObj = v => !!v && typeof v === 'object' && !Array.isArray(v);
  const num = v => (Number.isFinite(v) ? v : 0);
  const clone = v => (v === undefined ? undefined : JSON.parse(JSON.stringify(v)));
  const same = (x, y) => JSON.stringify(x) === JSON.stringify(y);

  // Fields that describe work in progress on one device. Never sent, never overwritten.
  const LOCAL_ONLY = ['session', 'sessions', 'practice', 'sheet', 'mockRun'];

  /** Add both sides' increments since base. Never lower than either side. */
  function counter(b, l, r) {
    b = num(b); l = num(l); r = num(r);
    return Math.max(l, r, l + r - b);
  }
  /** Last-writer choice: keep whichever side changed; if both changed, prefer local. */
  function pick(b, l, r) {
    if (l === undefined) return clone(r);
    if (r === undefined) return clone(l);
    if (same(l, b)) return clone(r);
    return clone(l);
  }
  /** Set merge: keep additions from both, drop what either side removed. */
  function set3(b, l, r) {
    b = Array.isArray(b) ? b : []; l = Array.isArray(l) ? l : []; r = Array.isArray(r) ? r : [];
    const removed = new Set(b.filter(x => !l.includes(x) || !r.includes(x)));
    const out = [];
    for (const x of [...l, ...r]) if (!out.includes(x) && !(removed.has(x) && b.includes(x))) out.push(x);
    return out;
  }
  function counterMap(b, l, r) {
    b = isObj(b) ? b : {}; l = isObj(l) ? l : {}; r = isObj(r) ? r : {};
    const out = {};
    for (const k of new Set([...Object.keys(l), ...Object.keys(r)])) out[k] = counter(b[k], l[k], r[k]);
    return out;
  }

  function mergeStats(b, l, r) {
    b = isObj(b) ? b : {}; l = isObj(l) ? l : {}; r = isObj(r) ? r : {};
    const out = {};
    for (const k of new Set([...Object.keys(l), ...Object.keys(r)])) {
      const bb = b[k] || {}, ll = l[k] || {}, rr = r[k] || {};
      const total = counter(bb.total, ll.total, rr.total);
      const correct = Math.min(total, counter(bb.correct, ll.correct, rr.correct));
      out[k] = { ...(ll.total !== undefined ? ll : rr), total, correct };
    }
    return out;
  }

  function mergeHistory(l, r) {
    const all = [...(Array.isArray(l) ? l : []), ...(Array.isArray(r) ? r : [])];
    const seen = new Set(), out = [];
    for (const h of all) { const k = JSON.stringify(h); if (!seen.has(k)) { seen.add(k); out.push(h); } }
    out.sort((x, y) => String(y.date || '').localeCompare(String(x.date || '')));
    return out.slice(0, 40);
  }

  /** One learning record per question/card/problem: newest answer wins, attempt counts add up. */
  function mergeItem(b, l, r) {
    if (!isObj(l)) return clone(r);
    if (!isObj(r)) return clone(l);
    const newer = num(r.last) > num(l.last) ? r : l;
    const out = clone(newer);
    b = isObj(b) ? b : {};
    for (const k of ['attempts', 'correct', 'lapses']) out[k] = counter(b[k], l[k], r[k]);
    out.correct = Math.min(out.correct, out.attempts);
    const days = [...new Set([...(l.days || []), ...(r.days || [])])];
    out.days = days.slice(-10);
    return out;
  }

  function mergeLearning(b, l, r) {
    if (!isObj(l)) return clone(r);
    if (!isObj(r)) return clone(l);
    b = isObj(b) ? b : {};
    const out = { ...clone(l), version: Math.max(num(l.version), num(r.version)) || 1, exams: {} };
    const le = l.exams || {}, re = r.exams || {}, be = b.exams || {};
    for (const ex of new Set([...Object.keys(le), ...Object.keys(re)])) {
      const L = le[ex] || {}, R = re[ex] || {}, B = be[ex] || {};
      const items = {};
      for (const id of new Set([...Object.keys(L.items || {}), ...Object.keys(R.items || {})])) items[id] = mergeItem((B.items || {})[id], (L.items || {})[id], (R.items || {})[id]);
      const campaign = {};
      for (const t of new Set([...Object.keys(L.campaign || {}), ...Object.keys(R.campaign || {})])) {
        const lc = (L.campaign || {})[t] || {}, rc = (R.campaign || {})[t] || {};
        const lt = num(lc.lastCheckpoint && lc.lastCheckpoint.at), rt = num(rc.lastCheckpoint && rc.lastCheckpoint.at);
        campaign[t] = { ...(rt > lt ? rc : lc), checkpoint: !!(lc.checkpoint || rc.checkpoint) };
      }
      const exOut = { ...clone(R), ...clone(L), items, campaign };
      if (L.mission === undefined) delete exOut.mission; // in-progress mission stays local
      out.exams[ex] = exOut;
    }
    return out;
  }

  function mergeOps(b, l, r) {
    if (!isObj(l)) return clone(r);
    if (!isObj(r)) return clone(l);
    b = isObj(b) ? b : {};
    const best = {};
    for (const k of new Set([...Object.keys(l.best || {}), ...Object.keys(r.best || {})])) best[k] = Math.max(num((l.best || {})[k]), num((r.best || {})[k]));
    return {
      ...clone(r), ...clone(l),
      xp: counter(b.xp, l.xp, r.xp),
      equipped: clone(l.equipped || r.equipped || ['repair']),
      cleared: { ...(r.cleared || {}), ...(l.cleared || {}) },
      best
    };
  }

  function mergeExtras(b, l, r) {
    if (!isObj(l)) return clone(r);
    if (!isObj(r)) return clone(l);
    b = isObj(b) ? b : {};
    const out = { ...clone(r), ...clone(l) };
    out.mathMiss = counterMap(b.mathMiss, l.mathMiss, r.mathMiss);
    const ld = l.daily || {}, rd = r.daily || {}, bd = b.daily || {};
    if (ld.day && ld.day === rd.day) out.daily = { day: ld.day, n: counter(bd.day === ld.day ? bd.n : 0, ld.n, rd.n) };
    else out.daily = clone(String(rd.day || '') > String(ld.day || '') ? rd : ld);
    out.goal = pick(b.goal, l.goal, r.goal);
    const ls = l.streak || {}, rs = r.streak || {};
    out.streak = clone(String(rs.last || '') > String(ls.last || '') ? rs : ls);
    for (const k of Object.keys(out)) if (!['mathMiss', 'daily', 'goal', 'streak'].includes(k)) out[k] = generic(b[k], l[k], r[k]);
    return out;
  }

  /** Fallback for anything added later: objects merge key by key, leaves keep the side that changed. */
  function generic(b, l, r) {
    if (isObj(l) && isObj(r)) {
      b = isObj(b) ? b : {};
      const out = {};
      for (const k of new Set([...Object.keys(l), ...Object.keys(r)])) out[k] = generic(b[k], l[k], r[k]);
      return out;
    }
    return pick(b, l, r);
  }

  /** Strip device-only fields before sending. */
  function outgoing(state) {
    const s = clone(state) || {};
    for (const k of LOCAL_ONLY) delete s[k];
    if (isObj(s.learning) && isObj(s.learning.exams)) for (const ex of Object.values(s.learning.exams)) if (isObj(ex)) delete ex.mission;
    return s;
  }

  function merge(base, local, remote) {
    const b = outgoing(base || {}), l = clone(local) || {}, r = outgoing(remote || {});
    const out = {};
    for (const k of new Set([...Object.keys(l), ...Object.keys(r)])) {
      if (LOCAL_ONLY.includes(k)) { if (l[k] !== undefined) out[k] = clone(l[k]); continue; }
      switch (k) {
        case 'stats': out.stats = mergeStats(b.stats, l.stats, r.stats); break;
        case 'missed': out.missed = set3(b.missed, l.missed, r.missed); break;
        case 'cards': out.cards = generic(b.cards, l.cards, r.cards); break;
        case 'history': out.history = mergeHistory(l.history, r.history); break;
        case 'streak': out.streak = l.streak !== undefined ? l.streak : r.streak; break;
        case 'best': out.best = Math.max(num(l.best), num(r.best)); break;
        case 'ops': out.ops = mergeOps(b.ops, l.ops, r.ops); break;
        case 'extras': out.extras = mergeExtras(b.extras, l.extras, r.extras); break;
        case 'learning': out.learning = mergeLearning(b.learning, l.learning, r.learning); break;
        default: out[k] = generic(b[k], l[k], r[k]);
      }
    }
    out.best = Math.max(num(out.best), num(out.streak));
    return out;
  }

  /** How much study is in a state (for "which side has more" messages). */
  function size(s) {
    s = s || {};
    const answers = Object.values(s.stats || {}).reduce((n, v) => n + num(v && v.total), 0);
    return { answers, xp: num(s.ops && s.ops.xp) };
  }

  global.SyncMerge = { merge, outgoing, counter, set3, size, LOCAL_ONLY, same };
})(typeof window === 'undefined' ? globalThis : window);
