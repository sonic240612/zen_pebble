export function generateSeed(userId?: string): number {
  const base = userId ? stringToHash(userId) : Math.floor(Math.random() * 2147483647);
  const timestamp = Date.now();
  return Math.abs(base ^ (timestamp & 0x7fffffff)) % 2147483647;
}

function stringToHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}
