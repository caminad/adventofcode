import { assert, assertEquals, assertFalse } from "testing/asserts.ts";
import { ordered, Packet, parse } from "./lib.ts";

const input = Deno.readTextFileSync(new URL("input.txt", import.meta.url));

Deno.test("Packet", () => {
  assertEquals(Packet(1), [1]);
  assertEquals(Packet([1]), [1]);
  assertEquals(Packet([1, 2, 3]), [1, 2, 3]);
});

Deno.test("parse", () => {
  assertEquals<[Packet, Packet][]>([...parse(`
    [1,1,3,1,1]
    [1,1,5,1,1]

    [[1],[2,3,4]]
    [[1],4]

    [9]
    [[8,7,6]]

    [[4,4],4,4]
    [[4,4],4,4,4]

    [7,7,7,7]
    [7,7,7]

    []
    [3]

    [[[]]]
    [[]]

    [1,[2,[3,[4,[5,6,7]]]],8,9]
    [1,[2,[3,[4,[5,6,0]]]],8,9]
  `)], [
    [
      [1, 1, 3, 1, 1],
      [1, 1, 5, 1, 1],
    ],
    [
      [[1], [2, 3, 4]],
      [[1], 4],
    ],
    [
      [9],
      [[8, 7, 6]],
    ],
    [
      [[4, 4], 4, 4],
      [[4, 4], 4, 4, 4],
    ],
    [
      [7, 7, 7, 7],
      [7, 7, 7],
    ],
    [
      [],
      [3],
    ],
    [
      [[[]]],
      [[]],
    ],
    [
      [1, [2, [3, [4, [5, 6, 7]]]], 8, 9],
      [1, [2, [3, [4, [5, 6, 0]]]], 8, 9],
    ],
  ]);
});

Deno.test("ordered", () => {
  assert(
    ordered([1, 1, 3, 1, 1], [1, 1, 5, 1, 1]),
    "pair 1",
  );
  assert(
    ordered([[1], [2, 3, 4]], [[1], 4]),
    "pair 2",
  );
  assertFalse(
    ordered([9], [[8, 7, 6]]),
    "pair 3",
  );
  assert(
    ordered([[4, 4], 4, 4], [[4, 4], 4, 4, 4]),
    "pair 4",
  );
  assertFalse(
    ordered([7, 7, 7, 7], [7, 7, 7]),
    "pair 5",
  );
  assert(
    ordered([], [3]),
    "pair 6",
  );
  assertFalse(
    ordered([[[]]], [[]]),
    "pair 7",
  );
  assertFalse(
    ordered(
      [1, [2, [3, [4, [5, 6, 7]]]], 8, 9],
      [1, [2, [3, [4, [5, 6, 0]]]], 8, 9],
    ),
    "pair 8",
  );
});

Deno.test("part 1", () => {
  let index = 0;
  let sum = 0;
  for (const [a, b] of parse(input)) {
    index += 1;
    if (ordered(a, b)) {
      sum += index;
    }
  }
  assertEquals(sum, 5882);
});
