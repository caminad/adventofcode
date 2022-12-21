import { assertEquals } from "testing/asserts.ts";
import { coordinates, mix, parse } from "./lib.ts";

const input = Deno.readTextFileSync(new URL("input.txt", import.meta.url));

Deno.test("parse", () => {
  assertEquals([...parse(` 1 2 -3 3 -2 0 4 `)], [1, 2, -3, 3, -2, 0, 4]);
});

Deno.test("mix", () => {
  assertEquals(mix([1, 2, -3, 3, -2, 0, 4].values()), [1, 2, -3, 4, 0, 3, -2]);
});

Deno.test("coordinates", () => {
  assertEquals(coordinates([1, 2, -3, 4, 0, 3, -2]), [4, -3, 2]);
});

Deno.test("part 1", () => {
  assertEquals(coordinates(mix(parse(input))).reduce((a, b) => a + b), 8302);
});
