import { assertEquals } from "testing/asserts.ts";
import { CoordSet, parse } from "./lib.ts";

const input = Deno.readTextFileSync(new URL("input.txt", import.meta.url));

Deno.test("parse", () => {
  assertEquals([...parse(`
    498,4 -> 498,6 -> 496,6
    503,4 -> 502,4 -> 502,9 -> 494,9
  `)], [
    [
      [498n, 4n],
      [498n, 6n],
      [496n, 6n],
    ],
    [
      [503n, 4n],
      [502n, 4n],
      [502n, 9n],
      [494n, 9n],
    ],
  ]);
});

Deno.test("CoordSet", () => {
  const cs = new CoordSet([
    [
      [498n, 4n],
      [498n, 6n],
      [496n, 6n],
    ],
    [
      [503n, 4n],
      [502n, 4n],
      [502n, 9n],
      [494n, 9n],
    ],
  ]);
  assertEquals([...cs.render({
    limits: [[494n, 0n], [503n, 9n]],
  })], [
    "..........",
    "..........",
    "..........",
    "..........",
    "....#...##",
    "....#...#.",
    "..###...#.",
    "........#.",
    "........#.",
    "#########.",
  ]);
});
