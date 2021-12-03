import { assertEquals } from "https://deno.land/std@0.116.0/testing/asserts.ts";
import {
  countBits,
  getBitIndexes,
  getMajorityBits,
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

Deno.test("parseDiagnostics", () => {
  assertEquals(
    parseDiagnostics(exampleInput),
    [
      0b00100,
      0b11110,
      0b10110,
      0b10111,
      0b10101,
      0b01111,
      0b00111,
      0b11100,
      0b10000,
      0b11001,
      0b00010,
      0b01010,
    ],
  );
});

Deno.test("getBitIndexes", () => {
  assertEquals([...getBitIndexes(0b10110)], [1, 2, 4]);
});

Deno.test("countBits", () => {
  assertEquals(
    countBits([
      0b00100,
      0b11110,
      0b10110,
      0b10111,
      0b10101,
      0b01111,
      0b00111,
      0b11100,
      0b10000,
      0b11001,
      0b00010,
      0b01010,
    ]),
    new Map([[0, 5], [1, 7], [2, 8], [3, 5], [4, 7]]),
  );
});

Deno.test("getMajorityBits", () => {
  assertEquals(
    getMajorityBits(12, new Map([[0, 5], [1, 7], [2, 8], [3, 5], [4, 7]])),
    { 0: 0b01001, 1: 0b10110 },
  );
});

Deno.test("part 1 example", () => {
  const diagnostics = parseDiagnostics(exampleInput);
  const powerConsumption = getPowerConsumption(diagnostics);
  assertEquals(powerConsumption, 198);
});

Deno.test("part 1", () => {
  const diagnostics = parseDiagnostics(input);
  const powerConsumption = getPowerConsumption(diagnostics);
  assertEquals(powerConsumption, 4191876);
});
