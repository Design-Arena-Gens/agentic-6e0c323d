'use client';

import { useEffect, useMemo, useState } from 'react';
import { getLesson } from '../../../lib/content';
import PaywallModal from '../../../components/PaywallModal';
import GameMatch from '../../../components/GameMatch';

async function generateAIPractice(prompt, nativeLang, targetLang) {
  try {
    const res = await fetch('/api/ai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt, nativeLang, targetLang }) });
    if (!res.ok) throw new Error('AI request failed');
    return await res.json();
  } catch (e) {
    return { items: [] };
  }
}

export default function LessonPage({ params }) {
  const lesson = useMemo(() => getLesson(params.slug), [params.slug]);
  const [isPro, setIsPro] = useState(false);
  const [showPay, setShowPay] = useState(false);
  const [aiItems, setAiItems] = useState([]);
  const [prefs, setPrefs] = useState({ nativeLang: 'ar', targetLang: 'en' });

  useEffect(() => {
    setIsPro(localStorage.getItem('lingomaster:pro') === 'true');
    const saved = JSON.parse(localStorage.getItem('lingomaster:prefs') || '{}');
    setPrefs({ nativeLang: saved.nativeLang || 'ar', targetLang: saved.targetLang || 'en' });
  }, []);

  if (!lesson) {
    return <div className="card">????? ??? ?????.</div>;
  }

  const handleAI = async () => {
    const out = await generateAIPractice(`Create ${lesson.type} practice for ${lesson.title}`, prefs.nativeLang, prefs.targetLang);
    setAiItems(out.items || []);
  };

  const gated = lesson.pro && !isPro;

  return (
    <div className="grid cols-2">
      <div>
        <div className="section-title">
          <h2>{lesson.title}</h2>
          {lesson.pro ? <span className="tag pro">PRO</span> : null}
        </div>
        <div className="card" style={{ marginBottom: 12 }}>
          <p className="muted">{lesson.summary}</p>
        </div>

        {gated ? (
          <div className="card">
            <p>??? ??????? ??????. ?? ???????? ?????? ??????.</p>
            <button className="btn primary" onClick={() => setShowPay(true)}>??????? ??? PRO</button>
          </div>
        ) : (
          <div className="grid cols-1">
            {lesson.type === 'vocab' && (
              <div className="card">
                <h3>?????? ???????</h3>
                <GameMatch pairs={lesson.data.pairs} />
              </div>
            )}
            {lesson.type === 'grammar' && (
              <div className="card">
                <h3>?????? ?????</h3>
                {lesson.data.questions.map((q, idx) => (
                  <MCQ key={idx} q={q} />
                ))}
              </div>
            )}
            {lesson.type === 'listening' && (
              <div className="card">
                <h3>????? ?????</h3>
                <SpeakPractice phrases={lesson.data.phrases} lang={lesson.data.lang} />
              </div>
            )}
          </div>
        )}
      </div>

      <div>
        <div className="card" style={{ marginBottom: 12 }}>
          <h3>?????? ??????? ?????????</h3>
          <p className="muted">???? ?????? ????? ??? ?????? (?? ?????? ????? API ??? ????).</p>
          <button className="btn" onClick={handleAI}>????? ??????</button>
          <ul>
            {aiItems.map((it, i) => (
              <li key={i}>{it.prompt}</li>
            ))}
          </ul>
        </div>
        <div className="card">
          <h3>?????</h3>
          <p className="muted">???? ???? ????? ????????? ??????.</p>
        </div>
      </div>

      {showPay && <PaywallModal onClose={() => setShowPay(false)} />}
    </div>
  );
}

function MCQ({ q }) {
  const [sel, setSel] = useState(null);
  const correct = sel === q.correct;
  return (
    <div className="card" style={{ marginBottom: 10 }}>
      <div style={{ marginBottom: 8 }}><strong>{q.prompt}</strong></div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {q.options.map((o, i) => (
          <button key={i} className={`btn ${sel === i ? (correct ? 'primary' : '') : ''}`} onClick={() => setSel(i)}>{o}</button>
        ))}
      </div>
      {sel != null && (
        <div className="muted" style={{ marginTop: 8 }}>{correct ? '????? ????? ?' : '???? ??? ???? ?'}</div>
      )}
    </div>
  );
}

function SpeakPractice({ phrases, lang }) {
  const [supported, setSupported] = useState(false);
  useEffect(() => {
    setSupported(typeof window !== 'undefined' && 'speechSynthesis' in window);
  }, []);
  const speak = (text) => {
    if (!supported) return;
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = lang;
    window.speechSynthesis.speak(msg);
  };
  return (
    <div>
      {phrases.map((p, idx) => (
        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span>{p}</span>
          <button className="btn" onClick={() => speak(p)}>?????</button>
        </div>
      ))}
      {!supported && <div className="muted">??????? ?? ???? ????? ???? ??? ????.</div>}
    </div>
  );
}
