const DATA=window.POOL_DATA;
const state={scores:{},lastUpdated:null};
const $=id=>document.getElementById(id);
const norm=s=>s.toUpperCase().replace(/[^A-Z0-9]/g,'');
const favoriteOf=g=>g.favorite;
const gameById=Object.fromEntries(DATA.games.map(g=>[g.id,g]));
const aliases={
  'MIDD TENN':'MIDDLE TENNESSEE','EASTERN MICH':'EASTERN MICHIGAN','BOISE ST':'BOISE STATE','NORTH DAKOTA ST':'NORTH DAKOTA STATE','KANSAS ST':'KANSAS STATE','OKLAHOMA ST':'OKLAHOMA STATE','OREGON ST':'OREGON STATE','ARIZONA ST':'ARIZONA STATE','GEORGIA ST':'GEORGIA STATE','WASHINGTON ST':'WASHINGTON STATE','UTAH ST':'UTAH STATE','TEXAS ST':'TEXAS STATE','APP ST':'APPALACHIAN STATE','SOUTH FLORIDA':'SOUTH FLORIDA','FLORIDA ATLANTIC':'FLORIDA ATLANTIC','SAM HOUSTON':'SAM HOUSTON','OLD DOMINION':'OLD DOMINION','UCF':'UCF','UTSA':'UTSA','UL-MONROE':'UL MONROE','SAN DIEGO ST':'SAN DIEGO STATE','FRESNO ST':'FRESNO STATE','BOSTON COLLEGE':'BOSTON COLLEGE'
};
function teamMatches(line,espn){
  const a=norm(line), b=norm(espn);
  const aa=norm(aliases[line]||line);
  return a===b || aa===b || b.includes(a) || b.includes(aa) || a.includes(b);
}
function classifyPick(p,g){
  const sc=state.scores[g.id];
  if(!sc || sc.status==='scheduled') return 'pending';
  if(sc.status==='in') return 'live';
  if(sc.status!=='final') return 'pending';
  const away=sc.awayScore, home=sc.homeScore;
  if(p.kind==='total'){
    const total=away+home;
    if(total===g.total) return 'loss';
    return p.direction==='over' ? (total>g.total?'win':'loss') : (total<g.total?'win':'loss');
  }
  const favorite=norm(favoriteOf(g));
  const pickIsFavorite=norm(p.team)===favorite;
  const favoriteMargin=norm(g.home)===favorite ? home-away : away-home;
  if(pickIsFavorite) return favoriteMargin===g.spread?'loss':(favoriteMargin>g.spread?'win':'loss');
  const underdogMargin=-favoriteMargin;
  return underdogMargin===-g.spread?'loss':(underdogMargin+g.spread>0?'win':'loss');
}
function bonusStatus(e){
  const p=e.bonus,g=gameById[p.gameId],sc=state.scores[g.id];
  if(!sc||sc.status==='scheduled') return 'pending';
  if(sc.status==='in') return 'live';
  if(sc.status!=='final') return 'pending';
  const awayPick=norm(p.team)===norm(g.away);
  const picked=awayPick?sc.awayScore:sc.homeScore;
  const other=awayPick?sc.homeScore:sc.awayScore;
  return picked>other?'alive':'eliminated';
}
function record(e){
  const r=e.picks.map(p=>classifyPick(p,gameById[p.gameId]));
  return {r,w:r.filter(x=>x==='win').length,l:r.filter(x=>x==='loss').length,live:r.filter(x=>x==='live').length,pending:r.filter(x=>x==='pending').length};
}
function sortEntries(arr){return arr.sort((a,b)=>{const ra=record(a),rb=record(b); if(rb.w!==ra.w)return rb.w-ra.w; if(ra.l!==rb.l)return ra.l-rb.l; if(rb.live!==ra.live)return rb.live-ra.live; return a.id-b.id;});}
function render(){renderLeaderboard();renderBonus();renderGames();renderDistribution();updateHero();}
function renderLeaderboard(){
  const q=$('search').value.toLowerCase(); const f=$('statusFilter').value;
  let arr=sortEntries([...DATA.entries]).filter(e=>e.name.toLowerCase().includes(q));
  if(f!=='all') arr=arr.filter(e=>{const r=record(e);return f==='live'?r.live>0:f==='done'?r.pending===0:f==='pending'?r.pending>0:false});
  const list=$('leaderboardList');
  list.innerHTML=arr.map((e,i)=>{const r=record(e);const cls=r.live?'live':r.w?'win':'';return `<div class="entry-row" data-entry="${e.id}"><div class="rank ${i<3?'top':''}">${i+1}</div><div><div class="entry-name">${esc(e.name)}</div><div class="entry-meta">${r.pending} remaining${e.autoPick?' · commissioner auto-pick':''}</div></div><div class="record ${cls}">${r.w}-${r.l}<small>${r.live?`${r.live} live`:r.pending?`${r.pending} pending`:'complete'}</small></div></div>`}).join('')||'<div class="empty">No entries found.</div>';
  list.querySelectorAll('[data-entry]').forEach(x=>x.onclick=()=>openEntry(+x.dataset.entry));
}
function renderBonus(){
  const arr=DATA.entries.map(e=>({e,s:bonusStatus(e)})).sort((a,b)=>{const order={alive:0,live:1,pending:2,eliminated:3};return order[a.s]-order[b.s]||a.e.id-b.e.id});
  const alive=arr.filter(x=>x.s!=='eliminated').length; $('bonusAlive').textContent=`${alive} alive`;
  $('bonusList').innerHTML=arr.map(({e,s})=>`<div class="bonus-row"><div><div class="bonus-name">${esc(e.name)}</div><div class="bonus-pick">${esc(e.bonus.team)}${e.autoPick?' · auto-pick':''}</div></div><div class="${s==='eliminated'?'eliminated':s==='alive'?'alive':''}">${s==='eliminated'?'OUT':s==='alive'?'ALIVE':s.toUpperCase()}</div></div>`).join('');
}

function renderDistribution(){
  const mode=document.querySelector('.dist-switch.active')?.dataset.dist||'spread';
  const counts=new Map();
  let total=0;
  if(mode==='bonus'){
    for(const e of DATA.entries){const team=e.bonus.team;counts.set(team,(counts.get(team)||0)+1);total++;}
  }else if(mode==='totals'){
    for(const e of DATA.entries){for(const p of e.picks){if(p.kind!=='total')continue;const label=`${p.direction==='over'?'Over':'Under'} ${gameById[p.gameId].total}`;counts.set(label,(counts.get(label)||0)+1);total++;}}
  }else{
    for(const e of DATA.entries){for(const p of e.picks){if(p.kind!=='spread')continue;counts.set(p.team,(counts.get(p.team)||0)+1);total++;}}
  }
  const sorted=[...counts.entries()].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0]));
  const summary=$('distributionSummary');
  const label=mode==='bonus'?'Bonus picks':mode==='totals'?'Total picks':'Spread picks';
  summary.innerHTML=`<div><strong>${total}</strong><span>${label}</span></div><div><strong>${sorted.length}</strong><span>different selections</span></div><div><strong>${sorted[0]?.[1]||0}</strong><span>most popular</span></div>`;
  $('distributionList').innerHTML=sorted.map(([name,count],i)=>{const pct=total?count/total*100:0;return `<div class="distribution-row"><div class="distribution-rank">${i+1}</div><div class="distribution-main"><div class="distribution-name">${esc(name)}</div><div class="distribution-bar"><span style="width:${Math.max(pct,1)}%"></span></div></div><div class="distribution-count"><strong>${count}</strong><small>${pct.toFixed(1)}%</small></div></div>`}).join('')||'<div class="empty">No distribution data.</div>';
}
function renderGames(){
  const sf=$('sportFilter').value, gf=$('gameFilter').value;
  const games=DATA.games.filter(g=>sf==='all'||g.sport===sf).filter(g=>{const s=gameStatus(g);return gf==='all'||(gf==='live'&&s==='in')||(gf==='final'&&s==='final')||(gf==='upcoming'&&s==='scheduled')});
  $('gameList').innerHTML=games.map(g=>{const sc=state.scores[g.id]||{status:'scheduled'};return `<div class="game-row"><div class="game-top"><div><div class="game-status ${sc.status||''}">${sc.status==='in'?'LIVE':sc.status==='final'?'FINAL':formatDate(g.date)}</div><div class="game-teams">${esc(g.away)} @ ${esc(g.home)}</div></div><div class="game-score">${sc.awayScore!=null?`${sc.awayScore} - ${sc.homeScore}`:'-'}</div></div><div class="game-line">Official: ${esc(favoriteOf(g))} -${g.spread} · Total ${g.total}</div></div>`}).join('');
}
function gameStatus(g){const s=state.scores[g.id];return s?.status||'scheduled'}
function updateHero(){const rs=DATA.entries.map(record);$('fourZeroCount').textContent=rs.filter(r=>r.w===4&&r.l===0).length;$('gamesDone').textContent=`${Object.values(state.scores).filter((x,i,a)=>x.status==='final'&&a.findIndex(y=>y===x)===i).length}/65`;}
function openEntry(id){const e=DATA.entries.find(x=>x.id===id);const r=record(e);$('modalContent').innerHTML=`<div class="detail-header"><h2>${esc(e.name)}</h2><div class="detail-record">${r.w}-${r.l} <span class="muted">${r.pending} pending</span></div><div class="entry-meta">Entry ${e.id}${e.autoPick?' · Commissioner auto-pick':''}</div></div>${e.picks.map((p,i)=>{const g=gameById[p.gameId],res=classifyPick(p,g),sc=state.scores[g.id];return `<div class="pick-detail"><div><div class="pick-main">${esc(p.raw)}${e.autoPick?'<span class="auto-badge">AUTO</span>':''}</div><div class="pick-sub">${esc(g.away)} @ ${esc(g.home)} · ${p.kind==='total'?(p.direction==='over'?'Over':'Under')+' '+g.total:(norm(p.team)===norm(favoriteOf(g))?`${p.team} -${g.spread}`:`${p.team} +${g.spread}`)}</div>${sc&&sc.awayScore!=null?`<div class="pick-sub">Score: ${sc.awayScore}-${sc.homeScore}</div>`:''}</div><div class="result-${res}">${res==='win'?'WIN':res==='loss'?'LOSS':res==='live'?'LIVE':'PENDING'}</div></div>`}).join('')}<div class="pick-detail"><div><div class="pick-main">Bonus: ${esc(e.bonus.team)}</div><div class="pick-sub">Outright win required · max favorite ${DATA.bonusMax}</div></div><div class="${bonusStatus(e)==='eliminated'?'result-loss':bonusStatus(e)==='alive'?'result-win':'result-pending'}">${bonusStatus(e).toUpperCase()}</div></div>`; $('entryModal').classList.remove('hidden');}
function esc(s){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function formatDate(d){return new Date(d+'T12:00:00').toLocaleDateString(undefined,{weekday:'short',month:'short',day:'numeric'})}
async function refreshScores(){
  setFeed('Fetching live scores…','');
  try{
    const dates='20260909-20260914';
    const urls=[`https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?dates=${dates}&limit=500`,`https://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard?dates=${dates}&limit=1000`];
    const payloads=await Promise.all(urls.map(u=>fetch(u,{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error('score feed HTTP '+r.status);return r.json()})));
    const found={};
    for(const data of payloads){for(const ev of data.events||[]){const comp=ev.competitions?.[0];if(!comp)continue;const teams=comp.competitors||[];if(teams.length<2)continue;const home=teams.find(t=>t.homeAway==='home'),away=teams.find(t=>t.homeAway==='away');if(!home||!away)continue;const matches=DATA.games.filter(g=>teamMatches(g.away,away.team?.displayName||away.team?.shortDisplayName||'')&&teamMatches(g.home,home.team?.displayName||home.team?.shortDisplayName||''));for(const g of matches){const status=ev.status?.type?.state==='post'?'final':ev.status?.type?.state==='in'?'in':'scheduled';found[g.id]={status,awayScore:Number(away.score||0),homeScore:Number(home.score||0),clock:ev.status?.type?.shortDetail||ev.status?.displayClock||''};}}}
    state.scores=found;state.lastUpdated=new Date();setFeed(`Live feed connected · ${Object.keys(found).length} games matched`,'ok');render();
  }catch(err){console.error(err);setFeed('Live feed unavailable — will retry automatically','bad');render();}
}
function setFeed(t,cls){$('feedStatus').textContent=t;$('feedIndicator').className='status-dot '+cls}

document.querySelectorAll('.tab').forEach(t=>t.onclick=()=>{document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));document.querySelectorAll('.panel').forEach(x=>x.classList.remove('active-panel'));t.classList.add('active');$(t.dataset.tab).classList.add('active-panel')});
$('search').oninput=renderLeaderboard;$('statusFilter').onchange=renderLeaderboard;$('sportFilter').onchange=renderGames;$('gameFilter').onchange=renderGames;document.querySelectorAll('.dist-switch').forEach(b=>b.onclick=()=>{document.querySelectorAll('.dist-switch').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderDistribution();});$('refreshBtn').onclick=refreshScores;document.querySelectorAll('[data-close]').forEach(x=>x.onclick=()=>$('entryModal').classList.add('hidden'));document.querySelectorAll('[data-close-test]').forEach(x=>x.onclick=()=>$('testModal').classList.add('hidden'));
render();refreshScores();setInterval(refreshScores,30000);
