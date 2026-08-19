(function(){
const SERVERS=[
  {id:'1539017547687657562',name:'Your Server',icon:'SX',members:0,owner:true,online:true}
];
let events=[
  {t:ts(-4),type:'BOT_KICK',sev:'HIGH',msg:'Unauthorized bot removed'},
  {t:ts(-18),type:'RAID',sev:'CRITICAL',msg:'Join spike → lockdown'},
  {t:ts(-42),type:'INVITE',sev:'MOD',msg:'Invite deleted · timeout'},
  {t:ts(-95),type:'NUKE',sev:'CRITICAL',msg:'Channel mass-delete blocked'},
  {t:ts(-140),type:'VERIFY',sev:'LOW',msg:'OAuth passed'}
];
const mods={
  antinuke:true,antiraid:true,antispam:true,antibot:true,antiping:true,
  verification:true,recovery:true,antiinvite:true,antiwebhook:true,antieveryone:true,
  channelcreate:true,rolecreate:true
};
const thresholds={
  nukeActions:3,nukeWindowMs:10000,channelDeleteLimit:3,roleDeleteLimit:3,
  channelCreateLimit:5,roleCreateLimit:5,
  raidJoins:20,raidWindowMs:30000,lockdownDurationMs:900000,
  pingMentions:3,pingWindowMs:10000,everyoneMentions:1,
  spamMessages:5,spamWindowMs:6000,spamSameText:3,spamEmojiLimit:15,
  inviteTimeoutMs:86400000,minAccountAgeDays:1,maxRiskScore:70,
  webhookCreateLimit:2,webhookWindowMs:60000
};
const punishments={
  nuke:'BAN',raid:'LOCKDOWN',antibot:'KICK',antiping:'TIMEOUT',antispam:'TIMEOUT',
  antiinvite:'TIMEOUT',antiwebhook:'BAN',antieveryone:'TIMEOUT',
  timeoutMs:600000,spamTimeoutMs:600000,pingTimeoutMs:1800000,inviteTimeoutMs:86400000
};
let user=null,server=null,tab='overview';

function ts(m){return new Date(Date.now()+m*60000).toTimeString().slice(0,5)}
function $(id){return document.getElementById(id)}
function show(v){['landing','select','app'].forEach(x=>{const e=$(x);if(e)e.classList.toggle('hidden',x!==v)})}
function toast(m){const t=$('toast');t.textContent=m;t.classList.add('show');clearTimeout(toast._x);toast._x=setTimeout(()=>t.classList.remove('show'),2200)}
function save(){
  if(user)localStorage.setItem('sx_user',JSON.stringify(user));else localStorage.removeItem('sx_user');
  if(server)localStorage.setItem('sx_server',JSON.stringify(server));else localStorage.removeItem('sx_server');
  localStorage.setItem('sx_mods',JSON.stringify(mods));
  localStorage.setItem('sx_thr',JSON.stringify(thresholds));
  localStorage.setItem('sx_pun',JSON.stringify(punishments));
}
function tagClass(s){if(s==='CRITICAL'||s==='HIGH')return 'tag-bad';if(s==='MOD')return 'tag-warn';if(s==='LOW')return 'tag-ok';return 'tag-info'}
const feedTypes=[
  {type:'BOT_KICK',sev:'HIGH',msg:'Bot kicked'},
  {type:'RAID',sev:'CRITICAL',msg:'Raid mitigated'},
  {type:'SPAM',sev:'MOD',msg:'Spam timeout'},
  {type:'PING',sev:'HIGH',msg:'Mass mention blocked'},
  {type:'NUKE',sev:'CRITICAL',msg:'Nuke blocked'}
];
function renderFeed(){
  const box=$('live-feed');if(!box)return;let h='';
  for(let i=0;i<5;i++){const f=feedTypes[(Math.floor(Date.now()/7000)+i)%feedTypes.length];
    h+='<div class="live-line"><span class="tag '+tagClass(f.sev)+'">'+f.type+'</span><span style="color:var(--dim);flex:1">'+f.msg+'</span><span class="mono" style="font-size:10px;color:var(--faint)">'+ts(-i*2)+'</span></div>'}
  box.innerHTML=h;
}
function renderBars(){
  const box=$('hour-bars');if(!box)return;
  const vals=Array.from({length:12},()=>4+Math.floor(Math.random()*48));const max=Math.max(...vals,1);
  box.innerHTML=vals.map((v,i)=>'<i class="'+(i>8?'on':'')+'" style="height:'+Math.round(v/max*100)+'%"></i>').join('');
}
function tickLanding(){
  renderFeed();renderBars();
  if($('live-servers'))$('live-servers').textContent='1';
  if($('live-blocked'))$('live-blocked').textContent='—';
  if($('m-bots'))$('m-bots').textContent='—';
  if($('m-raids'))$('m-raids').textContent='—';
  if($('m-nukes'))$('m-nukes').textContent='—';
  if($('m-verify'))$('m-verify').textContent='—';
}
function openAuth(){$('auth-modal').classList.remove('hidden');$('auth-err').textContent='';setTimeout(()=>$('auth-name').focus(),40)}
function closeAuth(){$('auth-modal').classList.add('hidden')}
function completeLogin(name,id){user={name:name||'Operator',id:id||String(Date.now()).slice(-17)};save();closeAuth();renderSelect();show('select');toast('Signed in as '+user.name)}
function doLogout(){user=null;server=null;save();show('landing');toast('Signed out')}
function renderSelect(){
  const list=$('server-list');
  list.innerHTML=SERVERS.map(s=>'<button class="server" type="button" data-id="'+s.id+'"><div class="si">'+s.icon+'</div><div style="flex:1"><strong>'+s.name+'</strong><span>ID '+s.id+' · '+(s.online?'bot online':'bot offline')+'</span></div><span class="pill '+(s.owner?'pill-blue':'')+'">'+(s.owner?'Owner':'Admin')+'</span></button>').join('');
  list.querySelectorAll('.server').forEach(b=>b.onclick=()=>openServer(b.dataset.id));
}
function openServer(id){
  server=SERVERS.find(s=>s.id===id)||{id,name:'Guild '+id.slice(-4),icon:'G',members:0,owner:true,online:true};
  save();$('side-icon').textContent=server.icon;$('side-name').textContent=server.name;
  $('side-meta').textContent=server.id;
  $('bot-pill').textContent=server.online?'Bot online':'Bot offline';show('app');setTab('overview');toast('Loaded '+server.name);
}
function closeMenu(){$('side').classList.remove('open');$('scrim').classList.remove('on')}
function setTab(t){
  tab=t;closeMenu();
  document.querySelectorAll('.nav-btn').forEach(el=>el.classList.toggle('active',el.dataset.tab===t));
  document.querySelectorAll('.mnav button').forEach(el=>el.classList.toggle('active',el.dataset.mtab===t));
  const titles={
    overview:['Overview','Protection snapshot'],status:['Status','System health'],
    modules:['Modules','Enable or disable layers'],thresholds:['Thresholds','Limits for every detector'],
    punishments:['Punishments','Actions on trigger'],logs:['Logs','Recent events'],
    settings:['Settings','Server & access'],reports:['Reports','Flag threats']
  };
  const x=titles[t]||['Security X',''];$('page-title').textContent=x[0];$('page-sub').textContent=x[1];renderPanel();
}
function toggleMod(k){mods[k]=!mods[k];save();renderPanel();toast((mods[k]?'On: ':'Off: ')+k)}
function setThr(k,v){const n=Number(v);if(Number.isFinite(n)){thresholds[k]=n;save();toast('Updated '+k)}}
function setPun(k,v){punishments[k]=v;save();toast('Updated '+k)}

function cfgNum(label,hint,key){
  return '<div class="cfg-row"><div><label>'+label+'</label><span class="hint">'+hint+'</span></div>'+
    '<input type="number" data-thr="'+key+'" value="'+thresholds[key]+'"/></div>';
}
function cfgSel(label,hint,key,opts){
  return '<div class="cfg-row"><div><label>'+label+'</label><span class="hint">'+hint+'</span></div>'+
    '<select data-pun="'+key+'">'+opts.map(o=>'<option value="'+o+'"'+(punishments[key]===o?' selected':'')+'>'+o+'</option>').join('')+'</select></div>';
}

function renderPanel(){
  const c=$('panel');
  if(tab==='overview'){
    const on=Object.values(mods).filter(Boolean).length;
    c.innerHTML='<div class="grid g4" style="margin-bottom:12px">'+
      '<div class="card"><h3>Modules on</h3><div class="big">'+on+'/'+Object.keys(mods).length+'</div></div>'+
      '<div class="card"><h3>Guild</h3><div class="big" style="font-size:14px;word-break:break-all">'+server.id+'</div></div>'+
      '<div class="card"><h3>Bot</h3><div class="big" style="font-size:18px">Online</div></div>'+
      '<div class="card"><h3>Access</h3><div class="big" style="font-size:18px">Owner</div></div></div>'+
      '<div class="grid g2"><div class="card"><h3>Active layers</h3>'+
      Object.entries(mods).map(e=>'<div class="row"><span>'+e[0]+'</span><span class="tag '+(e[1]?'tag-ok':'tag-bad')+'">'+(e[1]?'ON':'OFF')+'</span></div>').join('')+
      '</div><div class="card"><h3>Recent</h3><table><thead><tr><th>Time</th><th>Type</th><th>Detail</th></tr></thead><tbody>'+
      events.map(e=>'<tr><td class="mono">'+e.t+'</td><td><span class="tag '+tagClass(e.sev)+'">'+e.type+'</span></td><td>'+e.msg+'</td></tr>').join('')+
      '</tbody></table></div></div>';
  }
  else if(tab==='status'){
    c.innerHTML='<div class="grid g3">'+
      '<div class="card"><h3>Bot</h3><span class="tag tag-ok">ONLINE</span></div>'+
      '<div class="card"><h3>Database</h3><span class="tag tag-ok">HEALTHY</span></div>'+
      '<div class="card"><h3>OAuth</h3><span class="tag tag-ok">READY</span></div></div>';
  }
  else if(tab==='modules'){
    c.innerHTML='<div class="card">'+Object.keys(mods).map(k=>
      '<div class="row"><div><strong style="text-transform:capitalize">'+k+'</strong>'+
      '<div style="font-size:11px;color:var(--faint)">Toggle protection layer</div></div>'+
      '<button type="button" class="sw '+(mods[k]?'on':'')+'" data-mod="'+k+'"></button></div>'
    ).join('')+'</div>';
    c.querySelectorAll('.sw').forEach(b=>b.onclick=()=>toggleMod(b.dataset.mod));
  }
  else if(tab==='thresholds'){
    c.innerHTML=
      '<div class="card" style="margin-bottom:12px"><h3>Anti-nuke</h3>'+
      cfgNum('Actions to trigger','Deletes/creates before punishment','nukeActions')+
      cfgNum('Window (ms)','Time window for counting actions','nukeWindowMs')+
      cfgNum('Channel delete limit','Max channel deletes in window','channelDeleteLimit')+
      cfgNum('Role delete limit','Max role deletes in window','roleDeleteLimit')+
      '</div><div class="card" style="margin-bottom:12px"><h3>Anti-raid</h3>'+
      cfgNum('Join count','Joins needed to trigger raid mode','raidJoins')+
      cfgNum('Join window (ms)','Time window for join count','raidWindowMs')+
      cfgNum('Lockdown duration (ms)','How long lockdown lasts','lockdownDurationMs')+
      '</div><div class="card" style="margin-bottom:12px"><h3>Mentions & ping</h3>'+
      cfgNum('Max mentions','User mentions before action','pingMentions')+
      cfgNum('Mention window (ms)','Window for mention count','pingWindowMs')+
      cfgNum('@everyone limit','@everyone/@here before action','everyoneMentions')+
      '</div><div class="card" style="margin-bottom:12px"><h3>Spam</h3>'+
      cfgNum('Max messages','Messages in window before action','spamMessages')+
      cfgNum('Spam window (ms)','Time window for message count','spamWindowMs')+
      cfgNum('Same text repeats','Identical messages before action','spamSameText')+
      cfgNum('Emoji limit','Max emoji in one message','spamEmojiLimit')+
      '</div><div class="card"><h3>Verify · invites · webhooks</h3>'+
      cfgNum('Invite timeout (ms)','Timeout after posting invite','inviteTimeoutMs')+
      cfgNum('Min account age (days)','New accounts below this are flagged','minAccountAgeDays')+
      cfgNum('Max risk score','OAuth risk score cutoff','maxRiskScore')+
      cfgNum('Webhook create limit','Webhooks created before action','webhookCreateLimit')+
      '</div>';
    c.querySelectorAll('[data-thr]').forEach(inp=>{inp.onchange=()=>setThr(inp.dataset.thr,inp.value);inp.onblur=()=>setThr(inp.dataset.thr,inp.value);});
  }
  else if(tab==='punishments'){
    const acts=['KICK','BAN','TIMEOUT','LOCKDOWN','NONE'];
    c.innerHTML=
      '<div class="card" style="margin-bottom:12px"><h3>On trigger</h3>'+
      cfgSel('Nuke','Action when nuke threshold hit','nuke',acts)+
      cfgSel('Raid','Action when raid detected','raid',acts)+
      cfgSel('Unauthorized bot','Action on unknown bot join','antibot',acts)+
      cfgSel('Mass mention','Action on ping abuse','antiping',acts)+
      cfgSel('Spam','Action on spam','antispam',acts)+
      cfgSel('Invite','Action on invite post','antiinvite',acts)+
      '</div><div class="card"><h3>Timeout lengths (ms)</h3>'+
      cfgNum('Default timeout','General timeout duration','timeoutMs')+
      cfgNum('Spam timeout','Timeout for spam hits','spamTimeoutMs')+
      cfgNum('Ping timeout','Timeout for mention abuse','pingTimeoutMs')+
      cfgNum('Invite timeout','Timeout for invite posts','inviteTimeoutMs')+
      '</div>';
    c.querySelectorAll('[data-thr]').forEach(inp=>{inp.onchange=()=>{const k=inp.dataset.thr;const n=Number(inp.value);if(Number.isFinite(n)){punishments[k]=n;save();toast('Updated '+k)}}});
    c.querySelectorAll('[data-pun]').forEach(sel=>{sel.onchange=()=>setPun(sel.dataset.pun,sel.value);});
  }
  else if(tab==='logs'){
    c.innerHTML='<div class="card" style="margin-bottom:12px;display:flex;gap:8px"><button class="btn btn-ghost btn-sm" type="button" id="btn-refresh-logs">Refresh</button><button class="btn btn-ghost btn-sm" type="button" id="btn-clear-logs">Clear</button></div><div class="card"><table><thead><tr><th>Time</th><th>Sev</th><th>Type</th><th>Message</th></tr></thead><tbody>'+events.map(e=>'<tr><td class="mono">'+e.t+'</td><td>'+e.sev+'</td><td>'+e.type+'</td><td>'+e.msg+'</td></tr>').join('')+'</tbody></table></div>';
    $('btn-refresh-logs').onclick=()=>{events.unshift({t:ts(0),type:'SCAN',sev:'LOW',msg:'Manual refresh'});renderPanel();toast('Refreshed')};
    $('btn-clear-logs').onclick=()=>{events=[];renderPanel();toast('Cleared')};
  }
  else if(tab==='settings'){
    c.innerHTML='<div class="card"><div class="row"><span>Guild ID</span><code class="mono" style="font-size:12px;color:var(--dim)">'+server.id+'</code></div><div class="row"><span>Access</span><span class="pill pill-blue">Owner</span></div><div class="row"><span>Signed in</span><span>'+(user&&user.name?user.name:'—')+'</span></div></div><div class="card" style="margin-top:12px"><h3>Quick actions</h3><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px"><button class="btn btn-ghost btn-sm" type="button" id="act-snapshot">Save baseline</button><button class="btn btn-primary btn-sm" type="button" id="act-setup">Run setup</button></div></div>';
    $('act-snapshot').onclick=()=>toast('Baseline saved (demo)');
    $('act-setup').onclick=()=>toast('Use /security setup in Discord');
  }
  else if(tab==='reports'){
    c.innerHTML='<div class="card"><h3 style="color:var(--text);text-transform:none;letter-spacing:0;font-size:13px;margin-bottom:8px">Submit report</h3><textarea id="report-body" rows="4" style="width:100%;padding:10px;border-radius:8px;border:1px solid var(--line2);background:var(--bg);color:var(--text);margin-bottom:10px"></textarea><button class="btn btn-primary" type="button" id="btn-report">Submit</button></div>';
    $('btn-report').onclick=()=>{if(!$('report-body').value.trim()){toast('Write something');return}$('report-body').value='';toast('Report submitted (demo)')};
  }
}

$('btn-login-top').onclick=openAuth;$('btn-login-main').onclick=openAuth;
$('btn-demo').onclick=()=>completeLogin('Demo User','100000000000000001');
$('auth-cancel').onclick=closeAuth;$('auth-modal').onclick=e=>{if(e.target===$('auth-modal'))closeAuth()};
$('auth-submit').onclick=()=>{const name=$('auth-name').value.trim();const id=$('auth-id').value.trim();
  if(!name){$('auth-err').textContent='Enter a name';return}
  if(id&&!/^\d{17,20}$/.test(id)){$('auth-err').textContent='Invalid ID';return}
  completeLogin(name,id||undefined)};
$('auth-name').onkeydown=e=>{if(e.key==='Enter')$('auth-submit').click()};
$('btn-logout').onclick=doLogout;$('btn-logout-sel').onclick=doLogout;
$('btn-switch').onclick=()=>{server=null;save();renderSelect();show('select')};
$('btn-menu').onclick=()=>{$('side').classList.add('open');$('scrim').classList.add('on')};
$('scrim').onclick=closeMenu;
$('btn-guild').onclick=()=>{const id=$('guild-id').value.trim();if(!/^\d{17,20}$/.test(id)){toast('Invalid guild ID');return}openServer(id)};
document.querySelectorAll('.nav-btn').forEach(b=>b.onclick=()=>setTab(b.dataset.tab));
document.querySelectorAll('.mnav button').forEach(b=>b.onclick=()=>setTab(b.dataset.mtab));
try{
  const sm=JSON.parse(localStorage.getItem('sx_mods')||'null');if(sm)Object.assign(mods,sm);
  const st=JSON.parse(localStorage.getItem('sx_thr')||'null');if(st)Object.assign(thresholds,st);
  const sp=JSON.parse(localStorage.getItem('sx_pun')||'null');if(sp)Object.assign(punishments,sp);
  user=JSON.parse(localStorage.getItem('sx_user')||'null');
  server=JSON.parse(localStorage.getItem('sx_server')||'null');
  if(user&&server)openServer(server.id);else if(user){renderSelect();show('select')}else show('landing');
}catch(e){show('landing')}
tickLanding();setInterval(tickLanding,8000);
})();
