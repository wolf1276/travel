// Deterministic tiny "handmade" tilt for polaroid-style cards, derived from
// an id so it's stable across renders/hydration (no Math.random mismatch).
export function tiltForId(id: string, maxDeg = 2.2): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  const normalized = (hash % 200) / 100 - 1; // -1..1
  return normalized * maxDeg;
}
