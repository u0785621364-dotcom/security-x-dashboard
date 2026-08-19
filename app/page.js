import Link from 'next/link';

export default function Home() {
  return (
    <div className="container">
      <nav className="nav">
        <div className="brand">
          <div className="brand-mark">SX</div>
          <span>Security X</span>
        </div>
        <div className="cta-row">
          <Link className="btn btn-ghost" href="/dashboard">
            Open dashboard
          </Link>
        </div>
      </nav>

      <section className="hero">
        <span className="pill on">● Protection online</span>
        <h1>Watching your server and protecting</h1>
        <p>
          Security X blocks unauthorized bots, raids, spam, nuke tools, and flagged
          communities. Verify members, auto-recover structure after attacks, and
          keep full audit logs.
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

      <div className="grid" style={{ marginTop: '1rem' }}>
        <div className="card span-4">
          <h3>Anti-nuke & recovery</h3>
          <p className="meta">
            Detect mass deletes, ban the actor, wipe chaos, and restore channels &
            roles from baseline — once, without duplicates.
          </p>
        </div>
        <div className="card span-4">
          <h3>Bot & spam shield</h3>
          <p className="meta">
            Kick unauthorized apps, stop mention spam, block invites, and alert
            staff when a spam bot is added.
          </p>
        </div>
        <div className="card span-4">
          <h3>OAuth verification</h3>
          <p className="meta">
            Full community check via Discord OAuth. Flag raid / cheat servers and
            issue temporary bans with recheck & appeal.
          </p>
        </div>
      </div>

      <footer className="footer">
        Security X · Dashboard hosted on Vercel · Configure the bot via Discord
        commands and this panel overview.
      </footer>
    </div>
  );
}
