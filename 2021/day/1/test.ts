import { assertEquals } from "https://deno.land/std@0.116.0/testing/asserts.ts";
import { countIncreases, eachWindow, parseInput, sum } from "./mod.ts";

const input = await Deno.readTextFile(new URL("./input.txt", import.meta.url));

Deno.test("parseInput", () => {
  assertEquals<number[]>(
    parseInput("199\n200\n208\n210\n200\n207\n240\n269\n260\n263\n"),
    [199, 200, 208, 210, 200, 207, 240, 269, 260, 263],
  );
});

Deno.test("eachWindow", () => {
  assertEquals([...eachWindow("", 2)], []);
  assertEquals([...eachWindow("a", 2)], []);
  assertEquals([...eachWindow("ab", 2)], [["a", "b"]]);
  assertEquals([...eachWindow("abc", 2)], [["a", "b"], ["b", "c"]]);
});

Deno.test("sum", () => {
  assertEquals(sum([]), 0);
  assertEquals(sum([2]), 2);
  assertEquals(sum([2, 4]), 6);
  assertEquals(sum([2, 4, 6]), 12);
});

Deno.test("part 1 example", () => {
  assertEquals(
    countIncreases([199, 200, 208, 210, 200, 207, 240, 269, 260, 263]),
    7,
  );
});

Deno.test("part 1", () => {
  assertEquals(countIncreases(parseInput(input)), 1233);
});

Deno.test("part 2 example", () => {
  const sums = Array.from(
    eachWindow([199, 200, 208, 210, 200, 207, 240, 269, 260, 263], 3),
    sum,
  );
  assertEquals(countIncreases(sums), 5);
});

Deno.test("part 2", () => {
  const sums = Array.from(eachWindow(parseInput(input), 3), sum);
  assertEquals(countIncreases(sums), 1275);
});
