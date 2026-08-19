import './globals.css';

export const metadata = {
  title: 'Security X · Control Panel',
  description: 'Anti-nuke, anti-raid, verification & recovery dashboard for Discord',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="bg-grid" aria-hidden />
        {children}
      </body>
    </html>
  );
}
