'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { getCurriculum } from '../../lib/content';

export default function LearnPage({ searchParams }) {
  const [prefs, setPrefs] = useState({ nativeLang: 'ar', targetLang: 'en' });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('lingomaster:prefs') || '{}');
    const nl = searchParams?.nl || saved.nativeLang || 'ar';
    const tl = searchParams?.tl || saved.targetLang || 'en';
    setPrefs({ nativeLang: nl, targetLang: tl });
  }, [searchParams?.nl, searchParams?.tl]);

  const lessons = useMemo(() => getCurriculum(prefs.targetLang), [prefs.targetLang]);

  const grouped = useMemo(() => {
    return lessons.reduce((acc, l) => {
      acc[l.level] ||= [];
      acc[l.level].push(l);
      return acc;
    }, {});
  }, [lessons]);

  return (
    <div>
      <div className="section-title">
        <h2>???? ?????? ? {prefs.targetLang.toUpperCase()}</h2>
        <div className="muted">????? ????: {prefs.nativeLang.toUpperCase()}</div>
      </div>
      {['beginner', 'intermediate', 'advanced'].map((lvl) => (
        <section key={lvl} style={{ marginBottom: 18 }}>
          <div className="section-title">
            <h3>???????: {lvl === 'beginner' ? '?????' : lvl === 'intermediate' ? '?????' : '?????'}</h3>
            <span className="badge-level">{grouped[lvl]?.length || 0} ????</span>
          </div>
          <div className="grid cols-3">
            {grouped[lvl]?.map((lesson) => (
              <Link key={lesson.slug} href={`/lesson/${lesson.slug}`} className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong>{lesson.title}</strong>
                  {lesson.pro ? <span className="tag pro">PRO</span> : null}
                </div>
                <div className="muted" style={{ marginTop: 6 }}>{lesson.summary}</div>
                <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {lesson.skills.map((s) => (
                    <span key={s} className="tag">{s}</span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
