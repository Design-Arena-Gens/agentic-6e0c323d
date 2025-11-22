export const metadata = {
  title: 'Lingo Master',
  description: 'AI-powered fun language learning from zero to pro',
};

import './globals.css';
import NavBar from '../components/NavBar';
import ThemeProvider from '../components/ThemeProvider';

export default function RootLayout({ children }) {
  return (
    <html lang="ar" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <NavBar />
          <main className="container">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
