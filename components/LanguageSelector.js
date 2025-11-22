'use client';

const languages = [
  { code: 'ar', name: '???????' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Espa?ol' },
  { code: 'fr', name: 'Fran?ais' },
  { code: 'de', name: 'Deutsch' },
  { code: 'tr', name: 'T?rk?e' },
  { code: 'zh', name: '??' },
  { code: 'ja', name: '???' },
  { code: 'ru', name: '???????' },
];

export default function LanguageSelector({ nativeLang, targetLang, onNativeChange, onTargetChange }) {
  return (
    <div className="grid cols-2">
      <div>
        <label>????? ????</label>
        <select value={nativeLang} onChange={(e) => onNativeChange(e.target.value)}>
          {languages.map((l) => (
            <option key={l.code} value={l.code}>{l.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label>????? ?????</label>
        <select value={targetLang} onChange={(e) => onTargetChange(e.target.value)}>
          {languages.map((l) => (
            <option key={l.code} value={l.code}>{l.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
