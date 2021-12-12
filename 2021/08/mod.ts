interface Entry {
  readonly signalPatterns: readonly string[];
  readonly outputValue: readonly string[];
}

export function* parseInput(input: string): IterableIterator<Entry> {
  for (const m of input.matchAll(/^(.*?) \| (.*?)$/gm)) {
    yield {
      signalPatterns: m[1].match(/[a-g]+/g)!,
      outputValue: m[2].match(/[a-g]+/g)!,
    };
  }
}

/**
 * ```
 *   0:      1:      2:      3:      4:
 *  aaaa    ....    aaaa    aaaa    ....
 * b    c  .    c  .    c  .    c  b    c
 * b    c  .    c  .    c  .    c  b    c
 *  ....    ....    dddd    dddd    dddd
 * e    f  .    f  e    .  .    f  .    f
 * e    f  .    f  e    .  .    f  .    f
 *  gggg    ....    gggg    gggg    ....
 *
 *   5:      6:      7:      8:      9:
 *  aaaa    aaaa    aaaa    aaaa    aaaa
 * b    .  b    .  .    c  b    c  b    c
 * b    .  b    .  .    c  b    c  b    c
 *  dddd    dddd    ....    dddd    dddd
 * .    f  e    f  .    f  e    f  .    f
 * .    f  e    f  .    f  e    f  .    f
 *  gggg    gggg    ....    gggg    gggg
 * ```
 */
const digitSegments = [
  /* 0 */ "abcefg",
  /* 1 */ "cf",
  /* 2 */ "acdeg",
  /* 3 */ "acdfg",
  /* 4 */ "bcdf",
  /* 5 */ "abdfg",
  /* 6 */ "abdefg",
  /* 7 */ "acf",
  /* 8 */ "abcdefg",
  /* 9 */ "abcdfg",
] as const;

const digitsBySegmentCount = new Map<number, number[]>();
for (const [digit, segments] of digitSegments.entries()) {
  let digits = digitsBySegmentCount.get(segments.length);
  if (!digits) {
    digitsBySegmentCount.set(segments.length, digits = []);
  }
  digits.push(digit);
}
function getPossibleDigits(display: string) {
  return digitsBySegmentCount.get(display.length) ?? [];
}

export function countUniqueDigits(entries: Iterable<Entry>) {
  let count = 0;
  for (const entry of entries) {
    for (const display of entry.outputValue) {
      if (getPossibleDigits(display).length === 1) count++;
    }
  }
  return count;
}
