// 커플 이모티콘: 핑크 토끼 '토리'(a) + 크림 곰 '뭉치'(b)
// 모두 직접 그린 SVG라 용량이 작고 어떤 화면에서도 선명하다.
const OUT = '#4a3540';
const SKIN = { a: '#ffc9d6', b: '#ffe2b0' };
const INNER = { a: '#ff9fb6', b: '#f2b877' };
const RED = '#ff5577';
const BLUE = '#7cc4ff';

const heart = (x, y, s = 1, c = RED) =>
  `<path transform="translate(${x} ${y}) scale(${s})" d="M0 3C0-2-7-4-7 2C-7 6 0 10 0 12C0 10 7 6 7 2C7-4 0-2 0 3Z" fill="${c}" stroke="${OUT}" stroke-width="${1.6 / s}" stroke-linejoin="round"/>`;
const sparkle = (x, y, s = 1, c = '#ffd23f') =>
  `<path transform="translate(${x} ${y}) scale(${s})" d="M0-8Q1-1 8 0Q1 1 0 8Q-1 1-8 0Q-1-1 0-8Z" fill="${c}"/>`;

// ----- 눈 -----
const EYES = {
  dot: () => [-14, 14].map(x => `<circle cx="${x}" cy="-4" r="4.6" fill="${OUT}"/><circle cx="${x + 1.6}" cy="-5.8" r="1.6" fill="#fff"/>`).join(''),
  happy: () => `<path d="M-20-2Q-14-11-8-2M8-2Q14-11 20-2" stroke="${OUT}" stroke-width="3.6" fill="none" stroke-linecap="round"/>`,
  closed: () => `<path d="M-20-5Q-14 1-8-5M8-5Q14 1 20-5" stroke="${OUT}" stroke-width="3.4" fill="none" stroke-linecap="round"/>`,
  heart: () => heart(-14, -11, 0.95) + heart(14, -11, 0.95),
  sad: () => EYES.dot() + `<path d="M-21-13L-9-10M21-13L9-10" stroke="${OUT}" stroke-width="2.6" stroke-linecap="round"/>`,
  cry: () => `<path d="M-21-6L-8-3M-21 0L-8-3M21-6L8-3M21 0L8-3" stroke="${OUT}" stroke-width="3.2" stroke-linecap="round"/>` +
    `<path d="M-15 1Q-19 16-15 30Q-11 16-15 1ZM15 1Q11 16 15 30Q19 16 15 1Z" fill="${BLUE}" opacity=".9"/>`,
  angry: () => `<path d="M-22-14L-8-8M22-14L8-8" stroke="${OUT}" stroke-width="3.4" stroke-linecap="round"/>` +
    [-14, 14].map(x => `<circle cx="${x}" cy="-2" r="4" fill="${OUT}"/>`).join(''),
  wide: () => [-14, 14].map(x => `<circle cx="${x}" cy="-5" r="7.5" fill="#fff" stroke="${OUT}" stroke-width="2.6"/><circle cx="${x}" cy="-4" r="3.6" fill="${OUT}"/>`).join(''),
  wink: () => `<path d="M-20-3Q-14-11-8-3" stroke="${OUT}" stroke-width="3.6" fill="none" stroke-linecap="round"/><circle cx="14" cy="-4" r="4.6" fill="${OUT}"/><circle cx="15.6" cy="-5.8" r="1.6" fill="#fff"/>`,
  side: () => [-11, 17].map(x => `<circle cx="${x}" cy="-4" r="4.4" fill="${OUT}"/>`).join(''),
  flat: () => `<path d="M-20-4H-9M9-4H20" stroke="${OUT}" stroke-width="3.6" stroke-linecap="round"/>`,
  teary: () => EYES.dot() + `<path d="M-19 1Q-21 8-18 10Q-15 8-17 1Z" fill="${BLUE}"/>`
};
// ----- 입 -----
const MOUTH = {
  smile: `<path d="M-6 8Q0 14 6 8" stroke="${OUT}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
  open: `<path d="M-9 6Q0 22 9 6Z" fill="#d9536f" stroke="${OUT}" stroke-width="2.6" stroke-linejoin="round"/><path d="M-4 13Q0 17 4 13" fill="#ff9fb0"/>`,
  o: `<ellipse cx="0" cy="11" rx="4.5" ry="5.5" fill="#d9536f" stroke="${OUT}" stroke-width="2.4"/>`,
  cat: `<path d="M-8 8Q-4 13 0 8Q4 13 8 8" stroke="${OUT}" stroke-width="2.8" fill="none" stroke-linecap="round"/>`,
  kiss: `<path d="M-1 4Q6 7-1 10Q6 13-1 16" stroke="${OUT}" stroke-width="2.8" fill="none" stroke-linecap="round"/>`,
  wavy: `<path d="M-9 11Q-4.5 7 0 11Q4.5 15 9 11" stroke="${OUT}" stroke-width="2.8" fill="none" stroke-linecap="round"/>`,
  frown: `<path d="M-7 14Q0 6 7 14" stroke="${OUT}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
  pout: `<path d="M-5 11H5" stroke="${OUT}" stroke-width="3" stroke-linecap="round"/>`,
  yum: `<path d="M-7 7Q0 15 7 7" stroke="${OUT}" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M1 10Q4 18 8 11" fill="#ff8aa3" stroke="${OUT}" stroke-width="2"/>`
};

// 캐릭터 한 마리 (중심 0,0 기준)
function char(c, eyes, mouth, { blush = 0.55, puff = false } = {}) {
  const s = SKIN[c], inn = INNER[c];
  const ears = c === 'a'
    ? `<g transform="rotate(-14 -17 -30)"><ellipse cx="-17" cy="-46" rx="10" ry="22" fill="${s}" stroke="${OUT}" stroke-width="3"/><ellipse cx="-17" cy="-44" rx="4.5" ry="14" fill="${inn}"/></g>` +
      `<g transform="rotate(14 17 -30)"><ellipse cx="17" cy="-46" rx="10" ry="22" fill="${s}" stroke="${OUT}" stroke-width="3"/><ellipse cx="17" cy="-44" rx="4.5" ry="14" fill="${inn}"/></g>`
    : `<circle cx="-27" cy="-25" r="12" fill="${s}" stroke="${OUT}" stroke-width="3"/><circle cx="-27" cy="-25" r="5.5" fill="${inn}"/>` +
      `<circle cx="27" cy="-25" r="12" fill="${s}" stroke="${OUT}" stroke-width="3"/><circle cx="27" cy="-25" r="5.5" fill="${inn}"/>`;
  const body = puff
    ? `<path d="M-40 0C-40-24-22-34 0-34C22-34 40-24 40 0C46 14 32 34 0 34C-32 34-46 14-40 0Z" fill="${s}" stroke="${OUT}" stroke-width="3"/>`
    : `<ellipse cx="0" cy="0" rx="40" ry="34" fill="${s}" stroke="${OUT}" stroke-width="3"/>`;
  const cheeks = blush ? `<ellipse cx="-25" cy="7" rx="7.5" ry="4.5" fill="#ff7f9c" opacity="${blush}"/><ellipse cx="25" cy="7" rx="7.5" ry="4.5" fill="#ff7f9c" opacity="${blush}"/>` : '';
  return ears + body + cheeks + EYES[eyes]() + MOUTH[mouth];
}
const place = (inner, x = 60, y = 74, s = 0.9) => `<g transform="translate(${x} ${y}) scale(${s})">${inner}</g>`;
const svg = inner => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">${inner}</svg>`;

export const STICKERS = [
  { id: 'love', ko: '사랑해', vi: 'Yêu', draw: () => place(char('a', 'heart', 'open')) + heart(18, 24, 1.1) + heart(100, 18, 1.4) + heart(104, 46, 0.8) },
  { id: 'hi', ko: '안녕', vi: 'Chào', draw: () => place(char('b', 'happy', 'open')) +
      `<ellipse cx="101" cy="54" rx="10" ry="12" fill="${SKIN.b}" stroke="${OUT}" stroke-width="3"/><path d="M110 34Q116 40 114 48M104 30Q112 34 113 40" stroke="${OUT}" stroke-width="2.4" fill="none" stroke-linecap="round"/>` },
  { id: 'hug', ko: '꼭 안아줘', vi: 'Ôm nè', draw: () => place(char('b', 'closed', 'smile'), 80, 80, 0.68) + place(char('a', 'closed', 'cat', { blush: 0.75 }), 40, 82, 0.68) + heart(60, 16, 1.3) + sparkle(28, 28, 0.8) + sparkle(96, 30, 0.7) },
  { id: 'kiss', ko: '쪽', vi: 'Chụt', draw: () => place(char('a', 'closed', 'kiss', { blush: 0.8 })) + heart(96, 62, 1.1) + heart(108, 42, 0.75) },
  { id: 'miss', ko: '보고 싶어', vi: 'Nhớ quá', draw: () => place(char('b', 'teary', 'wavy')) + heart(98, 30, 0.9, '#ffb3c4') + heart(22, 30, 0.6, '#ffb3c4') },
  { id: 'cry', ko: '엉엉', vi: 'Huhu', draw: () => place(char('a', 'cry', 'open', { blush: 0.3 })) +
      `<path d="M14 108Q30 100 46 108M74 108Q90 100 106 108" stroke="${BLUE}" stroke-width="4" fill="none" stroke-linecap="round"/>` },
  { id: 'angry', ko: '흥 화났어', vi: 'Giận rồi', draw: () => place(char('b', 'angry', 'frown', { blush: 0, puff: true })) +
      `<g transform="translate(98 24)" stroke="#ff3b3b" stroke-width="3.4" fill="none" stroke-linecap="round"><path d="M-9-3Q-3-3-3-9M3-9Q3-3 9-3M9 3Q3 3 3 9M-3 9Q-3 3-9 3"/></g>` },
  { id: 'lol', ko: 'ㅋㅋㅋ', vi: 'Haha', draw: () => place(char('a', 'happy', 'open')) + sparkle(16, 34, 1) + sparkle(104, 28, 1.2) + sparkle(106, 60, 0.7) },
  { id: 'night', ko: '잘 자', vi: 'Ngủ ngon', draw: () => place(char('b', 'closed', 'smile', { blush: 0.4 }), 54, 74) +
      `<path d="M96 14A14 14 0 1 0 110 34A11 11 0 1 1 96 14Z" fill="#ffd23f" stroke="${OUT}" stroke-width="2.4"/>` +
      `<text x="86" y="62" font-family="Arial Black,Arial,sans-serif" font-weight="900" font-size="16" fill="#8f86ff">Z</text><text x="98" y="50" font-family="Arial Black,Arial,sans-serif" font-weight="900" font-size="12" fill="#8f86ff">z</text>` },
  { id: 'eat', ko: '밥 먹자', vi: 'Ăn cơm', draw: () => place(char('a', 'happy', 'yum'), 60, 62, 0.78) +
      `<path d="M30 88H90Q88 112 60 112Q32 112 30 88Z" fill="#fff" stroke="${OUT}" stroke-width="3"/><path d="M34 98H86" stroke="${BLUE}" stroke-width="3"/>` +
      `<path d="M34 88Q38 76 50 80Q58 72 68 79Q80 75 86 88Z" fill="#fff" stroke="${OUT}" stroke-width="2.6"/><path d="M80 70L104 54M84 74L108 60" stroke="#b07a4a" stroke-width="3.4" stroke-linecap="round"/>` },
  { id: 'shy', ko: '부끄', vi: 'Ngại quá', draw: () => place(char('b', 'side', 'cat', { blush: 0.95 })) +
      `<path d="M26 66l6-3M30 72l6-3M84 66l6 3M82 72l6 3" stroke="#ff7f9c" stroke-width="2.4" stroke-linecap="round"/>` + heart(104, 28, 0.7) },
  { id: 'wink', ko: '찡긋', vi: 'Nháy mắt', draw: () => place(char('a', 'wink', 'smile')) + heart(100, 52, 0.9) + sparkle(92, 30, 0.9) },
  { id: 'what', ko: '응?', vi: 'Hả?', draw: () => place(char('b', 'dot', 'o', { blush: 0.4 })) +
      `<text x="88" y="38" font-family="Arial Black,Arial,sans-serif" font-weight="900" font-size="30" fill="#ff8a3d" stroke="${OUT}" stroke-width="1.4">?</text>` },
  { id: 'wow', ko: '헉!', vi: 'Trời!', draw: () => place(char('a', 'wide', 'o', { blush: 0.4 })) +
      `<text x="92" y="40" font-family="Arial Black,Arial,sans-serif" font-weight="900" font-size="30" fill="#ff3b5c" stroke="${OUT}" stroke-width="1.4">!</text><path d="M16 30l8 6M12 44l9 2" stroke="${OUT}" stroke-width="2.4" stroke-linecap="round"/>` },
  { id: 'flower', ko: '너한테 주는 꽃', vi: 'Tặng em', draw: () => place(char('b', 'happy', 'smile'), 50, 74) +
      `<path d="M98 102Q96 80 98 56" stroke="#4caf6a" stroke-width="3.4" fill="none"/><path d="M98 84Q108 76 112 80Q106 88 98 86Z" fill="#7fd18f" stroke="${OUT}" stroke-width="1.8"/>` +
      [0, 72, 144, 216, 288].map(a => `<ellipse cx="98" cy="40" rx="6" ry="9" fill="#ff8fb1" stroke="${OUT}" stroke-width="1.8" transform="rotate(${a} 98 48)"/>`).join('') +
      `<circle cx="98" cy="48" r="5" fill="#ffd23f" stroke="${OUT}" stroke-width="1.8"/>` },
  { id: 'sulk', ko: '삐짐', vi: 'Dỗi', draw: () => place(char('a', 'flat', 'pout', { puff: true, blush: 0.7 })) +
      `<path d="M14 40Q8 34 14 28M106 40Q112 34 106 28" stroke="${OUT}" stroke-width="2.4" fill="none" stroke-linecap="round"/>` },
  { id: 'proud', ko: '최고야', vi: 'Giỏi quá', draw: () => place(char('b', 'happy', 'open')) + sparkle(18, 26, 1.1) + sparkle(102, 22, 1.3) + sparkle(108, 56, 0.8, '#ff8fb1') + sparkle(12, 60, 0.7, '#7cc4ff') },
  { id: 'sorry', ko: '미안해', vi: 'Xin lỗi', draw: () => place(char('a', 'sad', 'wavy', { blush: 0.5 })) +
      `<path d="M100 26Q94 36 100 40Q106 36 100 26Z" fill="${BLUE}" stroke="${OUT}" stroke-width="1.6"/>` + heart(22, 30, 0.6, '#ffb3c4') }
];

export const stickerSvg = id => {
  const s = STICKERS.find(x => x.id === id);
  return s ? svg(s.draw()) : null;
};
export const stickerLabel = (id, lang) => {
  const s = STICKERS.find(x => x.id === id);
  return s ? s[lang] || s.ko : '';
};

// 텍스트에 넣는 이모지 (자주 쓰는 순)
export const EMOJI = {
  '💕': '❤️ 🥰 😍 😘 😚 💕 💖 💗 💓 💞 💘 💝 💋 🫶 💌 🌹 💐 🤍 🩷 💜'.split(' '),
  '😊': '😀 😄 😂 🤣 😊 😉 😌 😎 🤗 🥺 😢 😭 😤 😡 😳 🙈 😴 🤤 🤔 😮 😅 😇 🥳 🤭'.split(' '),
  '🍜': '🍜 🍚 🍲 🍣 🍗 🍕 🍔 🧋 ☕ 🍰 🎂 🍓 🍉 🥭 🍺 🎁 🎉 🌙 ⭐ 🌸 ✨ ☀️ 🌧️ ✈️'.split(' '),
  '👍': '👍 👏 🙏 ✌️ 🤞 👌 💪 🙌 👋 🤝 👀 💯 🔥 ✅ ❌ ⏰ 📸 🏠 🚗 🛵'.split(' ')
};
