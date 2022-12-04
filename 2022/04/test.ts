import { assert, assertEquals, assertFalse } from "testing/asserts.ts";
import { covers, overlaps, parse } from "./lib.ts";

const input = Deno.readTextFileSync(new URL("input.txt", import.meta.url));

Deno.test("parse", () => {
  assertEquals(
    [...parse(`2-4,6-8 2-3,4-5 5-7,7-9 2-8,3-7 6-6,4-6 2-6,4-8`)],
    [
      [[2, 4], [6, 8]],
      [[2, 3], [4, 5]],
      [[5, 7], [7, 9]],
      [[2, 8], [3, 7]],
      [[6, 6], [4, 6]],
      [[2, 6], [4, 8]],
    ],
  );
});

Deno.test("covers", () => {
  assertFalse(covers([2, 4], [6, 8]));
  assertFalse(covers([2, 3], [4, 5]));
  assertFalse(covers([5, 7], [7, 9]));
  assert(covers([2, 8], [3, 7]));
  assertFalse(covers([6, 6], [4, 6]));
  assertFalse(covers([2, 6], [4, 8]));

  assertFalse(covers([6, 8], [2, 4]));
  assertFalse(covers([4, 5], [2, 3]));
  assertFalse(covers([7, 9], [5, 7]));
  assertFalse(covers([3, 7], [2, 8]));
  assert(covers([4, 6], [6, 6]));
  assertFalse(covers([4, 8], [2, 6]));
});

Deno.test("overlaps", () => {
  assertFalse(overlaps([2, 4], [6, 8]));
  assertFalse(overlaps([2, 3], [4, 5]));
  assert(overlaps([5, 7], [7, 9]));
  assert(overlaps([2, 8], [3, 7]));
  assert(overlaps([6, 6], [4, 6]));
  assert(overlaps([2, 6], [4, 8]));
});

Deno.test("part 1", () => {
  let count = 0;
  for (const [a, b] of parse(input)) {
    if (covers(a, b) || covers(b, a)) {
      count++;
    }
  }
  assertEquals(count, 477);
});

Deno.test("part 2", () => {
  let count = 0;
  for (const [a, b] of parse(input)) {
    if (overlaps(a, b)) {
      count++;
    }
  }
  assertEquals(count, 830);
});
