/* Pure scheduling rules. No course facts, storage, or DOM dependencies. */
(function(global){
 'use strict';
 const DAY=86400000, MIN=60000;
 const day=t=>{const d=new Date(t);return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;};
 function update(previous, result, now=Date.now()) {
  const p=previous||{}, confident=result.correct&&result.confidence!=='unsure'&&!result.assisted;
  const days=confident&&Array.isArray(p.days)?p.days.slice(-10):[];
  if(confident&&!days.includes(day(now)))days.push(day(now));
  const success=confident?(p.success||0)+1:0;
  const interval=confident?[DAY,3*DAY,7*DAY,14*DAY,30*DAY][Math.min(Math.max(days.length-1,0),4)]:10*MIN;
  return {...p,id:result.id,kind:result.kind,topic:result.topic,attempts:(p.attempts||0)+1,correct:(p.correct||0)+Number(result.correct),lapses:(p.lapses||0)+Number(!result.correct),success,days,last:now,due:now+interval,interval,lastCorrect:!!result.correct,confidence:result.confidence||'confident',assisted:!!result.assisted};
 }
 function status(item,now=Date.now()) {if(!item)return 'new';if(item.due<=now)return 'due';if(item.success>=3&&item.days?.length>=3)return 'secure';return 'learning';}
 function priority(item,missed,now=Date.now()){if(item?.due<=now)return 0;if(missed)return 1;if(!item)return 2;if(item.confidence==='unsure'||item.assisted||!item.lastCorrect)return 3;return 4;}
 function select(pool,records,count,{now=Date.now(),missed=[],shuffle=a=>[...a]}={}) {
  const misses=new Set(missed);
  return shuffle(pool).map((item,i)=>({item,i,rank:priority(records[item.id],misses.has(item.id),now)})).sort((a,b)=>a.rank-b.rank||a.i-b.i).slice(0,count).map(x=>x.item);
 }
 global.LearningModel={DAY,MIN,update,status,priority,select};
})(typeof window==='undefined'?globalThis:window);
