(function(){
  const SERVERS=[
    {id:'112233445566778899',name:'Nightcore HQ',icon:'N',members:12840,owner:true,online:true},
    {id:'223344556677889900',name:'Dev Lab',icon:'D',members:420,owner:true,online:true},
    {id:'334455667788990011',name:'Community EU',icon:'C',members:8900,owner:false,online:false},
  ];
  let events=[
    {t:ts(-4),type:'BOT_KICK',sev:'HIGH',msg:'Unauthorized bot removed · adder logged'},
    {t:ts(-18),type:'RAID',sev:'CRITICAL',msg:'Join spike 48/10s → lockdown 15m'},
    {t:ts(-42),type:'INVITE',sev:'MOD',msg:'Invite deleted · member timed out 24h'},
    {t:ts(-95),type:'NUKE',sev:'CRITICAL',msg:'Mass channel delete blocked · recovery ok'},
    {t:ts(-140),type:'VERIFY',sev:'LOW',msg:'OAuth risk check passed'},
  ];
  const mods={antinuke:true,antiraid:true,antispam:true,antiping:true,antibot:true,verification:true,recovery:true};
  let user=null,server=null,tab='overview';
  function ts(minAgo){const d=new Date(Date.now()+minAgo*60000);return d.toTimeString().slice(0,5)}
  function $(id){return document.getElementById(id)}
  function show(view){['landing','select','app'].forEach(v=>{const el=$(v);if(el)el.classList.toggle('hidden',v!==view)})}
  function toast(msg){const t=$('toast');t.textContent=msg;t.classList.add('show');clearTimeout(toast._x);toast._x=setTimeout(()=>t.classList.remove('show'),2400)}
  function save(){if(user)localStorage.setItem('sx_user',JSON.stringify(user));else localStorage.removeItem('sx_user');if(server)localStorage.setItem('sx_server',JSON.stringify(server));else localStorage.removeItem('sx_server');localStorage.setItem('sx_mods',JSON.stringify(mods))}
  const feedTypes=[{type:'BOT_KICK',sev:'HIGH',msg:'Bot kicked on Nightcore HQ'},{type:'RAID',sev:'CRITICAL',msg:'Raid mitigated · Community EU'},{type:'INVITE',sev:'MOD',msg:'Invite scrubbed · Dev Lab'},{type:'VERIFY',sev:'LOW',msg:'User verified · Nightcore HQ'},{type:'NUKE',sev:'CRITICAL',msg:'Nuke attempt blocked'}];
  function tagClass(sev){if(sev==='CRITICAL'||sev==='HIGH')return 'tag-bad';if(sev==='MOD')return 'tag-warn';if(sev==='LOW')return 'tag-ok';return 'tag-info'}
  function renderFeed(){const box=$('live-feed');if(!box)return;const lines=[];for(let i=0;i<5;i++){const f=feedTypes[(Math.floor(Date.now()/8000)+i)%feedTypes.length];lines.push('<div class="live-line"><span class="tag '+tagClass(f.sev)+'">'+f.type+'</span><span style="color:var(--dim);flex:1">'+f.msg+'</span><span class="mono" style="color:var(--faint);font-size:10px">'+ts(-i*3)+'</span></div>')}box.innerHTML=lines.join('')}
  function renderBars(){const box=$('hour-bars');if(!box)return;const vals=Array.from({length:12},()=>4+Math.floor(Math.random()*48));const max=Math.max(...vals,1);box.innerHTML=vals.map((v,i)=>'<i class="'+(i>8?'on':'')+'" style="height:'+Math.round(v/max*100)+'%"></i>').join('')}
  function tickLanding(){renderFeed();renderBars();$('live-servers').textContent=(1240+Math.floor(Math.random()*20)).toLocaleString();$('live-blocked').textContent=(38+Math.random()).toFixed(1)+'k';$('m-bots').textContent=String(130+Math.floor(Math.random()*30));$('m-raids').textContent=String(6+Math.floor(Math.random()*8));$('m-nukes').textContent=String(1+Math.floor(Math.random()*5));$('m-verify').textContent=String(850+Math.floor(Math.random()*80))}
  function openAuth(){$('auth-modal').classList.remove('hidden');$('auth-err').textContent='';$('auth-name').value=user&&user.name?user.name:'';$('auth-id').value=user&&user.id?user.id:'';setTimeout(function(){$('auth-name').focus()},50)}
  function closeAuth(){$('auth-modal').classList.add('hidden')}
  function completeLogin(name,id){user={name:name||'Operator',id:id||String(Date.now()).slice(-17)};save();closeAuth();renderSelect();show('select');toast('Signed in as '+user.name)}
  function doLogout(){user=null;server=null;save();show('landing');toast('Signed out')}
  function renderSelect(){const list=$('server-list');list.innerHTML=SERVERS.map(function(s){return '<button class="server" type="button" data-id="'+s.id+'"><div class="si">'+s.icon+'</div><div style="flex:1;min-width:0"><strong>'+s.name+'</strong><span>'+s.members.toLocaleString()+' members · '+(s.online?'online':'offline')+'</span></div><span class="pill '+(s.owner?'pill-blue':'')+'">'+(s.owner?'Owner':'Admin')+'</span></button>'}).join('');list.querySelectorAll('.server').forEach(function(btn){btn.addEventListener('click',function(){openServer(btn.getAttribute('data-id'))})})}
  function openServer(id){server=SERVERS.find(function(s){return s.id===id})||{id:id,name:'Guild '+id.slice(-4),icon:'G',members:0,owner:false,online:true};save();$('side-icon').textContent=server.icon;$('side-name').textContent=server.name;$('side-meta').textContent=server.members?server.members.toLocaleString()+' members':'Guild ID';$('bot-pill').textContent=server.online?'Bot online':'Bot offline';show('app');setTab('overview');toast('Loaded '+server.name)}
  function closeMenu(){$('side').classList.remove('open');$('scrim').classList.remove('on')}
  function setTab(t){tab=t;closeMenu();document.querySelectorAll('.nav-btn').forEach(function(el){el.classList.toggle('active',el.dataset.tab===t)});document.querySelectorAll('.mnav button').forEach(function(el){el.classList.toggle('active',el.dataset.mtab===t)});var titles={overview:['Overview','Live protection for this server'],status:['Status','Bot, database and OAuth health'],modules:['Modules','Toggle protection systems'],logs:['Logs','Recent security events'],settings:['Settings','Channels, roles and access'],reports:['Reports','Flag bots, users or servers']};var x=titles[t]||['Security X',''];$('page-title').textContent=x[0];$('page-sub').textContent=x[1];renderPanel()}
  function toggleMod(k){mods[k]=!mods[k];save();renderPanel();toast((mods[k]?'Enabled ':'Disabled ')+k)}
  function renderPanel(){
    var c=$('panel');
    if(tab==='overview'){
      c.innerHTML='<div class="grid g4" style="margin-bottom:12px"><div class="card"><h3>Events 24h</h3><div class="big">47</div></div><div class="card"><h3>Bots removed</h3><div class="big">12</div></div><div class="card"><h3>Raids</h3><div class="big">2</div></div><div class="card"><h3>Recoveries</h3><div class="big">1</div></div></div><div class="grid g2"><div class="card"><h3>Modules</h3>'+Object.entries(mods).map(function(e){return '<div class="row"><span>'+e[0]+'</span><span class="tag '+(e[1]?'tag-ok':'tag-bad')+'">'+(e[1]?'ON':'OFF')+'</span></div>'}).join('')+'</div><div class="card"><h3>Recent activity</h3><table><thead><tr><th>Time</th><th>Type</th><th>Detail</th></tr></thead><tbody>'+events.map(function(e){return '<tr><td class="mono">'+e.t+'</td><td><span class="tag '+tagClass(e.sev)+'">'+e.type+'</span></td><td>'+e.msg+'</td></tr>'}).join('')+'</tbody></table></div></div>';
    } else if(tab==='status'){
      c.innerHTML='<div class="grid g3"><div class="card"><h3>Bot</h3><span class="tag tag-ok">ONLINE</span><p style="margin-top:10px;color:var(--dim);font-size:12px">Latency 42ms · Shard 0</p></div><div class="card"><h3>Database</h3><span class="tag tag-ok">HEALTHY</span><p style="margin-top:10px;color:var(--dim);font-size:12px">SQLite · local</p></div><div class="card"><h3>OAuth</h3><span class="tag tag-ok">READY</span><p style="margin-top:10px;color:var(--dim);font-size:12px">Verify endpoint up</p></div></div>';
    } else if(tab==='modules'){
      c.innerHTML='<div class="card">'+Object.keys(mods).map(function(k){return '<div class="row"><div><strong style="text-transform:capitalize">'+k+'</strong><div style="font-size:12px;color:var(--faint)">Click switch to toggle</div></div><button type="button" class="sw '+(mods[k]?'on':'')+'" data-mod="'+k+'" aria-label="toggle '+k+'"></button></div>'}).join('')+'</div>';
      c.querySelectorAll('.sw').forEach(function(btn){btn.addEventListener('click',function(){toggleMod(btn.getAttribute('data-mod'))})});
    } else if(tab==='logs'){
      c.innerHTML='<div class="card" style="margin-bottom:12px;display:flex;gap:8px;flex-wrap:wrap"><button class="btn btn-ghost btn-sm" type="button" id="btn-refresh-logs">Refresh</button><button class="btn btn-ghost btn-sm" type="button" id="btn-clear-logs">Clear view</button></div><div class="card"><table><thead><tr><th>Time</th><th>Sev</th><th>Type</th><th>Message</th></tr></thead><tbody>'+events.map(function(e){return '<tr><td class="mono">'+e.t+'</td><td>'+e.sev+'</td><td>'+e.type+'</td><td>'+e.msg+'</td></tr>'}).join('')+'</tbody></table></div>';
      var br=$('btn-refresh-logs');if(br)br.addEventListener('click',function(){events.unshift({t:ts(0),type:'SCAN',sev:'LOW',msg:'Manual log refresh'});renderPanel();toast('Logs refreshed')});
      var bc=$('btn-clear-logs');if(bc)bc.addEventListener('click',function(){events=[];renderPanel();toast('Log view cleared')});
    } else if(tab==='settings'){
      c.innerHTML='<div class="card"><div class="row"><span>Guild ID</span><code class="mono" style="font-size:12px;color:var(--dim)">'+server.id+'</code></div><div class="row"><span>Your access</span><span class="pill pill-blue">'+(server.owner?'Owner':'Admin / Staff')+'</span></div><div class="row"><span>Log channel</span><span style="color:var(--dim)">/security setup</span></div><div class="row"><span>Verified role</span><span style="color:var(--dim)">Auto on setup</span></div><div class="row"><span>Signed in as</span><span>'+(user&&user.name?user.name:'—')+'</span></div></div><div class="card" style="margin-top:12px"><h3>Quick actions</h3><div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:8px"><button class="btn btn-ghost btn-sm" type="button" id="act-snapshot">Save baseline</button><button class="btn btn-ghost btn-sm" type="button" id="act-seed">Seed threats</button><button class="btn btn-primary btn-sm" type="button" id="act-setup">Run setup</button></div></div>';
      var a1=$('act-snapshot');if(a1)a1.addEventListener('click',function(){toast('Baseline saved (demo)')});
      var a2=$('act-seed');if(a2)a2.addEventListener('click',function(){toast('Threat seed queued (demo)')});
      var a3=$('act-setup');if(a3)a3.addEventListener('click',function(){toast('Setup triggered (demo) — use /security setup in Discord')});
    } else if(tab==='reports'){
      c.innerHTML='<div class="card"><h3 style="color:var(--text);font-size:13px;text-transform:none;letter-spacing:0;margin-bottom:10px">Submit report</h3><p style="color:var(--dim);font-size:13px;margin-bottom:12px">Bot ID, server invite or evidence. Demo stores locally only.</p><textarea id="report-body" rows="4" placeholder="Details…" style="width:100%;padding:10px 12px;border-radius:8px;border:1px solid var(--line2);background:var(--bg);color:var(--text);resize:vertical;margin-bottom:10px"></textarea><button class="btn btn-primary" type="button" id="btn-report">Submit</button></div>';
      var brp=$('btn-report');if(brp)brp.addEventListener('click',function(){var v=$('report-body').value.trim();if(!v){toast('Write something first');return}$('report-body').value='';toast('Report submitted (demo)')});
    }
  }
  $('btn-login-top').addEventListener('click',openAuth);
  $('btn-login-main').addEventListener('click',openAuth);
  $('btn-demo').addEventListener('click',function(){completeLogin('Demo User','100000000000000001')});
  $('auth-cancel').addEventListener('click',closeAuth);
  $('auth-modal').addEventListener('click',function(e){if(e.target===$('auth-modal'))closeAuth()});
  $('auth-submit').addEventListener('click',function(){var name=$('auth-name').value.trim();var id=$('auth-id').value.trim();if(!name){$('auth-err').textContent='Enter a display name';return}if(id&&!/^\d{17,20}$/.test(id)){$('auth-err').textContent='User ID must be 17–20 digits';return}completeLogin(name,id||undefined)});
  $('auth-name').addEventListener('keydown',function(e){if(e.key==='Enter')$('auth-submit').click()});
  $('btn-logout').addEventListener('click',doLogout);
  $('btn-logout-sel').addEventListener('click',doLogout);
  $('btn-switch').addEventListener('click',function(){server=null;save();renderSelect();show('select')});
  $('btn-menu').addEventListener('click',function(){$('side').classList.add('open');$('scrim').classList.add('on')});
  $('scrim').addEventListener('click',closeMenu);
  $('btn-guild').addEventListener('click',function(){var id=$('guild-id').value.trim();if(!/^\d{17,20}$/.test(id)){toast('Enter a valid guild ID');return}openServer(id)});
  document.querySelectorAll('.nav-btn').forEach(function(btn){btn.addEventListener('click',function(){setTab(btn.dataset.tab)})});
  document.querySelectorAll('.mnav button').forEach(function(btn){btn.addEventListener('click',function(){setTab(btn.dataset.mtab)})});
  try{var savedMods=JSON.parse(localStorage.getItem('sx_mods')||'null');if(savedMods)Object.assign(mods,savedMods);user=JSON.parse(localStorage.getItem('sx_user')||'null');server=JSON.parse(localStorage.getItem('sx_server')||'null');if(user&&server){openServer(server.id)}else if(user){renderSelect();show('select')}else show('landing')}catch(e){show('landing')}
  tickLanding();setInterval(tickLanding,5000);
})();
