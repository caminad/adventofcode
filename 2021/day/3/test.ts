import { assertEquals } from "https://deno.land/std@0.116.0/testing/asserts.ts";
import {
  bitsToNumber,
  getHighBitCols,
  getRates,
  invertBits,
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
  const diagnostics = parseDiagnostics(exampleInput);
  assertEquals(diagnostics, [
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
  ]);
});

Deno.test("getHighBitCols", () => {
  assertEquals(
    getHighBitCols([
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
    ]),
    [1, 0, 1, 1, 0],
  );
});

Deno.test("invertBits", () => {
  assertEquals(invertBits([1, 0, 1, 1, 0]), [0, 1, 0, 0, 1]);
});

Deno.test("bitsToNumber", () => {
  assertEquals(bitsToNumber([1, 0, 1, 1, 0]), 0b10110);
});

Deno.test("part 1 example", () => {
  const diagnostics = parseDiagnostics(exampleInput);
  const rates = getRates(diagnostics);
  assertEquals(rates.gamma, 0b10110);
  assertEquals(rates.epsilon, 0b01001);
  assertEquals(rates.gamma * rates.epsilon, 198);
});

Deno.test("part 1", () => {
  const diagnostics = parseDiagnostics(input);
  const rates = getRates(diagnostics);
  assertEquals(rates.gamma * rates.epsilon, 4191876);
});
