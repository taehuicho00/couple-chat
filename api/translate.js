// Vercel 서버리스 함수: 한국어 ↔ 베트남어 번역 (Claude API)
// API 키는 Vercel 환경변수에만 저장되고 브라우저에는 절대 노출되지 않는다.
import crypto from 'node:crypto';

const MODEL = process.env.CLAUDE_MODEL || 'claude-sonnet-5-5';

// 비밀번호 비교 (타이밍 공격 방지)
function samePass(a, b) {
  const x = Buffer.from(String(a || ''));
  const y = Buffer.from(String(b || ''));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}

const roleWord = (r) => (r === 'f' ? 'Girlfriend' : r === 'm' ? 'Boyfriend' : 'Partner');

function buildSystem(target, senderRole) {
  const viRule =
    senderRole === 'f'
      ? 'In Vietnamese the sender (girlfriend) refers to herself as "em" and calls him "anh".'
      : senderRole === 'm'
      ? 'In Vietnamese the sender (boyfriend) refers to himself as "anh" and calls her "em".'
      : 'In Vietnamese use the couple pronouns "anh"/"em" naturally.';
  return `You translate private chat messages between a Korean–Vietnamese couple who are lovers.
Translate the message into ${target === 'ko' ? 'Korean' : 'Vietnamese'}.

Tone rules (very important):
- Sound like a real couple texting each other: warm, casual, affectionate, natural. Never stiff, formal, or textbook-like.
- Korean: casual 반말 the way Korean couples text (e.g. "뭐해?", "보고 싶어", "밥 먹었어?", "잘 자~"). No 존댓말 (-요/-습니다) unless the original is clearly polite or joking. Natural endings like ~어/~야/~지/~네.
- Vietnamese: ${viRule} Use natural texting particles where they fit (nhé, nha, à, ơi, hen, đó, nè). Avoid formal words.
- Translate the meaning and feeling, not word by word. Keep emoji and line breaks. Convert laughter naturally (ㅋㅋ/ㅎㅎ ↔ haha/hihi).
- Keep pet names natural (자기야 ↔ anh yêu/em yêu, 여보 ↔ vợ ơi/chồng ơi) but never add affection that is not in the original.
- If the message is already in the target language, return it unchanged.

Return ONLY JSON: {"src":"<ISO 639-1 code of the original>","text":"<translation>"}`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method' });

  const pass = process.env.CHAT_PASSCODE;
  if (!pass || !samePass(req.headers['x-chat-pass'], pass)) {
    return res.status(401).json({ error: 'passcode' });
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
  if (body.check) return res.status(200).json({ ok: true }); // 비밀번호 확인용

  const text = String(body.text || '').slice(0, 2000);
  const target = body.target === 'vi' ? 'vi' : body.target === 'ko' ? 'ko' : null;
  const context = String(body.context || '').slice(0, 3000);
  if (!text || !target) return res.status(400).json({ error: 'input' });

  if (!process.env.ANTHROPIC_API_KEY) return res.status(500).json({ error: 'no_api_key' });

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1024,
        system: buildSystem(target, body.senderRole),
        messages: [
          {
            role: 'user',
            content:
              `Recent conversation (context only, do not translate):\n${context || '(none)'}\n\n` +
              `Message from the ${roleWord(body.senderRole)}:\n<<<\n${text}\n>>>`,
          },
        ],
      }),
    });
    if (!r.ok) {
      const detail = await r.text();
      console.error('Claude API error', r.status, detail);
      return res.status(502).json({ error: 'claude', status: r.status });
    }
    const data = await r.json();
    const raw = (data.content || []).map((c) => c.text || '').join('');
    let out;
    try {
      out = JSON.parse((raw.match(/\{[\s\S]*\}/) || [raw])[0]);
    } catch {
      out = { src: '', text: raw.trim() };
    }
    return res.status(200).json({
      src: String(out.src || '').slice(0, 2).toLowerCase(),
      text: String(out.text || '').trim(),
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'server' });
  }
}
