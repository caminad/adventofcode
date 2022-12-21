import { assertEquals } from "testing/asserts.ts";
import { coordinates, decrypt, parse } from "./lib.ts";

const input = Deno.readTextFileSync(new URL("input.txt", import.meta.url));

Deno.test("parse", () => {
  assertEquals([...parse(` 1 2 -3 3 -2 0 4 `)], [1, 2, -3, 3, -2, 0, 4]);
});

Deno.test("decrypt", () => {
  assertEquals(
    decrypt([1, 2, -3, 3, -2, 0, 4].values(), {
      multiplier: 1,
      passes: 1,
    }),
    [1, 2, -3, 4, 0, 3, -2],
  );
  assertEquals(
    decrypt([1, 2, -3, 3, -2, 0, 4].values(), {
      multiplier: 811589153,
      passes: 10,
    }),
    [
      0,
      -2434767459,
      1623178306,
      3246356612,
      -1623178306,
      2434767459,
      811589153,
    ],
  );
});

Deno.test("coordinates", () => {
  assertEquals(coordinates([1, 2, -3, 4, 0, 3, -2]), [4, -3, 2]);
  assertEquals(
    coordinates(
      [
        0,
        -2434767459,
        1623178306,
        3246356612,
        -1623178306,
        2434767459,
        811589153,
      ],
    ),
    [811589153, 2434767459, -1623178306],
  );
});

Deno.test("part 1", () => {
  const [a, b, c] = coordinates(decrypt(parse(input), {
    multiplier: 1,
    passes: 1,
  }));
  assertEquals(a + b + c, 8302);
});

Deno.test("part 2", () => {
  const [a, b, c] = coordinates(decrypt(parse(input), {
    multiplier: 811589153,
    passes: 10,
  }));
  assertEquals(a + b + c, 656575624777);
});
