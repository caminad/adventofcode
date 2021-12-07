import { assertEquals } from "https://deno.land/std@0.117.0/testing/asserts.ts";
import { findCheapestDestination, getCost, parseInput } from "./mod.ts";

const input = await Deno.readTextFile(new URL("input.txt", import.meta.url));

const exampleInput = `16,1,2,0,4,2,7,1,2,14`;
const exampleParsedInput = [16, 1, 2, 0, 4, 2, 7, 1, 2, 14];

Deno.test("parseInput", () => {
  assertEquals(parseInput(exampleInput), exampleParsedInput);
});

Deno.test("getCost", () => {
  assertEquals(getCost(exampleParsedInput, 1), 41);
  assertEquals(getCost(exampleParsedInput, 2), 37);
  assertEquals(getCost(exampleParsedInput, 3), 39);
  assertEquals(getCost(exampleParsedInput, 10), 71);
});

Deno.test("findCheapestDestination", () => {
  assertEquals(findCheapestDestination(exampleParsedInput), [2, 37]);
});

Deno.test("part 1", () => {
  assertEquals(findCheapestDestination(parseInput(input))[1], 335330);
});
