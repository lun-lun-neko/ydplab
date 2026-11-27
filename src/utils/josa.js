const HANGUL_START = 0xac00;
const HANGUL_END = 0xd7a3;

const hasBatchim = (word) => {
  const code = word.charCodeAt(word.length - 1);
  if (code < HANGUL_START || code > HANGUL_END) return false;
  return (code - HANGUL_START) % 28 !== 0;
};

// "펭귄은", "돌고래는"
export const withTopic = (word) => `${word}${hasBatchim(word) ? "은" : "는"}`;
