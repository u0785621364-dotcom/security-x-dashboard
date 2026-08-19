'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

const DEMO_SERVERS = [
  {
    id: '112233445566778899',
    name: 'Main HQ',
    members: 842,
    protected: true,
    icon: 'HQ',
    modules: {
      antinuke: true,
      antiraid: true,
      antispam: true,
      antiping: true,
      antibot: true,
      antiinvite: true,
      verification: true,
      recovery: true,
    },
  },
  {
    id: '998877665544332211',
    name: 'Community Hub',
    members: 310,
    protected: true,
    icon: 'CH',
    modules: {
      antinuke: true,
      antiraid: true,
      antispam: true,
      antiping: false,
      antibot: true,
      antiinvite: true,
      verification: true,
      recovery: true,
    },
  },
  {
    id: '554433221100998877',
    name: 'Dev Testing',
    members: 28,
    protected: true,
    icon: 'DT',
    modules: {
      antinuke: true,
      antiraid: false,
      antispam: true,
      antiping: true,
      antibot: true,
      antiinvite: false,
      verification: false,
      recovery: true,
    },
  },
];

const MODULE_META = {
  antinuke: { cat: 'Defense', title: 'Anti-nuke', desc: 'Detect mass channel/role deletes, ban actor, schedule recovery.' },
  antiraid: { cat: 'Defense', title: 'Anti-raid', desc: 'Join velocity limits and raid-mode lockdown.' },
  antispam: { cat: 'Chat', title: 'Anti-spam', desc: 'Same-text bursts and message floods → timeout.' },
  antiping: { cat: 'Chat', title: 'Anti-ping', desc: 'Mass mention spam blocked and staff alerted.' },
  antibot: { cat: 'Apps', title: 'Anti-bot', desc: 'Kick unauthorized apps; log adder and nuke-bot flags.' },
  antiinvite: { cat: 'Chat', title: 'Anti-invite', desc: 'Delete invite links and apply 24h timeout.' },
  verification: { cat: 'Access', title: 'OAuth verify', desc: 'Verified / Unverified roles + mutual bad-server checks.' },
  recovery: { cat: 'Defense', title: 'Recovery', desc: 'Wipe chaos then restore channels & roles from snapshot.' },
};

const DEMO_EVENTS = [
  { type: 'BOT_REMOVED', sev: 'HIGH', detail: 'Spam app kicked · adder logged', t: '2m ago', guild: 'Main HQ' },
  { type: 'INVITE_BLOCKED', sev: 'MODERATE', detail: 'Invite deleted · 24h timeout', t: '11m ago', guild: 'Community Hub' },
  { type: 'NUKE', sev: 'CRITICAL', detail: 'Recovery scheduled (wipe + restore)', t: '1h ago', guild: 'Main HQ' },
  { type: 'OAUTH_BAD_GUILDS', sev: 'CRITICAL', detail: 'Verify failed · flagged community', t: '3h ago', guild: 'Main HQ' },
  { type: 'MASS_PING', sev: 'HIGH', detail: 'Mention spam · timeout 24h', t: '5h ago', guild: 'Dev Testing' },
  { type: 'BOT_KICK', sev: 'HIGH', detail: 'Unauthorized bot removed', t: '6h ago', guild: 'Community Hub' },
];

function Switch({ on, onClick, disabled }) {
  return (
    <button
      type="button"
      className={`switch ${on ? 'on' : ''}`}
      onClick={disabled ? undefined : onClick}
      aria-label="toggle"
      style={disabled ? { opacity: 0.45, cursor: 'not-allowed' } : undefined}
    >
      <span />
    </button>
  );
}

function formatUptime(sec) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return `${h}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`;
}

export default function DashboardPage() {
  const [tab, setTab] = useState('overview');
  const [role, setRole] = useState('owner');
  const [servers, setServers] = useState(DEMO_SERVERS);
  const [selectedId, setSelectedId] = useState(DEMO_SERVERS[0].id);
  const [guildInput, setGuildInput] = useState('');
  const [staffGuildId, setStaffGuildId] = useState('');
  const [uptime, setUptime] = useState(14 * 3600 + 32 * 60 + 18);
  const [toast, setToast] = useState('');

  useEffect(() => {
    const t = setInterval(() => setUptime((u) => u + 1), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  const selected = useMemo(
    () => servers.find((s) => s.id === selectedId) || servers[0],
    [servers, selectedId]
  );

  const protectedCount = servers.filter((s) => s.protected).length;
  const canEdit = role === 'owner' || (role === 'staff' && staffGuildId && selectedId === staffGuildId);
  const modules = selected?.modules || {};

  const toggle = (key) => {
    if (!canEdit) {
      setToast('Staff: enter matching Guild ID to edit this server.');
      return;
    }
    setServers((list) =>
      list.map((s) =>
        s.id === selectedId
          ? { ...s, modules: { ...s.modules, [key]: !s.modules[key] } }
          : s
      )
    );
    setToast(`${MODULE_META[key].title} ${modules[key] ? 'disabled' : 'enabled'} (local preview)`);
  };

  const loadStaffGuild = () => {
    const id = guildInput.trim();
    if (!/^\d{17,20}$/.test(id)) {
      setToast('Enter a valid Discord Guild ID (17–20 digits).');
      return;
    }
    const found = servers.find((s) => s.id === id);
    if (found) {
      setStaffGuildId(id);
      setSelectedId(id);
      setToast(`Staff access unlocked for ${found.name}`);
      return;
    }
    setServers((list) => [
      ...list,
      {
        id,
        name: `Guild ${id.slice(-4)}`,
        members: 0,
        protected: true,
        icon: 'ID',
        modules: {
          antinuke: true, antiraid: true, antispam: true, antiping: true,
          antibot: true, antiinvite: true, verification: true, recovery: true,
        },
      },
    ]);
    setStaffGuildId(id);
    setSelectedId(id);
    setToast('Guild loaded for staff view (demo).');
  };

  const threat = modules.antinuke && modules.antibot && modules.recovery ? 'LOW' : 'ELEVATED';

  return (
    <div className="shell">
      <nav className="nav">
        <Link href="/" className="brand">
          <div className="brand-mark">SX</div>
          <div className="brand-sub">
            <span>Security X</span>
            <small>Control panel</small>
          </div>
        </Link>
        <div className="cta-row">
          <span className="pill on">● Online</span>
          <span className="pill blue">{role === 'owner' ? 'Owner' : 'Staff'}</span>
        </div>
      </nav>

      <div className="status-bar">
        <span className="status-chip"><span className="dot" /><strong>Bot online</strong></span>
        <span className="status-chip">Uptime · <strong className="mono">{formatUptime(uptime)}</strong></span>
        <span className="status-chip">Protected · <strong>{protectedCount}</strong> / {servers.length}</span>
        <span className="status-chip">OAuth · <strong>ready</strong></span>
        <span className="status-chip">Threat · <strong style={{ color: threat === 'LOW' ? 'var(--green)' : 'var(--amber)' }}>{threat}</strong></span>
      </div>

      {toast ? (
        <div className="embed cyan" style={{ marginBottom: '1rem', animation: 'fadeUp 0.25s ease' }}>
          <p style={{ margin: 0, color: 'var(--text)' }}>{toast}</p>
        </div>
      ) : null}

      <div className="dash">
        <aside className="sidebar">
          <div className="card" style={{ padding: '0.85rem' }}>
            <div className="stat-label" style={{ marginBottom: '0.5rem' }}>Access mode</div>
            <div className="role-switch">
              <button type="button" className={role === 'owner' ? 'active' : ''} onClick={() => { setRole('owner'); setToast('Owner mode — full control'); }}>Owner</button>
              <button type="button" className={role === 'staff' ? 'active' : ''} onClick={() => { setRole('staff'); setToast('Staff mode — enter Guild ID to edit'); }}>Staff</button>
            </div>
          </div>

          {role === 'staff' && (
            <div className="card" style={{ padding: '0.85rem' }}>
              <div className="stat-label" style={{ marginBottom: '0.5rem' }}>Staff · Guild ID</div>
              <div className="field-row">
                <input value={guildInput} onChange={(e) => setGuildInput(e.target.value)} placeholder="e.g. 112233445566778899" className="mono" />
              </div>
              <button type="button" className="btn btn-primary btn-sm" style={{ width: '100%', marginTop: '0.5rem' }} onClick={loadStaffGuild}>Unlock server</button>
              {staffGuildId ? <p className="meta" style={{ marginTop: '0.55rem', fontSize: '0.78rem' }}>Unlocked: <span className="mono">{staffGuildId}</span></p> : null}
            </div>
          )}

          <div className="card" style={{ padding: '0.85rem' }}>
            <div className="stat-label" style={{ marginBottom: '0.55rem' }}>Servers</div>
            <div className="server-list">
              {servers.map((s) => (
                <button key={s.id} type="button" className={`server-item ${selectedId === s.id ? 'active' : ''}`} onClick={() => setSelectedId(s.id)}>
                  <div className="server-icon">{s.icon}</div>
                  <div className="server-meta">
                    <strong>{s.name}</strong>
                    <span>{s.members ? `${s.members} members` : 'Guild ID'} · {s.protected ? 'protected' : 'off'}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <nav className="sidebar-nav">
            {[['overview','Overview'],['modules','Modules'],['events','Events'],['config','Server config'],['oauth','OAuth & access'],['setup','Setup guide']].map(([id, label]) => (
              <button key={id} type="button" className={tab === id ? 'active' : ''} onClick={() => setTab(id)}>{label}</button>
            ))}
          </nav>
        </aside>

        <div className="main">
          {tab === 'overview' && (
            <>
              <h2 className="section-title">{selected?.name} · overview</h2>
              <div className="grid stagger">
                <div className="card span-3"><div className="stat-label">Events (24h)</div><div className="stat">18</div></div>
                <div className="card span-3"><div className="stat-label">Bots removed</div><div className="stat">4</div></div>
                <div className="card span-3"><div className="stat-label">Nukes blocked</div><div className="stat">1</div></div>
                <div className="card span-3"><div className="stat-label">Threat</div><div className="stat" style={{ color: threat === 'LOW' ? 'var(--green)' : 'var(--amber)' }}>{threat}</div></div>
                <div className="card span-7">
                  <h3>Live stack on this server</h3>
                  <p className="meta" style={{ marginTop: '0.65rem' }}>
                    {Object.entries(modules).map(([k, v]) => (
                      <span key={k} className={`pill ${v ? 'on' : 'off'}`} style={{ margin: '0 0.35rem 0.35rem 0' }}>
                        {MODULE_META[k]?.title || k}: {v ? 'ON' : 'OFF'}
                      </span>
                    ))}
                  </p>
                </div>
                <div className="card span-5">
                  <h3>Guild</h3>
                  <p className="meta" style={{ marginTop: '0.5rem' }}>
                    ID · <span className="mono">{selected?.id}</span><br />
                    Members · {selected?.members || '—'}<br />
                    Mode · {role === 'owner' ? 'Owner (full)' : canEdit ? 'Staff (edit unlocked)' : 'Staff (view)'}
                  </p>
                </div>
                <div className="card span-6 embed cyan">
                  <h4>Owner commands</h4>
                  <p className="mono" style={{ color: 'var(--text)', fontSize: '0.85rem' }}>
                    /security control · /security setup · /security panel<br />
                    /security recover-full · /security seed-threats
                  </p>
                </div>
                <div className="card span-6 embed green">
                  <h4>Status</h4>
                  <p>Bot uptime <strong className="mono">{formatUptime(uptime)}</strong><br />OAuth callback ready · Verified/Unverified roles auto-managed</p>
                </div>
              </div>
            </>
          )}

          {tab === 'modules' && (
            <>
              <h2 className="section-title">Modules · {selected?.name}</h2>
              {!canEdit && role === 'staff' ? <div className="locked-note">Staff view is locked for edits until you unlock with this server’s Guild ID.</div> : null}
              <p className="meta" style={{ marginBottom: '1rem' }}>Toggles are a local preview. Live state lives in the bot SQLite config until a bot API is linked.</p>
              <div className="module-grid">
                {Object.keys(MODULE_META).map((key) => {
                  const m = MODULE_META[key];
                  return (
                    <div className="module-card" key={key}>
                      <header>
                        <div>
                          <div className="cat-label">{m.cat}</div>
                          <h4>{m.title}</h4>
                        </div>
                        <Switch on={!!modules[key]} onClick={() => toggle(key)} disabled={!canEdit} />
                      </header>
                      <p>{m.desc}</p>
                      <span className={`pill ${modules[key] ? 'on' : 'off'}`}>{modules[key] ? 'Enabled' : 'Disabled'}</span>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {tab === 'events' && (
            <>
              <h2 className="section-title">Recent security events</h2>
              <div className="card">
                <p className="meta" style={{ marginBottom: '0.85rem' }}>Demo feed. Connect <span className="mono">BOT_API_URL</span> later for live SQLite events.</p>
                <div className="event-list">
                  {DEMO_EVENTS.map((e) => (
                    <div className="event-row" key={e.type + e.t}>
                      <strong className="mono" style={{ fontSize: '0.8rem' }}>{e.type}</strong>
                      <span className={`pill ${e.sev === 'CRITICAL' || e.sev === 'HIGH' ? 'off' : e.sev === 'MODERATE' ? 'warn' : 'on'}`}>{e.sev}</span>
                      <span className="meta">{e.detail}<br /><span style={{ fontSize: '0.75rem' }}>{e.guild}</span></span>
                      <span className="meta" style={{ textAlign: 'right' }}>{e.t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {tab === 'config' && (
            <>
              <h2 className="section-title">Server config · {selected?.name}</h2>
              {!canEdit && role === 'staff' ? <div className="locked-note">Enter the Guild ID in the sidebar to unlock config edits for this server.</div> : null}
              <div className="grid">
                <div className="card span-6">
                  <h3>Channels & roles</h3>
                  <div className="field" style={{ marginTop: '0.85rem' }}><label>Log channel ID</label><input className="mono" placeholder="Channel snowflake" disabled={!canEdit} /></div>
                  <div className="field"><label>Verify channel ID</label><input className="mono" placeholder="Channel snowflake" disabled={!canEdit} /></div>
                  <div className="field"><label>Verified role ID</label><input className="mono" placeholder="Role snowflake" disabled={!canEdit} /></div>
                  <div className="field"><label>Unverified role ID</label><input className="mono" placeholder="Role snowflake" disabled={!canEdit} /></div>
                  <button type="button" className="btn btn-primary btn-sm" disabled={!canEdit} onClick={() => setToast('Config save is preview-only until bot API is linked.')}>Save config</button>
                </div>
                <div className="card span-6">
                  <h3>Guild identity</h3>
                  <div className="embed" style={{ marginTop: '0.85rem' }}>
                    <h4>{selected?.name}</h4>
                    <p>Guild ID<br /><span className="mono" style={{ color: 'var(--text)' }}>{selected?.id}</span></p>
                    <div className="embed-footer">Use this ID for staff unlock · owner can edit any server in the list</div>
                  </div>
                  <div className="embed amber" style={{ marginTop: '0.85rem' }}>
                    <h4>Staff rules</h4>
                    <p>Staff must supply the target Guild ID. They can view settings and change non-destructive options. Nuke recovery and global threat seed stay owner-only on the bot.</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {tab === 'oauth' && (
            <>
              <h2 className="section-title">OAuth & Discord access</h2>
              <div className="grid">
                <div className="card span-6 embed cyan">
                  <h4>OAuth verification</h4>
                  <p>Members authorize with Discord. Security X checks mutual guilds against the threat list. Bad communities → verify blocked, temp ban path available.</p>
                  <div className="embed-footer">Scope: identify · guilds</div>
                </div>
                <div className="card span-6 embed green">
                  <h4>Callback</h4>
                  <p>Redirect URI must match your bot host exactly:<br /><span className="mono" style={{ color: 'var(--text)' }}>https://YOUR_HOST/oauth/callback</span></p>
                </div>
                <div className="card span-4"><div className="stat-label">OAuth</div><div className="stat" style={{ color: 'var(--green)', fontSize: '1.35rem' }}>Ready</div><p className="meta">CLIENT_ID + SECRET set on host</p></div>
                <div className="card span-4"><div className="stat-label">Protected servers</div><div className="stat">{protectedCount}</div><p className="meta">Across this bot instance</p></div>
                <div className="card span-4"><div className="stat-label">Uptime</div><div className="stat mono" style={{ fontSize: '1.2rem' }}>{formatUptime(uptime)}</div><p className="meta">Since last restart (demo)</p></div>
              </div>
            </>
          )}

          {tab === 'setup' && (
            <>
              <h2 className="section-title">Setup guide</h2>
              <div className="grid stagger">
                <div className="card span-6"><h3>1. Host the bot</h3><p className="meta">Upload <span className="mono">Security-X.zip</span>, set <span className="mono">DISCORD_TOKEN</span>, <span className="mono">CLIENT_ID</span>, <span className="mono">CLIENT_SECRET</span>, <span className="mono">PUBLIC_URL</span>, <span className="mono">OAUTH_PORT</span>.</p></div>
                <div className="card span-6"><h3>2. Discord OAuth</h3><p className="meta">Redirect URI:<br /><span className="mono">https://YOUR_HOST/oauth/callback</span></p></div>
                <div className="card span-6"><h3>3. Server setup</h3><p className="meta">Owner runs <span className="mono">/security setup</span> → Verified / Unverified roles, log & verify channels, panel embeds.</p></div>
                <div className="card span-6"><h3>4. Permissions</h3><p className="meta">Manage Channels/Roles, Ban, Kick, Timeout, Manage Messages, View Audit Log. Bot role above Verified/Unverified.</p></div>
              </div>
            </>
          )}
        </div>
      </div>

      <footer className="footer">
        <span>Security X Dashboard · Demo data until bot API is linked</span>
        <Link href="/">← Home</Link>
      </footer>
    </div>
  );
}
