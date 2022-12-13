export type PacketValue = Packet | number;
export type Packet = ReadonlyArray<PacketValue>;
export function Packet(value: PacketValue): Packet {
  return Array.isArray(value) ? value : [value];
}

export function* parse(input: string): IterableIterator<Packet> {
  for (const [text] of input.matchAll(/\[[\[\d,\]]+/g)) {
    yield JSON.parse(text);
  }
}

export function* pairs<T>(iter: Iterable<T>): IterableIterator<[T, T]> {
  let prev: T | undefined;
  for (const curr of iter) {
    if (prev === undefined) {
      prev = curr;
    } else {
      yield [prev, curr];
      prev = undefined;
    }
  }
}

function* zipLongest<T, U>(
  a: readonly T[],
  b: readonly U[],
): IterableIterator<[T | undefined, U | undefined]> {
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    yield [a.at(i), b.at(i)];
  }
}

export function cmp(a: PacketValue, b: PacketValue): number {
  if (typeof a === "number" && typeof b === "number") {
    return Math.sign(a - b);
  }
  for (const [p, q] of zipLongest(Packet(a), Packet(b))) {
    if (p === undefined) {
      return -1;
    }
    if (q === undefined) {
      return 1;
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

export function decoderKey(packets: Iterable<Packet>): number {
  const dividers = [[[2]], [[6]]] as const;
  const sorted = [...dividers, ...packets].sort(cmp);
  return (sorted.indexOf(dividers[0]) + 1) * (sorted.indexOf(dividers[1]) + 1);
}
