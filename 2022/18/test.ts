import { assertEquals } from "testing/asserts.ts";
import { FaceMap, parse } from "./lib.ts";

const input = Deno.readTextFileSync(new URL("input.txt", import.meta.url));

Deno.test("parse", () => {
  assertEquals([...parse(`
    2,2,2
    1,2,2
    3,2,2
    2,1,2
    2,3,2
    2,2,1
    2,2,3
    2,2,4
    2,2,6
    1,2,5
    3,2,5
    2,1,5
    2,3,5
  `)], [
    [2, 2, 2],
    [1, 2, 2],
    [3, 2, 2],
    [2, 1, 2],
    [2, 3, 2],
    [2, 2, 1],
    [2, 2, 3],
    [2, 2, 4],
    [2, 2, 6],
    [1, 2, 5],
    [3, 2, 5],
    [2, 1, 5],
    [2, 3, 5],
  ]);
});

Deno.test("FaceMap", () => {
  const faceMap = new FaceMap([
    [2, 2, 2],
    [1, 2, 2],
    [3, 2, 2],
    [2, 1, 2],
    [2, 3, 2],
    [2, 2, 1],
    [2, 2, 3],
    [2, 2, 4],
    [2, 2, 6],
    [1, 2, 5],
    [3, 2, 5],
    [2, 1, 5],
    [2, 3, 5],
  ]);
  assertEquals(faceMap.surfaceArea(), 64);
});

Deno.test("part 1", () => {
  const faceMap = new FaceMap(parse(input));
  assertEquals(faceMap.surfaceArea(), 4444);
});
