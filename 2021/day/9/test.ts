import { assertEquals } from "https://deno.land/std@0.117.0/testing/asserts.ts";
import { Heightmap } from "./mod.ts";

const input = await Deno.readTextFile(new URL("input.txt", import.meta.url));

const exampleInput = `
2199943210
3987894921
9856789892
8767896789
9899965678
`;
const exampleParsedInput: unknown = [
  [2, 1, 9, 9, 9, 4, 3, 2, 1, 0],
  [3, 9, 8, 7, 8, 9, 4, 9, 2, 1],
  [9, 8, 5, 6, 7, 8, 9, 8, 9, 2],
  [8, 7, 6, 7, 8, 9, 6, 7, 8, 9],
  [9, 8, 9, 9, 9, 6, 5, 6, 7, 8],
];

Deno.test("Heightmap.parse", () => {
  assertEquals([...Heightmap.parse(exampleInput)], exampleParsedInput);
});

Deno.test("Heightmap.prototype.getLowPoints", () => {
  assertEquals([...Heightmap.parse(exampleInput).getLowPoints()], [1, 0, 5, 5]);
});

Deno.test("Heightmap.prototype.getRiskLevel", () => {
  assertEquals(Heightmap.parse(exampleInput).getRiskLevel(), 15);
});

Deno.test("part 1", () => {
  assertEquals(Heightmap.parse(input).getRiskLevel(), 594);
});
