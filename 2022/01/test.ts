import { assertEquals } from "testing/asserts.ts";
import { leaders, parse, sum } from "./lib.ts";

const input = Deno.readTextFileSync(new URL("input.txt", import.meta.url));

Deno.test("parse", () => {
  assertEquals(
    parse(`1000\n2000\n3000\n
4000\n
5000\n6000\n
7000\n8000\n9000\n
10000\n`),
    [
      [1000, 2000, 3000],
      [4000],
      [5000, 6000],
      [7000, 8000, 9000],
      [10000],
    ],
  );
});

Deno.test("sum", () => {
  assertEquals(sum([]), 0);
  assertEquals(sum([1, 2, 3]), 6);
});

Deno.test("leaders", () => {
  assertEquals(
    leaders([
      [1000, 2000, 3000],
      [4000],
      [5000, 6000],
      [7000, 8000, 9000],
      [10000],
    ]),
    [24000, 11000, 10000, 6000, 4000],
  );
});

Deno.test("part 1", () => {
  assertEquals(leaders(parse(input)).at(0), 70369);
});

Deno.test("part 2", () => {
  assertEquals(sum(leaders(parse(input)).slice(0, 3)), 203002);
});
