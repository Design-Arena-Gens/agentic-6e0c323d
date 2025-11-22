'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function NavBar() {
  const [dark, setDark] = useState(false);
  const [pro, setPro] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'));
    setPro(localStorage.getItem('lingomaster:pro') === 'true');
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    const el = document.documentElement;
    el.classList.toggle('dark', next);
    localStorage.setItem('lingo:theme', next ? 'dark' : 'light');
  };

  const buy = () => {
    localStorage.setItem('lingomaster:pro', 'true');
    setPro(true);
    alert('?? ????? PRO (??????)');
  };

  return (
    <nav className="navbar">
      <Link href="/" className="brand" style={{ textDecoration: 'none', color: 'inherit' }}>
        <img src="/logo.svg" alt="logo" width={28} height={28} />
        Lingo Master <span className="badge">AI</span>
      </Link>
      <div style={{ display: 'flex', gap: 8 }}>
        <Link href="/pricing" className="btn ghost">???????</Link>
        <button className="btn" onClick={toggle}>{dark ? '??? ????' : '??? ????'}</button>
        <button className="btn primary" onClick={buy} disabled={pro}>{pro ? 'PRO ??????' : '????? PRO'}</button>
      </div>
    </nav>
  );
}
