export async function POST(request) {
  const body = await request.json();
  const { prompt, nativeLang, targetLang } = body || {};
  const apiKey = process.env.OPENAI_API_KEY;

  if (apiKey) {
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You create short language practice items as JSON.' },
            { role: 'user', content: `Native: ${nativeLang}, Target: ${targetLang}. ${prompt}. Reply as JSON: {items:[{prompt:string}]}` },
          ],
          temperature: 0.7,
        }),
      });
      if (!res.ok) throw new Error('OpenAI error');
      const data = await res.json();
      const text = data.choices?.[0]?.message?.content || '';
      try {
        const parsed = JSON.parse(text);
        return new Response(JSON.stringify(parsed), { status: 200, headers: { 'Content-Type': 'application/json' } });
      } catch {
        // fallback basic parse
        const items = text.split('\n').filter(Boolean).slice(0, 6).map((t) => ({ prompt: t.trim() }));
        return new Response(JSON.stringify({ items }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
    } catch {
      // will fall through to mock
    }
  }

  // Mocked fallback
  const examples = [
    { prompt: `???? ??? ${targetLang.toUpperCase()}: ??????` },
    { prompt: `???? ???? ?? ${targetLang.toUpperCase()} ?? ?????` },
    { prompt: `???? ?????? ???????: fast / quickly` },
  ];
  return new Response(JSON.stringify({ items: examples }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}
