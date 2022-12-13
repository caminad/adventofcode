export type Packet = ReadonlyArray<PacketValue>;
export type PacketValue = Packet | number;
export function Packet(value: PacketValue): Packet {
  return Array.isArray(value) ? value : [value];
}

export function* parse(input: string): IterableIterator<[Packet, Packet]> {
  let prev: string | undefined;
  for (const [curr] of input.matchAll(/[\[\d,\]]+/g)) {
    if (prev === undefined) {
      prev = curr;
    } else {
      yield [JSON.parse(prev), JSON.parse(curr)];
      prev = undefined;
    }
  }
}

function* zipLongest<T, U>(
  a: readonly T[],
  b: readonly U[],
): IterableIterator<[T, U]> {
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    yield [a[i], b[i]];
  }
}

export function cmp(a: PacketValue, b: PacketValue): number {
  if (typeof a === "number" && typeof b === "number") {
    return Math.sign(a - b);
  }
  for (const [p, q] of zipLongest(Packet(a), Packet(b))) {
    if (q === undefined) {
      return 1;
    }
    if (p === undefined) {
      return -1;
    }
    const c = cmp(p, q);
    if (c !== 0) {
      return c;
    }
  }
  return 0;
}

export function ordered(a: Packet, b: Packet): boolean {
  return cmp(a, b) <= 0;
}
