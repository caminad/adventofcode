import { assertEquals } from "testing/asserts.ts";
import { move, parse, sequence } from "./lib.ts";

const input = Deno.readTextFileSync(new URL("input.txt", import.meta.url));

Deno.test("parse", () => {
  assertEquals([...parse(`
    R 4
    U 4
    L 3
    D 1
    R 4
    D 1
    L 5
    R 2
  `)], [
    ["R", 4],
    ["U", 4],
    ["L", 3],
    ["D", 1],
    ["R", 4],
    ["D", 1],
    ["L", 5],
    ["R", 2],
  ]);
});

Deno.test("move", () => {
  assertEquals(
    move({ head: [2, 1], tail: [1, 1] }, "R"),
    { head: [3, 1], tail: [2, 1] },
  );
  assertEquals(
    move({ head: [1, 2], tail: [1, 3] }, "D"),
    { head: [1, 1], tail: [1, 2] },
  );
  assertEquals(
    move({ head: [2, 2], tail: [1, 1] }, "U"),
    { head: [2, 3], tail: [2, 2] },
  );
  assertEquals(
    move({ head: [2, 2], tail: [1, 1] }, "R"),
    { head: [3, 2], tail: [2, 2] },
  );
});

Deno.test("sequence", () => {
  const seq = sequence([
    ["R", 4],
    ["U", 4],
    ["L", 3],
    ["D", 1],
    ["R", 4],
    ["D", 1],
    ["L", 5],
    ["R", 2],
  ]);

  // R 4
  assertEquals(seq.next().value, { head: [1, 0], tail: [0, 0] });
  assertEquals(seq.next().value, { head: [2, 0], tail: [1, 0] });
  assertEquals(seq.next().value, { head: [3, 0], tail: [2, 0] });
  assertEquals(seq.next().value, { head: [4, 0], tail: [3, 0] });
  // U 4
  assertEquals(seq.next().value, { head: [4, 1], tail: [3, 0] });
  assertEquals(seq.next().value, { head: [4, 2], tail: [4, 1] });
  assertEquals(seq.next().value, { head: [4, 3], tail: [4, 2] });
  assertEquals(seq.next().value, { head: [4, 4], tail: [4, 3] });
  // L 3
  assertEquals(seq.next().value, { head: [3, 4], tail: [4, 3] });
  assertEquals(seq.next().value, { head: [2, 4], tail: [3, 4] });
  assertEquals(seq.next().value, { head: [1, 4], tail: [2, 4] });
  // D 1
  assertEquals(seq.next().value, { head: [1, 3], tail: [2, 4] });
  // R 4
  assertEquals(seq.next().value, { head: [2, 3], tail: [2, 4] });
  assertEquals(seq.next().value, { head: [3, 3], tail: [2, 4] });
  assertEquals(seq.next().value, { head: [4, 3], tail: [3, 3] });
  assertEquals(seq.next().value, { head: [5, 3], tail: [4, 3] });
  // D 1
  assertEquals(seq.next().value, { head: [5, 2], tail: [4, 3] });
  // L 5
  assertEquals(seq.next().value, { head: [4, 2], tail: [4, 3] });
  assertEquals(seq.next().value, { head: [3, 2], tail: [4, 3] });
  assertEquals(seq.next().value, { head: [2, 2], tail: [3, 2] });
  assertEquals(seq.next().value, { head: [1, 2], tail: [2, 2] });
  assertEquals(seq.next().value, { head: [0, 2], tail: [1, 2] });
  // R 2
  assertEquals(seq.next().value, { head: [1, 2], tail: [1, 2] });
  assertEquals(seq.next().value, { head: [2, 2], tail: [1, 2] });
  // end
  assertEquals(seq.next().done, true);
});

Deno.test("part 1", () => {
  const positions = new Set<string>();
  for (const { tail } of sequence(parse(input))) {
    positions.add(tail.join(","));
  }
  assertEquals(positions.size, 6236);
});
