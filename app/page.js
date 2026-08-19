'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const auth = localStorage.getItem('sx_auth');
      if (auth) {
        const server = localStorage.getItem('sx_server');
        router.replace(server ? '/dashboard' : '/select');
        return;
      }
    } catch (_) {}
    setReady(true);
  }, [router]);

  const login = () => {
    localStorage.setItem(
      'sx_auth',
      JSON.stringify({ user: { id: '291490158', username: 'Kimon', discriminator: '0001' }, at: Date.now() })
    );
    router.push('/select');
  };

  if (!ready) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', color: 'var(--text-muted)' }}>
        Loading…
      </div>
    );
  }

  return (
    <div className="landing">
      <nav className="landing-nav">
        <div className="logo">
          <div className="logo-mark">SX</div>
          <div>
            Security X
            <small>Discord protection</small>
          </div>
        </div>
        <div className="cta-row">
          <button type="button" className="btn btn-discord btn-sm" onClick={login}>
            Login with Discord
          </button>
        </div>
      </nav>

      <section className="landing-hero">
        <h1>Protect your Discord server from malicious bots.</h1>
        <p>
          Security X detects, blocks and neutralizes automated threats before they can damage
          your community. Anti-bot, anti-raid, invite control and recovery — one control panel.
        </p>
        <div className="cta-row">
          <button type="button" className="btn btn-discord" onClick={login}>
            Login with Discord
          </button>
          <a className="btn btn-ghost" href="#features">
            Learn more
          </a>
        </div>
      </section>

      <section id="features" className="feature-grid">
        <div className="feature-card">
          <div className="feature-icon">🛡</div>
          <h3>Anti-Bot Protection</h3>
          <p>Unauthorized apps are kicked on join. Adder is logged; nuke-style bots flagged.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">⚡</div>
          <h3>Anti-Raid & Joins</h3>
          <p>Join velocity limits, mass-join lockdown, and alt detection before the raid lands.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🔗</div>
          <h3>Invite Protection</h3>
          <p>Invite links deleted with optional timeout. Keep recruiting under your control.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📊</div>
          <h3>Real-Time Monitoring</h3>
          <p>Security events, severity, and outcomes in one activity stream and searchable logs.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🔧</div>
          <h3>Automated Actions</h3>
          <p>Kick, ban, timeout, and recovery workflows with clear permission boundaries.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📝</div>
          <h3>Threat Reporting</h3>
          <p>Report bots, servers, or users with evidence. Rate-limited and review-ready.</p>
        </div>
      </section>

      <footer className="landing-footer">
        Security X · Discord OAuth2 required · Owner or Administrator access only · Not affiliated with Discord
      </footer>
    </div>
  );
}
