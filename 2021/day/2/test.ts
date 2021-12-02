import { assertEquals } from "https://deno.land/std@0.116.0/testing/asserts.ts";
import { followCourse, parseInput } from "./mod.ts";

const exampleInput = `
forward 5
down 5
forward 8
up 3
down 8
forward 2
`;

Deno.test("parseInput", () => {
  assertEquals(
    [...parseInput(exampleInput)],
    [
      [5, 0],
      [0, 5],
      [8, 0],
      [0, -3],
      [0, 8],
      [2, 0],
    ]
  );
});

Deno.test("followCourse", () => {
  assertEquals(
    followCourse([
      [5, 0],
      [0, 5],
      [8, 0],
      [0, -3],
      [0, 8],
      [2, 0],
    ]),
    [15, 10]
  );
});

Deno.test("part 1 example", () => {
  const [x, y] = followCourse([
    [5, 0],
    [0, 5],
    [8, 0],
    [0, -3],
    [0, 8],
    [2, 0],
  ]);
  assertEquals(x * y, 150);
});

Deno.test("part 1", () => {
  const [x, y] = followCourse(parseInput(input));
  assertEquals(x * y, 1635930);
});
