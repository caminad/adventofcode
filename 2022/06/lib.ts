export function findStartOfPacket(input: string): number {
  return [...input].findIndex((_, i, a) => {
    return new Set(a.slice(i - 4, i)).size === 4;
  });
}
