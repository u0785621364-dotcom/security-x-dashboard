'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

const INITIAL_MODULES = {
  antinuke: true,
  antiraid: true,
  antispam: true,
  antiping: true,
  antibot: true,
  antiinvite: true,
  verification: true,
  recovery: true,
};

const DEMO_EVENTS = [
  { type: 'BOT_REMOVED', sev: 'HIGH', detail: 'Spam app kicked · adder logged', t: '2m ago' },
  { type: 'INVITE_BLOCKED', sev: 'MODERATE', detail: 'Invite deleted · 24h timeout', t: '11m ago' },
  { type: 'NUKE', sev: 'CRITICAL', detail: 'Recovery scheduled (wipe + restore)', t: '1h ago' },
  { type: 'OAUTH_BAD_GUILDS', sev: 'CRITICAL', detail: 'Verify failed · flagged community', t: '3h ago' },
  { type: 'MASS_PING', sev: 'HIGH', detail: 'Mention spam · timeout 24h', t: '5h ago' },
];

function Switch({ on, onClick }) {
  return (
    <button type="button" className={`switch ${on ? 'on' : ''}`} onClick={onClick} aria-label="toggle">
      <span />
    </button>
  );
}

export default function DashboardPage() {
  const [modules, setModules] = useState(INITIAL_MODULES);
  const [tab, setTab] = useState('overview');

  const stats = useMemo(
    () => ({
      events: 18,
      bots: 4,
      nukes: 1,
      recoveries: 1,
      threat: modules.antinuke && modules.antibot ? 'LOW' : 'ELEVATED',
    }),
    [modules]
  );

  const toggle = (key) => setModules((m) => ({ ...m, [key]: !m[key] }));

  return (
    <div className="container">
      <nav className="nav">
        <Link href="/" className="brand">
          <div className="brand-mark">SX</div>
          <span>Security X</span>
        </Link>
        <span className="pill on">● Dashboard</span>
      </nav>

      <div className="side">
        <nav>
          <a className={tab === 'overview' ? 'active' : ''} onClick={() => setTab('overview')}>
            Overview
          </a>
          <a className={tab === 'modules' ? 'active' : ''} onClick={() => setTab('modules')}>
            Modules
          </a>
          <a className={tab === 'events' ? 'active' : ''} onClick={() => setTab('events')}>
            Events
          </a>
          <a className={tab === 'setup' ? 'active' : ''} onClick={() => setTab('setup')}>
            Setup guide
          </a>
        </nav>

        <div className="main">
          {tab === 'overview' && (
            <>
              <h2 className="section-title" style={{ marginTop: 0 }}>
                Protection overview
              </h2>
              <div className="grid">
                <div className="card span-3">
                  <p className="meta">Events (24h)</p>
                  <div className="stat">{stats.events}</div>
                </div>
                <div className="card span-3">
                  <p className="meta">Bots removed</p>
                  <div className="stat">{stats.bots}</div>
                </div>
                <div className="card span-3">
                  <p className="meta">Nukes</p>
                  <div className="stat">{stats.nukes}</div>
                </div>
                <div className="card span-3">
                  <p className="meta">Threat level</p>
                  <div className="stat" style={{ color: stats.threat === 'LOW' ? 'var(--green)' : 'var(--amber)' }}>
                    {stats.threat}
                  </div>
                </div>
                <div className="card span-6">
                  <h3>Live stack</h3>
                  <p className="meta" style={{ marginTop: '.6rem' }}>
                    {Object.entries(modules).map(([k, v]) => (
                      <span key={k} className={`pill ${v ? 'on' : 'off'}`} style={{ margin: '0 .35rem .35rem 0' }}>
                        {k}: {v ? 'ON' : 'OFF'}
                      </span>
                    ))}
                  </p>
                </div>
                <div className="card span-6">
                  <h3>Bot commands (owner)</h3>
                  <p className="meta">
                    <code>/security control</code> · <code>/security setup</code> ·{' '}
                    <code>/security panel</code> · <code>/security recover-full</code> ·{' '}
                    <code>/security seed-threats</code>
                  </p>
                </div>
              </div>
            </>
          )}

          {tab === 'modules' && (
            <>
              <h2 className="section-title" style={{ marginTop: 0 }}>
                Modules
              </h2>
              <div className="card span-12">
                <p className="meta" style={{ marginBottom: '1rem' }}>
                  Local preview toggles (UI). Server-side state is controlled by the Discord bot
                  owner panel and SQLite config on your host.
                </p>
                {Object.keys(modules).map((key) => (
                  <div className="toggle-row" key={key}>
                    <div>
                      <strong style={{ textTransform: 'capitalize' }}>{key}</strong>
                      <div className="meta">Security X module</div>
                    </div>
                    <Switch on={modules[key]} onClick={() => toggle(key)} />
                  </div>
                ))}
              </div>
            </>
          )}

          {tab === 'events' && (
            <>
              <h2 className="section-title" style={{ marginTop: 0 }}>
                Recent security events
              </h2>
              <div className="card">
                <p className="meta" style={{ marginBottom: '1rem' }}>
                  Demo feed. Connect a bot API later for live SQLite events from your host.
                </p>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Severity</th>
                      <th>Detail</th>
                      <th>When</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DEMO_EVENTS.map((e) => (
                      <tr key={e.type + e.t}>
                        <td>{e.type}</td>
                        <td>
                          <span
                            className={`pill ${
                              e.sev === 'CRITICAL' || e.sev === 'HIGH' ? 'off' : e.sev === 'MODERATE' ? 'warn' : 'on'
                            }`}
                          >
                            {e.sev}
                          </span>
                        </td>
                        <td className="meta">{e.detail}</td>
                        <td className="meta">{e.t}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {tab === 'setup' && (
            <>
              <h2 className="section-title" style={{ marginTop: 0 }}>
                Setup guide
              </h2>
              <div className="grid">
                <div className="card span-6">
                  <h3>1. Host the bot</h3>
                  <p className="meta">
                    Upload Security-X.zip to bot-hosting, set <code>DISCORD_TOKEN</code>,{' '}
                    <code>CLIENT_ID</code>, <code>CLIENT_SECRET</code>, <code>PUBLIC_URL</code>,{' '}
                    <code>OAUTH_PORT</code>.
                  </p>
                </div>
                <div className="card span-6">
                  <h3>2. Discord OAuth</h3>
                  <p className="meta">
                    Redirect URI must be exactly
                    <br />
                    <code>https://YOUR_HOST/oauth/callback</code>
                  </p>
                </div>
                <div className="card span-6">
                  <h3>3. Server setup</h3>
                  <p className="meta">
                    Owner runs <code>/security setup</code> → Verified / Unverified roles, log &
                    verify channels, panel.
                  </p>
                </div>
                <div className="card span-6">
                  <h3>4. Permissions</h3>
                  <p className="meta">
                    Bot needs Manage Channels/Roles, Ban, Kick, Timeout, Manage Messages, View
                    Audit Log. Role above Verified/Unverified.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <footer className="footer">
        Security X Dashboard · Demo data until bot API is linked ·{' '}
        <Link href="/">Home</Link>
      </footer>
    </div>
  );
}
