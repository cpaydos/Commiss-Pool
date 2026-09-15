const DATA=window.POOL_DATA;
const staticHistoryScores=Object.assign({},DATA.history?.[1]?.scores||{});
const state={scores:{},historyScores:staticHistoryScores,lastUpdated:null,overallView:'season'};
const PAYOUTS={weekly:2500,half:[['Most Wins',1800],['2nd Place',1370],['3rd Place',1000],['47th Place – Alpha Sort',650],['Last Place',650],['1st Back-to-Back 0’s',650],['Bonus',3250]]};
const $=id=>document.getElementById(id);
const norm=s=>s.toUpperCase().replace(/[^A-Z0-9]/g,'');
const favoriteOf=g=>g.favorite;
const gameById=Object.fromEntries(DATA.games.map(g=>[g.id,g]));
const SEASON={currentWeek:2,firstHalf:[1,2,3,4,5,6,7,8,9],secondHalf:[10,11,12,13,14,15,16,17,18],lockedWeeks:[1]};
const aliases={
  'MIDD TENN':'MIDDLE TENNESSEE','MIAMI (FL)':'MIAMI','SAN JOSE ST':'SAN JOSE STATE','EASTERN MICH':'EASTERN MICHIGAN','BOISE ST':'BOISE STATE','NORTH DAKOTA ST':'NORTH DAKOTA STATE','KANSAS ST':'KANSAS STATE','OKLAHOMA ST':'OKLAHOMA STATE','OREGON ST':'OREGON STATE','ARIZONA ST':'ARIZONA STATE','GEORGIA ST':'GEORGIA STATE','WASHINGTON ST':'WASHINGTON STATE','UTAH ST':'UTAH STATE','TEXAS ST':'TEXAS STATE','APP ST':'APPALACHIAN STATE','SOUTH FLORIDA':'SOUTH FLORIDA','FLORIDA ATLANTIC':'FLORIDA ATLANTIC','SAM HOUSTON':'SAM HOUSTON','OLD DOMINION':'OLD DOMINION','UCF':'UCF','UTSA':'UTSA','UL-MONROE':'UL MONROE','SAN DIEGO ST':'SAN DIEGO STATE','FRESNO ST':'FRESNO STATE','BOSTON COLLEGE':'BOSTON COLLEGE','FIU':'FLORIDA INTERNATIONAL','PITT':'PITTSBURGH','UCONN':'CONNECTICUT','PENN ST':'PENN STATE','MISSISSIPPI ST':'MISSISSIPPI STATE','SACRAMENTO ST':'SACRAMENTO STATE','JACKSONVILLE ST':'JACKSONVILLE STATE','GEORGIA ST':'GEORGIA STATE','FRESNO ST':'FRESNO STATE','HAWAII':'HAWAI’I','NEW MEXICO ST':'NEW MEXICO STATE','UTAH ST':'UTAH STATE','TEXAS ST':'TEXAS STATE','UCF':'CENTRAL FLORIDA','UAB':'UAB','UCF':'UCF','UCLA':'UCLA','USC':'USC'
};
function teamMatches(line,espn){const a=norm(line),b=norm(espn);const aliasKey=Object.keys(aliases).find(k=>norm(k)===a);const alias=aliasKey?aliases[aliasKey]:line;const aa=norm(alias);return a===b||aa===b||b.includes(a)||b.includes(aa)||a.includes(b)||aa.includes(b)}
function classifyPick(p,g,scoreMap=state.scores){
  const sc=scoreMap[g.id];
  if(!sc||sc.status==='scheduled')return 'pending';
  if(sc.status==='in')return 'live';
  if(sc.status!=='final')return 'pending';
  const away=sc.awayScore,home=sc.homeScore;
  if(p.kind==='total'){const total=away+home;if(total===g.total)return 'loss';return p.direction==='over'?(total>g.total?'win':'loss'):(total<g.total?'win':'loss')}
  const favorite=norm(favoriteOf(g)),pickIsFavorite=norm(p.team)===favorite;
  const favoriteMargin=norm(g.home)===favorite?home-away:away-home;
  if(pickIsFavorite)return favoriteMargin===g.spread?'loss':favoriteMargin>g.spread?'win':'loss';
  const underdogMargin=-favoriteMargin;
  return underdogMargin===-g.spread?'loss':underdogMargin+g.spread>0?'win':'loss';
}
function bonusStatus(e,gameMap=gameById,scoreMap=state.scores){if(!e.bonus||!e.bonus.gameId)return 'pending';const p=e.bonus,g=gameMap[p.gameId],sc=g&&scoreMap[g.id];if(!g)return 'pending';if(!sc||sc.status==='scheduled')return 'pending';if(sc.status==='in')return 'live';if(sc.status!=='final')return 'pending';const awayPick=norm(p.team)===norm(g.away),picked=awayPick?sc.awayScore:sc.homeScore,other=awayPick?sc.homeScore:sc.awayScore;return picked>other?'alive':'eliminated'}
function record(e,gameMap=gameById,scoreMap=state.scores){const r=e.picks.map(p=>classifyPick(p,gameMap[p.gameId],scoreMap));return{r,w:r.filter(x=>x==='win').length,l:r.filter(x=>x==='loss').length,live:r.filter(x=>x==='live').length,pending:r.filter(x=>x==='pending').length}}
function sortEntries(arr){return arr.sort((a,b)=>{const ra=record(a),rb=record(b);if(rb.w!==ra.w)return rb.w-ra.w;if(ra.l!==rb.l)return ra.l-rb.l;if(rb.live!==ra.live)return rb.live-ra.live;return a.id-b.id})}
function isFavorite(id){return getFavorites().has(String(id))}
function getFavorites(){try{return new Set(JSON.parse(localStorage.getItem('commissFavorites')||'[]').map(String))}catch{return new Set()}}
function toggleFavorite(id){const f=getFavorites();const key=String(id);f.has(key)?f.delete(key):f.add(key);localStorage.setItem('commissFavorites',JSON.stringify([...f]));render()}
function starButton(e){return `<button class="star-btn ${isFavorite(e.id)?'starred':''}" data-star="${e.id}" aria-label="${isFavorite(e.id)?'Remove':'Add'} ${esc(e.name)} ${isFavorite(e.id)?'from':'to'} favorites">${isFavorite(e.id)?'★':'☆'}</button>`}
function render(){renderLeaderboard();renderOverall();renderBonus();renderGames();renderDistribution();renderPayouts();updateHero()}
function weekRows(week){return historyForWeek(week)||[]}
function weekPayoutRows(week){if(week===SEASON.currentWeek){if(DATA.entries.some(e=>e.picks?.length))return DATA.entries.map(e=>{const r=record(e);return{id:e.id,name:e.name,w:r.w,l:r.l}});return []}return weekRows(week)||[]}
function renderPayouts(){
  $('payoutSummary').innerHTML=`<div class="payout-stat"><strong>${PAYOUTS.weekly.toLocaleString()}</strong><span>Weekly bounty</span></div><div class="payout-stat"><strong>${PAYOUTS.half.reduce((a,x)=>a+x[1],0).toLocaleString()}</strong><span>Half prizes</span></div><div class="payout-stat"><strong>${(PAYOUTS.weekly*18+PAYOUTS.half.reduce((a,x)=>a+x[1],0)*2).toLocaleString()}</strong><span>Listed prizes</span></div>`;
  const sel=$('payoutWeek'); if(sel){const opts=[1,2].map(w=>`<option value="${w}">Week ${w}${SEASON.lockedWeeks.includes(w)?' · Final':''}</option>`).join('');if(sel.innerHTML!==opts)sel.innerHTML=opts}
  const week=Number(sel?.value||1),rows=weekPayoutRows(week),fours=rows.filter(r=>Number(r.w)===4&&Number(r.l)===0);
  if(!rows.length)$('weeklyPayout').innerHTML=`<div class="payout-row"><div><strong>Week ${week} bounty</strong><small>Results will appear once that week's picks are loaded.</small></div><strong>Pending</strong></div>`;
  else if(!fours.length)$('weeklyPayout').innerHTML=`<div class="payout-row"><div><strong>Week ${week} · Final</strong><small>No entries finished 4–0.</small></div><strong>0</strong></div>`;
  else{const share=PAYOUTS.weekly/fours.length;$('weeklyPayout').innerHTML=`<div class="payout-row payout-highlight"><div><strong>Week ${week} · ${fours.length} ${fours.length===1?'winner':'winners'} at 4–0</strong><small>2,500 split equally · ${share.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})} each</small></div><strong>2,500</strong></div>${fours.map(r=>`<div class="payout-row payout-entry" data-entry="${r.id}" data-week="${week}" role="button" tabindex="0"><div><strong>${esc(r.name)}</strong><small>Week ${week} record · Tap to view picks</small></div><strong>${share.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</strong></div>`).join('')}`}
  bindEntryRows($('weeklyPayout'));bindStars($('weeklyPayout'));
  $('weeklyPayout').querySelectorAll('.payout-entry').forEach(row=>row.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();row.click()}});
  $('halfPayouts').innerHTML=PAYOUTS.half.map(([name,amt])=>`<div class="payout-row"><div><strong>${esc(name)}</strong><small>Per half · awarded in Weeks 1–9 and 10–18</small></div><strong>${amt.toLocaleString()}</strong></div>`).join('');
}
function renderLeaderboard(){
  const q=$('search').value.toLowerCase(),f=$('statusFilter').value,favOnly=$('favoriteFilter').checked;
  let arr=sortEntries([...DATA.entries]).filter(e=>e.name.toLowerCase().includes(q));
  if(favOnly)arr=arr.filter(e=>isFavorite(e.id));
  if(f!=='all')arr=arr.filter(e=>{const r=record(e);return f==='live'?r.live>0:f==='done'?r.pending===0:f==='pending'?r.pending>0:false});
  const list=$('leaderboardList');
  list.innerHTML=arr.map((e,i)=>{const r=record(e),cls=r.live?'live':r.w?'win':'';return `<div class="entry-row" data-entry="${e.id}"><div class="rank ${i<3?'top':''}">${i+1}</div><div class="entry-copy">${starButton(e)}<div><div class="entry-name">${esc(e.name)}</div><div class="entry-meta">${r.pending} remaining${e.autoPick?' · commissioner auto-pick':''}</div></div></div><div class="record ${cls}">${r.w}-${r.l}<small>${r.live?`${r.live} live`:r.pending?`${r.pending} pending`:'complete'}</small></div></div>`}).join('')||'<div class="empty">No entries found.</div>';
  bindEntryRows(list);bindStars(list)
}
function historyForWeek(week){
  const h=DATA.history?.[week];
  if(h?.rows)return h.rows;
  if(h?.entries&&h?.games){
    const gm=Object.fromEntries(h.games.map(g=>[g.id,g]));
    const rows=h.entries.map(e=>{const r=record(e,gm,state.historyScores);return{id:e.id,name:e.name,w:r.w,l:r.l,bonus:bonusStatus(e,gm,state.historyScores)}});
    return rows;
  }
  if(week===SEASON.currentWeek)return DATA.entries.map(e=>{const r=record(e);return{id:e.id,name:e.name,w:r.w,l:r.l,bonus:bonusStatus(e)}});
  return null;
}
function cumulativeForRange(startWeek,week){
  const totals=new Map();
  for(let w=startWeek;w<=week;w++){
    const rows=historyForWeek(w);if(!rows)continue;
    for(const row of rows){const t=totals.get(row.id)||{id:row.id,name:row.name,w:0,l:0,bonusWins:0,bonusEliminated:0};t.w+=Number(row.w||0);t.l+=Number(row.l||0);if(row.bonus==='alive'||row.bonus==='win')t.bonusWins++;if(row.bonus==='eliminated'||row.bonus==='loss')t.bonusEliminated++;totals.set(row.id,t)}
  }
  return [...totals.values()];
}
function cumulativeForThrough(week){return cumulativeForRange(1,week)}
function overallRows(view){
  if(view==='season')return cumulativeForThrough(SEASON.currentWeek);
  if(view==='first')return cumulativeForRange(1,Math.min(SEASON.currentWeek,9));
  if(view==='second'){
    if(SEASON.currentWeek<10)return [];
    return cumulativeForRange(10,SEASON.currentWeek);
  }
  const week=Number(view.replace('week',''));return historyForWeek(week)||[];
}
function sortOverall(rows){return rows.sort((a,b)=>{if(b.w!==a.w)return b.w-a.w;if(a.l!==b.l)return a.l-b.l;if((b.bonusWins||0)!==(a.bonusWins||0))return(b.bonusWins||0)-(a.bonusWins||0);return a.id-b.id})}
function renderOverall(){
  const view=$('overallWeek').value||'season';state.overallView=view;const rows=sortOverall(overallRows(view));
  const currentLabel=view==='season'?`Season Total · through Week ${SEASON.currentWeek}`:view==='first'?`First Half · through Week ${Math.min(SEASON.currentWeek,9)}`:view==='second'?`Second Half · through Week ${SEASON.currentWeek}`:`Week ${view.replace('week','')} · ${SEASON.lockedWeeks.includes(Number(view.replace('week','')))?'Final':'Current'}`;
  $('overallContext').textContent=currentLabel;const favOnly=$('overallFavoriteFilter').checked;const filtered=favOnly?rows.filter(r=>isFavorite(r.id)):rows;const weekNum=view.startsWith('week')?Number(view.slice(4)):null;
  $('overallList').innerHTML=filtered.map((r,i)=>`<div class="overall-row" data-entry="${r.id}" data-week="${weekNum||''}"><div class="rank ${i<3?'top':''}">${i+1}</div><div class="overall-copy">${starButton({id:r.id,name:r.name})}<div><div class="entry-name">${esc(r.name)}</div><div class="entry-meta">${r.w+r.l?r.w+'–'+r.l:'No results yet'}${r.bonusWins!=null?` · ${r.bonusWins} bonus alive/win`:''}</div></div></div><div class="overall-record">${r.w}-${r.l}</div></div>`).join('')||'<div class="empty">No entries found.</div>';
  const hist=$('historicalWeekPanel');if(hist)hist.innerHTML=weekNum?renderHistoricalWeek(weekNum):'';bindEntryRows($('overallList'));bindStars($('overallList'))
}
function renderHistoricalWeek(week){
  const h=DATA.history?.[week];if(!h)return '';const games=h.games||[];const finalCount=games.filter(g=>state.historyScores[g.id]?.status==='final').length;const rows=weekRows(week);const fours=rows.filter(r=>r.w===4&&r.l===0);const share=fours.length?PAYOUTS.weekly/fours.length:0;
  const payout=fours.length?`<div class="history-payout-card"><div><strong>${fours.length} ${fours.length===1?'entry':'entries'} went 4–0</strong><small>2,500 weekly bounty · ${share.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})} each</small></div>${fours.map(r=>`<div class="history-payout-row"><span>${esc(r.name)}</span><strong>${share.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</strong></div>`).join('')}</div>`:`<div class="history-payout-card"><strong>Week ${week} weekly bounty</strong><small>${rows.length?'No 4–0 entries':'Results pending'}</small></div>`;
  const gamesHtml=games.map(g=>{const sc=state.historyScores[g.id];return `<div class="game-row historical-game"><div class="game-top"><div><div class="game-status ${sc?.status||'scheduled'}">${sc?.status==='final'?'FINAL':'PENDING'}</div><div class="game-teams">${esc(g.away)} @ ${esc(g.home)}</div></div><div class="game-score">${sc?.awayScore!=null?`${sc.awayScore} - ${sc.homeScore}`:'—'}</div></div><div class="game-line">Official: ${esc(favoriteOf(g))} -${g.spread} · Total ${g.total}</div></div>`}).join('');
  return `<div class="history-section"><div class="section-heading"><div><h3>Week ${week} Results · Final</h3><p>${finalCount}/${games.length} games final</p></div></div>${payout}<div class="history-games">${gamesHtml}</div></div>`;
}
function bindEntryRows(container){container.querySelectorAll('[data-entry]').forEach(x=>x.onclick=ev=>{if(ev.target.closest('[data-star]'))return;openEntry(+x.dataset.entry,x.dataset.week?Number(x.dataset.week):null)})}
function bindStars(container){container.querySelectorAll('[data-star]').forEach(b=>b.onclick=ev=>{ev.stopPropagation();toggleFavorite(+b.dataset.star)})}
function populateOverallSelector(){
  const sel=$('overallWeek');
  const options=[['season','Season Total'],['first','First Half'],...SEASON.firstHalf.map(w=>[`week${w}`,`Week ${w}${SEASON.lockedWeeks.includes(w)?' · Final':''}`]),['second','Second Half'],...SEASON.secondHalf.map(w=>[`week${w}`,`Week ${w}${SEASON.lockedWeeks.includes(w)?' · Final':''}`])];
  sel.innerHTML=options.map(([v,l])=>{const n=v.startsWith('week')?Number(v.slice(4)):0;const available=v==='season'||(v==='first'&&SEASON.currentWeek>=1)||(v==='second'&&SEASON.currentWeek>=10)||(n>0&&n<=SEASON.currentWeek);return `<option value="${v}" ${available?'':'disabled'}>${l}</option>`}).join('');sel.value='season'
}
const FINAL_BONUS_OUT={1:new Set([7,20,30,33,77,90,134])};
function priorBonusStatus(id){if(FINAL_BONUS_OUT[1]?.has(id))return 'eliminated';const rows=historyForWeek(1);return rows?.find(r=>r.id===id)?.bonus||null}
function renderBonus(){
  const week=Number($('bonusWeek')?.value||2);
  $('bonusContext').textContent=week===1?'Week 1 · Final · max favorite 9 points':'Week 2 · Current · max favorite 8 points';
  if(week===1){const h=DATA.history?.[1],gm=h?Object.fromEntries(h.games.map(g=>[g.id,g])):{};const arr=(h?.entries||[]).map(e=>({e,s:FINAL_BONUS_OUT[1]?.has(e.id)?'eliminated':bonusStatus(e,gm,state.historyScores)})).sort((a,b)=>{const order={alive:0,live:1,pending:2,eliminated:3};return order[a.s]-order[b.s]||a.e.id-b.e.id});const alive=arr.filter(x=>x.s==='alive').length;$('bonusAlive').textContent=`${alive} alive`;$('bonusList').innerHTML=arr.map(({e,s})=>`<div class="bonus-row"><div>${starButton(e)}<div class="bonus-copy"><div class="bonus-name">${esc(e.name)}</div><div class="bonus-pick">${esc(e.bonus?.team||'Not loaded')}</div></div></div><div class="${s==='eliminated'?'eliminated':s==='alive'?'alive':''}">${s==='eliminated'?'OUT':s==='alive'?'ALIVE':'PENDING'}</div></div>`).join('')}
  else{const arr=DATA.entries.map(e=>{const prior=priorBonusStatus(e.id);const hasPick=!!e.bonus?.gameId;const s=prior==='eliminated'?'eliminated':hasPick?bonusStatus(e):'pending';return{e,s,prior}}).sort((a,b)=>{const order={alive:0,live:1,pending:2,eliminated:3};return order[a.s]-order[b.s]||a.e.id-b.e.id});const eligible=arr.filter(x=>x.prior!=='eliminated').length;$('bonusAlive').textContent=`${eligible} alive`;$('bonusList').innerHTML=arr.map(({e,s,prior})=>{const sub=prior==='eliminated'?'Out Week 1':e.bonus?.gameId?esc(e.bonus.team):'Not loaded · alive after Week 1';const label=prior==='eliminated'?'OUT':s==='alive'?'ALIVE':s==='live'?'LIVE':'PENDING';return `<div class="bonus-row"><div>${starButton(e)}<div class="bonus-copy"><div class="bonus-name">${esc(e.name)}</div><div class="bonus-pick">${sub}${e.autoPick?' · auto-pick':''}</div></div></div><div class="${label==='OUT'?'eliminated':label==='ALIVE'?'alive':''}">${label}</div></div>`}).join('')}
  bindStars($('bonusList'));
}
function distributionMatches(mode,name){
  const matches=[];
  for(const e of DATA.entries){
    if(mode==='bonus'){
      if(e.bonus.team===name)matches.push(e);
    }else if(mode==='totals'){
      for(const p of e.picks){
        if(p.kind!=='total')continue;
        const g=gameById[p.gameId],label=`${favoriteOf(g)} ${g.total} — ${p.direction==='over'?'Over':'Under'}`;
        if(label===name){matches.push(e);break}
      }
    }else{
      if(e.picks.some(p=>p.kind==='spread'&&p.team===name))matches.push(e);
    }
  }
  return matches;
}
function showDistributionDetail(mode,name,count){
  const entries=distributionMatches(mode,name);
  const modeLabel=mode==='bonus'?'Bonus picks':mode==='totals'?'Total picks':'Spread picks';
  $('modalContent').innerHTML=`<div class="detail-header"><h2>${esc(name)}</h2><div class="detail-record">${count} ${count===1?'entry':'entries'}</div><div class="entry-meta">${modeLabel} · Tap a name to view their picks</div></div>${entries.map(e=>`<div class="distribution-person" data-entry="${e.id}"><div>${starButton(e)}<div><div class="entry-name">${esc(e.name)}</div><div class="entry-meta">Entry ${e.id}</div></div></div><div class="distribution-person-arrow">›</div></div>`).join('')||'<div class="empty">No matching entries.</div>'}`;
  $('entryModal').classList.remove('hidden');
  const list=$('modalContent');
  list.querySelectorAll('.distribution-person').forEach(x=>x.onclick=ev=>{if(ev.target.closest('[data-star]'))return;openEntry(+x.dataset.entry)});
  bindStars(list);
}
function renderDistribution(){
  const mode=document.querySelector('.dist-switch.active')?.dataset.dist||'spread',counts=new Map();let total=0;
  if(mode==='bonus'){for(const e of DATA.entries){const team=e.bonus.team;counts.set(team,(counts.get(team)||0)+1);total++}}
  else if(mode==='totals'){for(const e of DATA.entries)for(const p of e.picks)if(p.kind==='total'){const g=gameById[p.gameId],label=`${favoriteOf(g)} ${g.total} — ${p.direction==='over'?'Over':'Under'}`;counts.set(label,(counts.get(label)||0)+1);total++}}
  else{for(const e of DATA.entries)for(const p of e.picks)if(p.kind==='spread'){counts.set(p.team,(counts.get(p.team)||0)+1);total++}}
  const sorted=[...counts.entries()].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0]));
  const label=mode==='bonus'?'Bonus picks':mode==='totals'?'Total picks':'Spread picks';
  $('distributionSummary').innerHTML=`<div><strong>${total}</strong><span>${label}</span></div><div><strong>${sorted.length}</strong><span>different selections</span></div><div><strong>${sorted[0]?.[1]||0}</strong><span>most popular</span></div>`;
  $('distributionList').innerHTML=sorted.map(([name,count],i)=>{const pct=total?count/total*100:0;return `<div class="distribution-row" data-dist-item="${esc(name)}" data-dist-mode="${mode}" data-dist-count="${count}" role="button" tabindex="0"><div class="distribution-rank">${i+1}</div><div class="distribution-main"><div class="distribution-name">${esc(name)}</div><div class="distribution-bar"><span style="width:${Math.max(pct,1)}%"></span></div></div><div class="distribution-count"><strong>${count}</strong><small>${pct.toFixed(1)}%</small></div></div>`}).join('')||'<div class="empty">No distribution data.</div>';
  document.querySelectorAll('[data-dist-item]').forEach(row=>{const open=()=>showDistributionDetail(row.dataset.distMode,row.dataset.distItem,Number(row.dataset.distCount));row.onclick=open;row.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open()}}});
}
function gameStartTime(g){const sc=state.scores[g.id];return sc?.startTime||g.startTime||null}
function formatGameDateTime(g){const iso=gameStartTime(g);if(!iso)return formatDate(g.date);const d=new Date(iso);return d.toLocaleString('en-US',{timeZone:'America/New_York',weekday:'short',month:'short',day:'numeric',hour:'numeric',minute:'2-digit'}).replace(',', ' ·')+' ET'}
function formatLiveDetail(g){const sc=state.scores[g.id];if(!sc||sc.status!=='in')return null;let period=sc.period?`${sc.period}${sc.period===1?'st':sc.period===2?'nd':sc.period===3?'rd':'th'} Q`:'';let clock=sc.displayClock||sc.clock||'';if(clock){clock=clock.replace(/^.*?\s(?=\d+:\d+$)/,'');}return [period,clock].filter(Boolean).join(' · ')||'LIVE'}
function formatGameTimeDisplay(g){return formatLiveDetail(g)||formatGameDateTime(g)}
function renderGames(){const sf=$('sportFilter').value,gf=$('gameFilter').value,games=DATA.games.filter(g=>sf==='all'||g.sport===sf).filter(g=>{const s=gameStatus(g);return gf==='all'||gf==='live'&&s==='in'||gf==='final'&&s==='final'||gf==='upcoming'&&s==='scheduled'}).sort((a,b)=>(new Date(gameStartTime(a)||a.date))-(new Date(gameStartTime(b)||b.date)));$('gameList').innerHTML=games.map(g=>{const sc=state.scores[g.id]||{status:'scheduled'};const when=formatGameDateTime(g);const liveDetail=formatLiveDetail(g);return `<div class="game-row"><div class="game-top"><div><div class="game-status ${sc.status||''}">${sc.status==='in'?liveDetail||'LIVE':sc.status==='final'?'FINAL':when}</div><div class="game-teams">${esc(g.away)} @ ${esc(g.home)}</div></div><div class="game-score">${sc.awayScore!=null?`${sc.awayScore} - ${sc.homeScore}`:'0 - 0'}</div></div><div class="game-line">Official: ${esc(favoriteOf(g))} -${g.spread} · Total ${g.total}</div></div>`}).join('')}
function gameStatus(g){return state.scores[g.id]?.status||'scheduled'}
function updateHero(){const rs=DATA.entries.map(record);$('fourZeroCount').textContent=rs.filter(r=>r.w===4&&r.l===0).length;const done=new Set(Object.entries(state.scores).filter(([,x])=>x.status==='final').map(([id])=>id));$('gamesDone').textContent=`${done.size}/${DATA.games.length}`}
function openEntry(id,week=null){
  let e,gm,scoreMap,weekBonusMax=DATA.bonusMax;if(week){const h=DATA.history?.[week];e=h?.entries?.find(x=>x.id===id);gm=h?Object.fromEntries(h.games.map(g=>[g.id,g])):{};scoreMap=state.historyScores;weekBonusMax=h?.bonusMax||weekBonusMax}else{e=DATA.entries.find(x=>x.id===id);gm=gameById;scoreMap=state.scores}if(!e)return;const r=record(e,gm,scoreMap),bstat=bonusStatus(e,gm,scoreMap);
  $('modalContent').innerHTML=`<div class="detail-header"><h2>${esc(e.name)}</h2><div class="detail-record">${r.w}-${r.l} <span class="muted">${r.pending} pending</span></div><div class="entry-meta">Entry ${e.id}${week?` · Week ${week} · Final`:''}${e.autoPick?' · Commissioner auto-pick':''}</div></div>${e.picks.map(p=>{const g=gm[p.gameId],res=classifyPick(p,g,scoreMap),sc=scoreMap[g?.id];return `<div class="pick-detail"><div><div class="pick-main">${esc(p.raw)}${e.autoPick?'<span class="auto-badge">AUTO</span>':''}</div><div class="pick-time">${week?formatDate(g.date):formatGameTimeDisplay(g)}</div><div class="pick-sub">${esc(g.away)} @ ${esc(g.home)} · ${p.kind==='total'?(p.direction==='over'?'Over':'Under')+' '+g.total:(norm(p.team)===norm(favoriteOf(g))?`${p.team} -${g.spread}`:`${p.team} +${g.spread}`)}</div>${sc&&sc.awayScore!=null?`<div class="pick-sub">Score: ${sc.awayScore}-${sc.homeScore}</div>`:''}</div><div class="result-${res}">${res==='win'?'WIN':res==='loss'?'LOSS':res==='live'?'LIVE':'PENDING'}</div></div>`}).join('')}<div class="pick-detail"><div><div class="pick-main">Bonus: ${esc(e.bonus?.team||'Not loaded')}</div><div class="pick-sub">Outright win required · max favorite ${weekBonusMax}</div></div><div class="${bstat==='eliminated'?'result-loss':bstat==='alive'?'result-win':'result-pending'}">${bstat.toUpperCase()}</div></div>`;$('entryModal').classList.remove('hidden')}
function esc(s){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function formatDate(d){return new Date(d+'T12:00:00').toLocaleDateString(undefined,{weekday:'short',month:'short',day:'numeric'})}
async function refreshScores(){
  setFeed('Fetching live scores…','');
  try {
    const urls = [
      // Pool Week 2 uses NFL Week 2.
      'https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?season=2026&seasontype=2&week=2&limit=500',

      // Pool Week 2 uses College Football Week 3. Request all FBS games.
      'https://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard?season=2026&seasontype=2&week=3&groups=80&limit=1000'
    ];

    const payloads = await Promise.all(
      urls.map(u => fetch(u,{cache:'no-store'}).then(r => {
        if (!r.ok) throw new Error('score feed HTTP '+r.status);
        return r.json();
      }))
    );

    const foundCurrent = {};

    for (const data of payloads) {
      for (const ev of data.events || []) {
        const comp = ev.competitions?.[0];
        if (!comp) continue;

        const teams = comp.competitors || [];
        if (teams.length < 2) continue;

        const home = teams.find(t => t.homeAway === 'home');
        const away = teams.find(t => t.homeAway === 'away');
        if (!home || !away) continue;

        const awayName = away.team?.displayName || away.team?.shortDisplayName || '';
        const homeName = home.team?.displayName || home.team?.shortDisplayName || '';

        const matches = DATA.games.filter(g =>
          teamMatches(g.away,awayName) &&
          teamMatches(g.home,homeName)
        );

        for (const g of matches) {
          const status =
            ev.status?.type?.state === 'post' ? 'final' :
            ev.status?.type?.state === 'in' ? 'in' :
            'scheduled';

          foundCurrent[g.id] = {
            status,
            awayScore: Number(away.score || 0),
            homeScore: Number(home.score || 0),
            clock: ev.status?.type?.shortDetail || ev.status?.displayClock || '',
            displayClock: ev.status?.displayClock || '',
            period: ev.status?.period || ev.status?.type?.period || null,
            startTime: ev.date || comp.date || null
          };
        }
      }
    }

    // Temporary diagnostics: tell us exactly which pool games still fail to match.
    const unmatched = DATA.games
      .filter(g => !foundCurrent[g.id])
      .map(g => `${g.away} @ ${g.home}`);

    console.log('ESPN Week 2 pool-game matching:', {
      poolGames: DATA.games.length,
      matched: Object.keys(foundCurrent).length,
      unmatched: unmatched.length,
      unmatchedGames: unmatched
    });

    state.scores = foundCurrent;
    state.lastUpdated = new Date();

    setFeed(
      `Live feed connected · ${Object.keys(foundCurrent).length}/${DATA.games.length} Week 2 games matched`,
      'ok'
    );
    render();
  } catch(err) {
    console.error(err);
    setFeed('Live feed unavailable — will retry automatically','bad');
    render();
  }
}
function setFeed(t,cls){$('feedStatus').textContent=t;$('feedIndicator').className='status-dot '+cls}
document.querySelectorAll('.tab').forEach(t=>t.onclick=()=>{document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));document.querySelectorAll('.panel').forEach(x=>x.classList.remove('active-panel'));t.classList.add('active');$(t.dataset.tab).classList.add('active-panel')});
$('search').oninput=renderLeaderboard;$('statusFilter').onchange=renderLeaderboard;$('favoriteFilter').onchange=renderLeaderboard;$('overallWeek').onchange=renderOverall;$('overallFavoriteFilter').onchange=renderOverall;$('bonusWeek')?.addEventListener('change',renderBonus);$('payoutWeek')?.addEventListener('change',renderPayouts);$('sportFilter').onchange=renderGames;$('gameFilter').onchange=renderGames;document.querySelectorAll('.dist-switch').forEach(b=>b.onclick=()=>{document.querySelectorAll('.dist-switch').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderDistribution()});$('refreshBtn').onclick=refreshScores;document.querySelectorAll('[data-close]').forEach(x=>x.onclick=()=>$('entryModal').classList.add('hidden'));
populateOverallSelector();render();refreshScores();setInterval(refreshScores,30000);

// Commiss Pool PWA: register service worker for app-like Home Screen behavior.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
}
