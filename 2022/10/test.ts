import { assertEquals } from "testing/asserts.ts";
import { parse, run, sample } from "./lib.ts";

const input = Deno.readTextFileSync(new URL("input.txt", import.meta.url));

const exampleInstructions = [
  15,
  -11,
  6,
  -3,
  5,
  -1,
  -8,
  13,
  4,
  null,
  -1,
  5,
  -1,
  5,
  -1,
  5,
  -1,
  5,
  -1,
  -35,
  1,
  24,
  -19,
  1,
  16,
  -11,
  null,
  null,
  21,
  -15,
  null,
  null,
  -3,
  9,
  1,
  -3,
  8,
  1,
  5,
  null,
  null,
  null,
  null,
  null,
  -36,
  null,
  1,
  7,
  null,
  null,
  null,
  2,
  6,
  null,
  null,
  null,
  null,
  null,
  1,
  null,
  null,
  7,
  1,
  null,
  -13,
  13,
  7,
  null,
  1,
  -33,
  null,
  null,
  null,
  2,
  null,
  null,
  null,
  8,
  null,
  -1,
  2,
  1,
  null,
  17,
  -9,
  1,
  1,
  -3,
  11,
  null,
  null,
  1,
  null,
  1,
  null,
  null,
  -13,
  -19,
  1,
  3,
  26,
  -30,
  12,
  -1,
  3,
  1,
  null,
  null,
  null,
  -9,
  18,
  1,
  2,
  null,
  null,
  9,
  null,
  null,
  null,
  -1,
  2,
  -37,
  1,
  3,
  null,
  15,
  -21,
  22,
  -6,
  1,
  null,
  2,
  1,
  null,
  -10,
  null,
  null,
  20,
  1,
  2,
  2,
  -6,
  -11,
  null,
  null,
  null,
];

Deno.test("parse", () => {
  assertEquals([...parse(`
    addx 15
    addx -11
    addx 6
    addx -3
    addx 5
    addx -1
    addx -8
    addx 13
    addx 4
    noop
    addx -1
    addx 5
    addx -1
    addx 5
    addx -1
    addx 5
    addx -1
    addx 5
    addx -1
    addx -35
    addx 1
    addx 24
    addx -19
    addx 1
    addx 16
    addx -11
    noop
    noop
    addx 21
    addx -15
    noop
    noop
    addx -3
    addx 9
    addx 1
    addx -3
    addx 8
    addx 1
    addx 5
    noop
    noop
    noop
    noop
    noop
    addx -36
    noop
    addx 1
    addx 7
    noop
    noop
    noop
    addx 2
    addx 6
    noop
    noop
    noop
    noop
    noop
    addx 1
    noop
    noop
    addx 7
    addx 1
    noop
    addx -13
    addx 13
    addx 7
    noop
    addx 1
    addx -33
    noop
    noop
    noop
    addx 2
    noop
    noop
    noop
    addx 8
    noop
    addx -1
    addx 2
    addx 1
    noop
    addx 17
    addx -9
    addx 1
    addx 1
    addx -3
    addx 11
    noop
    noop
    addx 1
    noop
    addx 1
    noop
    noop
    addx -13
    addx -19
    addx 1
    addx 3
    addx 26
    addx -30
    addx 12
    addx -1
    addx 3
    addx 1
    noop
    noop
    noop
    addx -9
    addx 18
    addx 1
    addx 2
    noop
    noop
    addx 9
    noop
    noop
    noop
    addx -1
    addx 2
    addx -37
    addx 1
    addx 3
    noop
    addx 15
    addx -21
    addx 22
    addx -6
    addx 1
    noop
    addx 2
    addx 1
    noop
    addx -10
    noop
    noop
    addx 20
    addx 1
    addx 2
    addx 2
    addx -6
    addx -11
    noop
    noop
    noop
  `)], exampleInstructions);
});

Deno.test("run", () => {
  const values = Array.from(run(1, exampleInstructions));
  assertEquals(values[20 - 1], 21);
  assertEquals(values[60 - 1], 19);
  assertEquals(values[100 - 1], 18);
  assertEquals(values[140 - 1], 21);
  assertEquals(values[180 - 1], 16);
  assertEquals(values[220 - 1], 18);
});

Deno.test("sample", () => {
  assertEquals(
    [...sample(run(1, exampleInstructions), {
      start: 20,
      step: 40,
    })],
    [420, 1140, 1800, 2940, 2880, 3960],
  );
});

Deno.test("part 1", () => {
  assertEquals(
    Array.from(sample(run(1, parse(input)), {
      start: 20,
      step: 40,
    })).reduce((a, b) => a + b),
    14340,
  );
});
