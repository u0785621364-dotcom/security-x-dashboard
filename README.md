# Security X Dashboard

Premium control panel for the Security X Discord bot.

## Features

- Server list — pick a guild to manage
- Owner mode — full control
- Staff mode — unlock a server with Guild ID, then view/edit configs
- Live-style status: online, uptime, protected count, OAuth, threat
- Modules by category (Defense / Chat / Apps / Access)
- Events feed, OAuth panel, setup guide
- Animated dark UI

## Local

```bash
npm install
npm run dev
```

## Deploy

Hosted on Vercel. Live module state lives on the bot host (SQLite).
Discord owner commands remain source of truth until a bot HTTP API is added (`BOT_API_URL`).

## Clean URL

Vercel default domains include the team slug. For a short public URL:

1. Open the project in Vercel → Settings → Domains
2. Add a custom domain (e.g. `panel.yourdomain.com`), or
3. Use a short project name production alias when available

## GitHub

https://github.com/u0785621364-dotcom/security-x-dashboard
