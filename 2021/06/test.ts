import { assertEquals } from "https://deno.land/std@0.117.0/testing/asserts.ts";
import { parseInput, simulate } from "./mod.ts";

const input = await Deno.readTextFile(new URL("input.txt", import.meta.url));

const exampleInput = `3,4,3,1,2`;
const exampleParsedInput = [3, 4, 3, 1, 2];

Deno.test("parseInput", () => {
  assertEquals(parseInput(exampleInput), exampleParsedInput);
});

Deno.test("after 5 days", () => {
  assertEquals(simulate(exampleParsedInput, 5), 10);
});

Deno.test("after 18 days", () => {
  assertEquals(simulate(exampleParsedInput, 18), 26);
});

Deno.test("after 80 days", () => {
  assertEquals(simulate(exampleParsedInput, 80), 5934);
});

Deno.test("after 256 days", () => {
  assertEquals(simulate(exampleParsedInput, 256), 26984457539);
});

Deno.test("part 1", () => {
  assertEquals(simulate(parseInput(input), 80), 359344);
});

Deno.test("part 2", () => {
  assertEquals(simulate(parseInput(input), 256), 1629570219571);
});
