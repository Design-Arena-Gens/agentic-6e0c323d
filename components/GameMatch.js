'use client';

import { useMemo, useState } from 'react';

export default function GameMatch({ pairs }) {
  const shuffled = useMemo(() => shufflePairs(pairs || []), [pairs]);
  const [selected, setSelected] = useState(null);
  const [matched, setMatched] = useState([]);

  const onPick = (side, idx) => {
    const key = `${side}-${idx}`;
    if (matched.includes(key)) return;
    const item = { side, idx, value: side === 'a' ? shuffled.left[idx] : shuffled.right[idx] };
    if (!selected) { setSelected(item); return; }
    const v1 = selected.value;
    const v2 = item.value;
    const isMatch = arePair(pairs, v1, v2);
    if (isMatch) {
      setMatched((m) => [...m, `${selected.side}-${selected.idx}`, key]);
      setSelected(null);
    } else {
      setSelected(item);
    }
  };

  const allDone = matched.length >= (pairs?.length || 0) * 2;

  return (
    <div className="grid cols-2">
      <div className="card">
        {shuffled.left.map((t, i) => (
          <button key={i} className="btn" style={{ width: '100%', marginBottom: 8, opacity: matched.includes(`a-${i}`) ? .4 : 1, borderColor: selected?.side==='a' && selected?.idx===i ? 'var(--accent)' : '' }} onClick={() => onPick('a', i)}>{t}</button>
        ))}
      </div>
      <div className="card">
        {shuffled.right.map((t, i) => (
          <button key={i} className="btn" style={{ width: '100%', marginBottom: 8, opacity: matched.includes(`b-${i}`) ? .4 : 1, borderColor: selected?.side==='b' && selected?.idx===i ? 'var(--accent)' : '' }} onClick={() => onPick('b', i)}>{t}</button>
        ))}
      </div>
      {allDone && <div className="card" style={{ gridColumn: '1 / -1' }}>?????! ????? ?????? ??</div>}
    </div>
  );
}

function shufflePairs(pairs) {
  const left = pairs.map(p => p.a);
  const right = pairs.map(p => p.b);
  shuffle(left); shuffle(right);
  return { left, right };
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function arePair(pairs, v1, v2) {
  return pairs.some(p => (p.a === v1 && p.b === v2) || (p.a === v2 && p.b === v1));
}
