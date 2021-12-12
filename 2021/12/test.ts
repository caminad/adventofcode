import { assertEquals } from "https://deno.land/std@0.117.0/testing/asserts.ts";
import { Cave } from "./mod.ts";

const input = await Deno.readTextFile(new URL("input.txt", import.meta.url));

const exampleInput = `
start-A
start-b
A-c
A-b
b-d
A-end
b-end
`;

Deno.test("Cave.parse", () => {
  assertEquals(
    Array.from(
      Cave.parse(exampleInput).allConnections(),
      (caves) => caves.map(String),
    ),
    [
      ["start", "A"],
      ["start", "b"],
      ["A", "c"],
      ["A", "b"],
      ["A", "end"],
      ["b", "d"],
      ["b", "end"],
    ],
  );
});

Deno.test("Cave.prototype.path", () => {
  assertEquals(
    Array.from(Cave.parse(exampleInput).path(), String).sort(),
    [
      `start,A,b,A,c,A,end`,
      `start,A,b,A,end`,
      `start,A,b,end`,
      `start,A,c,A,b,A,end`,
      `start,A,c,A,b,end`,
      `start,A,c,A,end`,
      `start,A,end`,
      `start,b,A,c,A,end`,
      `start,b,A,end`,
      `start,b,end`,
    ],
  );
  assertEquals(
    Array.from(
      Cave.parse(
        `fs-end he-DX fs-he start-DX pj-DX end-zg zg-sl zg-pj pj-he RW-he fs-DX pj-RW zg-RW start-pj he-WI zg-he pj-fs start-RW`,
      ).path(),
    ).length,
    226,
  );
});

Deno.test("Cave.prototype.path with revisits", () => {
  assertEquals(
    Array.from(Cave.parse(exampleInput).path(1), String).sort(),
    [
      `start,A,b,A,b,A,c,A,end`,
      `start,A,b,A,b,A,end`,
      `start,A,b,A,b,end`,
      `start,A,b,A,c,A,b,A,end`,
      `start,A,b,A,c,A,b,end`,
      `start,A,b,A,c,A,c,A,end`,
      `start,A,b,A,c,A,end`,
      `start,A,b,A,end`,
      `start,A,b,d,b,A,c,A,end`,
      `start,A,b,d,b,A,end`,
      `start,A,b,d,b,end`,
      `start,A,b,end`,
      `start,A,c,A,b,A,b,A,end`,
      `start,A,c,A,b,A,b,end`,
      `start,A,c,A,b,A,c,A,end`,
      `start,A,c,A,b,A,end`,
      `start,A,c,A,b,d,b,A,end`,
      `start,A,c,A,b,d,b,end`,
      `start,A,c,A,b,end`,
      `start,A,c,A,c,A,b,A,end`,
      `start,A,c,A,c,A,b,end`,
      `start,A,c,A,c,A,end`,
      `start,A,c,A,end`,
      `start,A,end`,
      `start,b,A,b,A,c,A,end`,
      `start,b,A,b,A,end`,
      `start,b,A,b,end`,
      `start,b,A,c,A,b,A,end`,
      `start,b,A,c,A,b,end`,
      `start,b,A,c,A,c,A,end`,
      `start,b,A,c,A,end`,
      `start,b,A,end`,
      `start,b,d,b,A,c,A,end`,
      `start,b,d,b,A,end`,
      `start,b,d,b,end`,
      `start,b,end`,
    ],
  );
  assertEquals(
    Array.from(
      Cave.parse(
        `fs-end he-DX fs-he start-DX pj-DX end-zg zg-sl zg-pj pj-he RW-he fs-DX pj-RW zg-RW start-pj he-WI zg-he pj-fs start-RW`,
      ).path(1),
    ).length,
    3509,
  );
});

Deno.test("part 1", () => {
  assertEquals(Array.from(Cave.parse(input).path()).length, 5457);
});

Deno.test("part 2", () => {
  assertEquals(Array.from(Cave.parse(input).path(1)).length, 128506);
});
