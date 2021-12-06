import { assertEquals } from "https://deno.land/std@0.117.0/testing/asserts.ts";
import { parseInput, simulate } from "./mod.ts";

const input = await Deno.readTextFile(new URL("input.txt", import.meta.url));

const exampleInput = `3,4,3,1,2`;
const exampleParsedInput = [3, 4, 3, 1, 2];

Deno.test("parseInput", () => {
  assertEquals(parseInput(exampleInput), exampleParsedInput);
});

Deno.test("after 5 days", () => {
  const state = [...exampleParsedInput];
  simulate(state, 5);
  assertEquals(state, [5, 6, 5, 3, 4, 5, 6, 7, 7, 8]);
});

Deno.test("after 18 days", () => {
  const [...state] = [...exampleParsedInput];
  simulate(state, 18);
  assertEquals(state.length, 26);
});

Deno.test("after 80 days", () => {
  const [...state] = [...exampleParsedInput];
  simulate(state, 80);
  assertEquals(state.length, 5934);
});

Deno.test("part 1", () => {
  const [...state] = parseInput(input);
  simulate(state, 80);
  assertEquals(state.length, 359344);
});
