// Firebase 접속 정보를 Vercel 환경변수(FIREBASE_CONFIG)에서 읽어 브라우저에 전달한다.
// Firebase 콘솔의 firebaseConfig = { ... } 를 그대로 붙여넣어도 되도록 느슨하게 읽는다.
const KEYS = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];

export function parseFirebaseConfig(raw) {
  const out = {};
  for (const k of KEYS) {
    const m = String(raw || '').match(new RegExp(`["']?${k}["']?\\s*:\\s*["']([^"']+)["']`));
    if (m) out[k] = m[1];
  }
  return out;
}

export default function handler(req, res) {
  const cfg = parseFirebaseConfig(process.env.FIREBASE_CONFIG);
  if (!cfg.apiKey || !cfg.projectId) return res.status(500).json({ error: 'FIREBASE_CONFIG not set' });
  res.setHeader('cache-control', 'public, max-age=300');
  return res.status(200).json(cfg);
}
