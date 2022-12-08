import { assert, assertEquals, assertFalse } from "testing/asserts.ts";
import { Grid, parse } from "./lib.ts";

const input = Deno.readTextFileSync(new URL("input.txt", import.meta.url));

Deno.test("parse", () => {
  assertEquals([...parse(`
    30373
    25512
    65332
    33549
    35390
  `)], [
    [3, 0, 3, 7, 3],
    [2, 5, 5, 1, 2],
    [6, 5, 3, 3, 2],
    [3, 3, 5, 4, 9],
    [3, 5, 3, 9, 0],
  ]);
});

Deno.test("visible", () => {
  const grid = new Grid([
    [3, 0, 3, 7, 3],
    [2, 5, 5, 1, 2],
    [6, 5, 3, 3, 2],
    [3, 3, 5, 4, 9],
    [3, 5, 3, 9, 0],
  ]);
  assert(grid.visible({ row: 1, col: 1 }));
  assert(grid.visible({ row: 1, col: 2 }));
  assertFalse(grid.visible({ row: 1, col: 3 }));
  assert(grid.visible({ row: 2, col: 1 }));
  assertFalse(grid.visible({ row: 2, col: 2 }));
  assert(grid.visible({ row: 2, col: 3 }));
  assertFalse(grid.visible({ row: 3, col: 1 }));
  assert(grid.visible({ row: 3, col: 2 }));
  assertFalse(grid.visible({ row: 3, col: 3 }));
});

Deno.test("totalVisible", () => {
  const grid = new Grid([
    [3, 0, 3, 7, 3],
    [2, 5, 5, 1, 2],
    [6, 5, 3, 3, 2],
    [3, 3, 5, 4, 9],
    [3, 5, 3, 9, 0],
  ]);
  assertEquals(grid.totalVisible(), 21);
});

Deno.test("part 1", () => {
  const grid = new Grid(parse(input));
  assertEquals(grid.totalVisible(), 1809);
});
