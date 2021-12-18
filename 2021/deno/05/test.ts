import { assertEquals } from "https://deno.land/std@0.117.0/testing/asserts.ts";
import { DensityMap, Line, parseInput } from "./mod.ts";

const dedent: typeof String.raw = (...args) => {
  return String.raw(...args).replace(/^ +/gm, "").trim();
};

const input = await Deno.readTextFile(new URL("input.txt", import.meta.url));

const exampleInput = dedent`
  0,9 -> 5,9
  8,0 -> 0,8
  9,4 -> 3,4
  2,2 -> 2,1
  7,0 -> 7,4
  6,4 -> 2,0
  0,9 -> 2,9
  3,4 -> 1,4
  0,0 -> 8,8
  5,5 -> 8,2
`;
const exampleParsedInput: readonly Line[] = [
  [{ x: 0, y: 9 }, { x: 5, y: 9 }],
  [{ x: 8, y: 0 }, { x: 0, y: 8 }],
  [{ x: 9, y: 4 }, { x: 3, y: 4 }],
  [{ x: 2, y: 2 }, { x: 2, y: 1 }],
  [{ x: 7, y: 0 }, { x: 7, y: 4 }],
  [{ x: 6, y: 4 }, { x: 2, y: 0 }],
  [{ x: 0, y: 9 }, { x: 2, y: 9 }],
  [{ x: 3, y: 4 }, { x: 1, y: 4 }],
  [{ x: 0, y: 0 }, { x: 8, y: 8 }],
  [{ x: 5, y: 5 }, { x: 8, y: 2 }],
];
const exampleSimpleDisplayOutput = dedent`
  .......1..
  ..1....1..
  ..1....1..
  .......1..
  .112111211
  ..........
  ..........
  ..........
  ..........
  222111....
`;
const exampleComplexDisplayOutput = dedent`
  1.1....11.
  .111...2..
  ..2.1.111.
  ...1.2.2..
  .112313211
  ...1.2....
  ..1...1...
  .1.....1..
  1.......1.
  222111....
`;

Deno.test("parseInput", () => {
  assertEquals([...parseInput(exampleInput)], exampleParsedInput);
});

Deno.test("DensityMap", () => {
  assertEquals(new DensityMap().toString(), "");
});

Deno.test("DensityMap.prototype.inc", () => {
  assertEquals(new DensityMap().inc(0, 0).toString(), "1");
  assertEquals(new DensityMap().inc(0, 0).inc(0, 0).toString(), "2");
  assertEquals(new DensityMap().inc(1, 1).inc(2, 0).toString(), "..1\n.1.");
});

Deno.test("DensityMap.prototype.plot", () => {
  assertEquals(
    new DensityMap()
      .plot({ x: 1, y: 3 }, { x: 3, y: 3 })
      .plot({ x: 2, y: 0 }, { x: 2, y: 4 })
      .toString(),
    dedent`
      ..1.
      ..1.
      ..1.
      .121
      ..1.
    `,
  );
});

Deno.test("DensityMap.create (simple)", () => {
  const filtered = exampleParsedInput.filter((l) =>
    l[0].x === l[1].x || l[0].y === l[1].y
  );
  const map = DensityMap.create(...filtered);
  assertEquals(map.toString(), exampleSimpleDisplayOutput);
});

Deno.test("DensityMap.create (complex)", () => {
  const map = DensityMap.create(...exampleParsedInput);
  assertEquals(map.toString(), exampleComplexDisplayOutput);
});

Deno.test("DensityMap.prototype.crossings", () => {
  const filtered = exampleParsedInput.filter((l) =>
    l[0].x === l[1].x || l[0].y === l[1].y
  );
  assertEquals(DensityMap.create(...filtered).crossings, 5);
  assertEquals(DensityMap.create(...exampleParsedInput).crossings, 12);
});

Deno.test("part 1", () => {
  const filtered = [...parseInput(input)].filter((l) =>
    l[0].x === l[1].x || l[0].y === l[1].y
  );
  assertEquals(DensityMap.create(...filtered).crossings, 5690);
});

Deno.test("part 2", () => {
  assertEquals(DensityMap.create(...parseInput(input)).crossings, 17741);
});
