/* Home dashboard. Course content and saved records remain owned by Study. */
(() => {
  'use strict';
  let filter = 'study';
  const modules = [
    ['quiz','Quick quiz','Immediate feedback. Build your recall one question at a time.','quiz','study','10–20 QUESTIONS'],
    ['math','Math Lab','Work through the formulas, with each step explained.','math-lab','study','GUIDED PRACTICE'],
    ['flash','Flashcards','Recall it, reveal it, then bring the tricky cards back.','flashcards','study','ACTIVE RECALL'],
    ['exam','Exam simulation','Put it together in a timed, full-length practice run.','exam-sim','study','75 MINUTES'],
    ['sheet','Worksheet','Build pay tables and follow a step-by-step walkthrough.','worksheet','study','WORK IT OUT'],
    ['cue','Cue Match','Connect the language of a question to the right concept.','cue-match','study','4 PAIRS / ROUND'],
    ['assault','Assault','Answer to attack. Build a combo. Clear every boss.','assault','play','BOSS BATTLES'],
    ['duel','Duel','Challenge another player on this device.','duel','play','LOCAL MULTIPLAYER'],
    ['chips','Chips & Rank','Turn your earned XP into upgrades for your next battle.','chips','play','YOUR LOADOUT'],
    ['board','Leaderboard','Compare the records of players on this device.','board','play','LOCAL RECORDS'],
    ['drill','Weak-spot drill','Let your mistakes guide the next study session.','drill','tools','PERSONALIZED'],
    ['cram','Cram sheet','Keep formulas, cues, and weak spots in one place.','cram','tools','QUICK REFERENCE'],
    ['mathexam','Math exam','A timed run focused on calculations.','mathexam','tools','TIMED PRACTICE'],
    ['scenarios','Scenarios','Apply the concepts to cases from your course material.','scenarios','tools','APPLIED RECALL'],
    ['search','Search archive','Find a term, source question, formula, or explanation.','search','tools','CONTENT LIBRARY']
  ];
  const S = () => window.Study;
  const esc = value => S().esc(value);
  const today = () => { const d=new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
  let duration=10;
  const symbol = id => ({quiz:'✓',math:'∑',flash:'▤',missions:'→',campaign:'◇',review:'↺',exam:'◷',sheet:'▦',cue:'⊷',scenarios:'◎',assault:'⌖',duel:'⚔',chips:'◇',board:'▥',drill:'◎',cram:'▤',mathexam:'∑',search:'⌕',install:'↗',mock:'◷',written:'✎',lookup:'⌕',listen:'♪',daily:'◈',arcade:'♥',badges:'★',plan:'▤'})[id]||'◇';
  function cards() {
    const extra=[['missions','Study missions','A focused mix based on what you need next.','drill','study',''],['review','Review queue','Return to material when it is due.','flashcards','study',''],['campaign','Campaign','Practice, pass checkpoints, and clear the bosses.','assault','play',''],['install','Phone & offline','Install the game and move your progress between devices.','board','tools','']];
    return [...extra,...modules,...(window.Boost?.library||[]),...(window.Fun?.library||[]),...(window.Plan?.library||[])].filter(m=>(filter==='all'||m[4]===filter)&&(m[0]!=='sheet'||window.Worksheet)).map(([id,name,desc])=>`<button class="activity-row" data-action="mode" data-mode="${id}"><span class="activity-icon" aria-hidden="true">${symbol(id)}</span><span><strong>${name}</strong><small>${desc}</small></span><span class="activity-arrow" aria-hidden="true">↗</span></button>`).join('');
  }
  function library() {
    S().setPage('library');
    document.querySelector('#app').innerHTML=S().heading('YOUR STUDY TOOLKIT','All activities','Choose the kind of practice that works for you.')+`<div class="activity-tabs" role="group" aria-label="Filter activities">${[['study','Study'],['play','Play'],['tools','Tools'],['all','Everything']].map(([id,label])=>`<button data-action="dash-filter" data-filter="${id}" aria-pressed="${filter===id}">${label}</button>`).join('')}</div><div class="activity-list" id="dashboard-modules">${cards()}</div>`;
  }
  function render() {
    const s=S().state,d=S().data,total=d.topics.reduce((n,t)=>n+(s.stats[t.id]?.total||0),0),correct=d.topics.reduce((n,t)=>n+(s.stats[t.id]?.correct||0),0);
    const e=s.extras||{},daily=e.daily?.day===today()?e.daily.n:0,goal=e.goal||30,pct=Math.min(100,daily/goal*100);
    const saved=S().hasSavedPractice(),due=window.Learning?.summary().due||0;
    const name=window.Profiles?.current().name;
    document.querySelector('#app').innerHTML=`<div class="home-heading"><div><span class="eyebrow">MGT 354 · EXAM ${d.exam||2}</span><h1>${name&&name!=='Guest'?'Welcome back, '+esc(name)+'.':'A little practice, a little closer.'}</h1><p>Your next session starts here.</p></div><button class="quiet-link" data-action="progress">View progress ↗</button></div>
      ${window.Plan?.homeHTML?.()||''}<section class="session-feature" aria-label="Start a study session"><div class="session-feature-copy"><span class="feature-label">YOUR NEXT SESSION</span><h2>Make the time<br>you have count.</h2><p>A mix of questions, recall cards, and math, shaped around what you need to practice.</p><div class="duration-control" role="group" aria-label="Choose a session length">${[5,10,20].map(n=>`<button data-action="dash-duration" data-minutes="${n}" aria-pressed="${n===duration}">${n} min</button>`).join('')}</div><div class="feature-actions"><button class="primary" id="start-mission" data-action="learn-start" data-minutes="${duration}">Start session <span aria-hidden="true">→</span></button>${saved?'<button class="feature-resume" data-action="resume-study">Resume saved session ↗</button>':''}</div></div><div class="session-feature-visual" aria-hidden="true"><div class="calm-orbit"></div><img src="assets/bot-helper.png" alt=""><span>ONE QUESTION AT A TIME.</span></div></section>
      <div class="home-status"><div class="daily-inline"><div><span>Today’s goal</span><strong>${daily}<small> / ${goal} answers</small></strong><button data-action="x-goal" aria-label="Change daily answer goal">Edit</button></div><span class="daily-inline-track" role="progressbar" aria-label="Daily answer goal" aria-valuenow="${Math.min(daily,goal)}" aria-valuemin="0" aria-valuemax="${goal}"><i style="width:${pct}%"></i></span></div><button class="status-item" data-action="learn-review"><strong>${due}</strong><span>due for review</span><span aria-hidden="true">↗</span></button><div class="status-item"><strong>${total?Math.round(correct/total*100)+'%':'—'}</strong><span>accuracy</span></div><div class="status-item"><strong>${s.streak||0}</strong><span>in a row</span></div></div>
      <section class="quick-section"><div class="section-heading"><h2>Pick your practice</h2><button class="quiet-link" data-action="mode" data-mode="library">All activities ↗</button></div><div class="quick-grid">${[['quiz','Quick quiz','Ten questions. Instant feedback.','dash-quick'],['math','Math Lab','Work it out, one step at a time.','mode'],['flash','Flashcards','Recall, reveal, and repeat.','mode']].map(([id,title,desc,action])=>`<button class="quick-card" data-action="${action}" data-mode="${id}"><span class="quick-icon" aria-hidden="true">${symbol(id)}</span><strong>${title}</strong><span>${desc}</span><span class="quick-arrow" aria-hidden="true">↗</span></button>`).join('')}</div></section>
      ${window.Fun?.homeHTML?.()||''}${window.Boost?.readinessHTML?.()||''}<section class="topic-section"><div class="section-heading"><h2>Your topics</h2><span class="section-note">Tap a topic to practice</span></div><div class="topic-list">${d.topics.map(t=>{const x=s.stats[t.id]||{correct:0,total:0},rate=x.total?Math.round(x.correct/x.total*100):0;return `<button class="topic-item" data-action="dash-topic" data-topic="${esc(t.id)}"><span class="topic-dot" aria-hidden="true"></span><span class="topic-title">${esc(t.name)}<small>${x.total?x.total+' '+(x.total===1?'attempt':'attempts'):'Not started yet'}</small></span><span class="topic-mini-track" aria-hidden="true"><i style="width:${rate}%"></i></span><span class="topic-rate">${x.total?rate+'%':'—'}</span><span aria-hidden="true">→</span></button>`;}).join('')}</div></section>${window.pendingHTML?.('home')||''}<p class="home-footnote">Progress is saved on this device. <button class="quiet-link" data-action="mode" data-mode="install">Phone & offline ↗</button></p>`;
  }
  document.addEventListener('click', e=>{
    const b=e.target.closest('[data-action^="dash-"]'); if(!b||b.disabled)return;
    const a=b.dataset.action, s=S();
    if(a==='dash-duration'){duration=+b.dataset.minutes;document.querySelectorAll('[data-action="dash-duration"]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));document.querySelector('#start-mission').dataset.minutes=String(duration);return;}
    if(a==='dash-filter') { filter=b.dataset.filter; document.querySelector('#dashboard-modules').innerHTML=cards();document.querySelectorAll('[data-action="dash-filter"]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));return; }
    document.body.classList.remove('nav-open');
    if(a==='dash-quick'||a==='dash-topic') { let pool=window.Learning?window.Learning.choose('mc',10,b.dataset.topic):s.shuffle(s.data.questions.filter(q=>!b.dataset.topic||q.topic===b.dataset.topic));s.startQuizIds(pool.slice(0,10).map(q=>q.id)); }
    if(a==='dash-review') { if(s.startMixedReview)s.startMixedReview(s.state.missed);else {const ids=s.state.missed.filter(id=>s.data.questions.some(q=>q.id===id));if(ids.length)s.startQuizIds(s.shuffle(ids));else s.toast('No missed questions yet. Try a quick quiz to find your focus.');} }
    if(a==='dash-cards')s.startFlashList(s.shuffle(s.data.flashcards.filter(c=>s.state.cards[c.id]==='again')));
  });
  window.Dashboard={render,library};
})();
