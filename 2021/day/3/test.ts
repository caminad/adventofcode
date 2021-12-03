import { assertEquals } from "https://deno.land/std@0.116.0/testing/asserts.ts";
import {
  Bit,
  bitsToNumber,
  countColBits,
  findCO2ScrubberRating,
  findOxygenGeneratorRating,
  getEpsilonRate,
  getGammaRate,
  getLifeSupportRating,
  getPowerConsumption,
  parseDiagnostics,
} from "./mod.ts";

const exampleInput = `
00100
11110
10110
10111
10101
01111
00111
11100
10000
11001
00010
01010
`;
const input = await Deno.readTextFile(new URL("./input.txt", import.meta.url));

const exampleParsedInput: Bit[][] = [
  [0, 0, 1, 0, 0],
  [1, 1, 1, 1, 0],
  [1, 0, 1, 1, 0],
  [1, 0, 1, 1, 1],
  [1, 0, 1, 0, 1],
  [0, 1, 1, 1, 1],
  [0, 0, 1, 1, 1],
  [1, 1, 1, 0, 0],
  [1, 0, 0, 0, 0],
  [1, 1, 0, 0, 1],
  [0, 0, 0, 1, 0],
  [0, 1, 0, 1, 0],
];

Deno.test("parseDiagnostics", () => {
  assertEquals(parseDiagnostics(exampleInput), exampleParsedInput);
});

Deno.test("countColBits", () => {
  assertEquals(countColBits(exampleParsedInput, 0), { 0: 5, 1: 7 });
  assertEquals(countColBits(exampleParsedInput, 1), { 0: 7, 1: 5 });
  assertEquals(countColBits(exampleParsedInput, 2), { 0: 4, 1: 8 });
  assertEquals(countColBits(exampleParsedInput, 3), { 0: 5, 1: 7 });
  assertEquals(countColBits(exampleParsedInput, 4), { 0: 7, 1: 5 });
});

Deno.test("bitsToNumber", () => {
  assertEquals(bitsToNumber([1, 0, 1, 1, 0]), 0b10110);
});

Deno.test("getGammaRate", () => {
  assertEquals(getGammaRate(exampleParsedInput), 0b10110);
});

Deno.test("getEpsilonRate", () => {
  assertEquals(getEpsilonRate(exampleParsedInput), 0b01001);
});

Deno.test("getPowerConsumption", () => {
  assertEquals(getPowerConsumption(exampleParsedInput), 198);
});

Deno.test("findOxygenGeneratorRating", () => {
  assertEquals(findOxygenGeneratorRating(exampleParsedInput), 0b10111);
});

Deno.test("findCO2ScrubberRating", () => {
  assertEquals(findCO2ScrubberRating(exampleParsedInput), 0b01010);
});

Deno.test("getLifeSupportRating", () => {
  assertEquals(getLifeSupportRating(exampleParsedInput), 230);
});

Deno.test("part 1", () => {
  const diagnostics = parseDiagnostics(input);
  assertEquals(getPowerConsumption(diagnostics), 4191876);
});

Deno.test("part 2", () => {
  const diagnostics = parseDiagnostics(input);
  assertEquals(getLifeSupportRating(diagnostics), 3414905);
});
