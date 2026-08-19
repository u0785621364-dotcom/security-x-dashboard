import Link from 'next/link';

export default function Home() {
  return (
    <div className="shell">
      <nav className="nav">
        <div className="brand">
          <div className="brand-mark">SX</div>
          <div className="brand-sub">
            <span>Security X</span>
            <small>Discord protection</small>
          </div>
        </div>
        <div className="cta-row">
          <Link className="btn btn-ghost btn-sm" href="/dashboard">
            Open panel
          </Link>
        </div>
      </nav>

      <div className="status-bar">
        <span className="status-chip">
          <span className="dot" />
          <strong>Bot online</strong>
        </span>
        <span className="status-chip">
          Protected servers · <strong>demo</strong>
        </span>
        <span className="status-chip">
          OAuth · <strong>ready</strong>
        </span>
      </div>

      <section className="hero">
        <span className="pill on">● Live protection stack</span>
        <h1>Watch. Block. Recover.</h1>
        <p>
          Security X stops unauthorized bots, raids, spam, invites and nuke tools.
          Members verify via OAuth, structure restores after attacks, and every
          action is logged.
        </p>
        <div className="cta-row">
          <Link className="btn btn-primary" href="/dashboard">
            Go to control panel
          </Link>
          <a
            className="btn btn-ghost"
            href="https://discord.com/developers/applications"
            target="_blank"
            rel="noreferrer"
          >
            Discord Developer Portal
          </a>
        </div>
      </section>

      <div className="grid stagger" style={{ marginTop: '0.5rem' }}>
        <div className="card span-4">
          <div className="card-icon">🛡</div>
          <h3 style={{ marginTop: '0.75rem' }}>Anti-nuke & recovery</h3>
          <p className="meta">
            Mass deletes trigger ban + one-shot wipe and restore from baseline.
            Channels and roles come back clean — no duplicates.
          </p>
        </div>
        <div className="card span-4">
          <div className="card-icon">🤖</div>
          <h3 style={{ marginTop: '0.75rem' }}>Bot & spam shield</h3>
          <p className="meta">
            Unauthorized apps kicked. Mention spam, invites and same-text bursts
            get timeouts. Staff gets pinged on app spam.
          </p>
        </div>
        <div className="card span-4">
          <div className="card-icon">🔐</div>
          <h3 style={{ marginTop: '0.75rem' }}>OAuth verification</h3>
          <p className="meta">
            Community check via Discord OAuth. Flagged raid / cheat servers block
            verify. Recheck and appeal paths included.
          </p>
        </div>
      </div>

      <div className="grid" style={{ marginTop: '1rem' }}>
        <div className="card span-6 embed cyan">
          <h4>Owner panel</h4>
          <p>
            Pick a server, toggle modules, review events, and run setup. Full
            control over every guild the bot protects.
          </p>
          <div className="embed-footer">/security control · /security setup</div>
        </div>
        <div className="card span-6 embed green">
          <h4>Staff access</h4>
          <p>
            Enter a Guild ID to view that server’s settings and adjust allowed
            configs. Owner still owns destructive actions.
          </p>
          <div className="embed-footer">Guild ID required · read + limited write</div>
        </div>
      </div>

      <footer className="footer">
        <span>Security X · Dashboard on Vercel</span>
        <Link href="/dashboard">Open dashboard →</Link>
      </footer>
    </div>
  );
}
