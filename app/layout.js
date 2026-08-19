import './globals.css';

export const metadata = {
  title: 'Security X Dashboard',
  description: 'Control panel for Security X Discord protection',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
