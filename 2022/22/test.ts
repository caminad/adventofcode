import { assertEquals } from "testing/asserts.ts";
import { getPassword, MonkeyMap, parseInstructions, parseRows } from "./lib.ts";

const input = Deno.readTextFileSync(new URL("input.txt", import.meta.url));

const example = `
        ...#
        .#..
        #...
        ....
...#.......#
........#...
..#....#....
..........#.
        ...#....
        .....#..
        .#......
        ......#.

10R5L5R10L4R5L5
`;

Deno.test("parseRows", () => {
  const rows = parseRows(example);
  assertEquals(rows.next().value, { start: 9, end: 12, walls: [12] });
  assertEquals(rows.next().value, { start: 9, end: 12, walls: [10] });
  assertEquals(rows.next().value, { start: 9, end: 12, walls: [9] });
  assertEquals(rows.next().value, { start: 9, end: 12, walls: [] });
  assertEquals(rows.next().value, { start: 1, end: 12, walls: [4, 12] });
  assertEquals(rows.next().value, { start: 1, end: 12, walls: [9] });
  assertEquals(rows.next().value, { start: 1, end: 12, walls: [3, 8] });
  assertEquals(rows.next().value, { start: 1, end: 12, walls: [11] });
  assertEquals(rows.next().value, { start: 9, end: 16, walls: [12] });
  assertEquals(rows.next().value, { start: 9, end: 16, walls: [14] });
  assertEquals(rows.next().value, { start: 9, end: 16, walls: [10] });
  assertEquals(rows.next().value, { start: 9, end: 16, walls: [15] });
  assertEquals(rows.next().done, true);
});

Deno.test("parseInstructions", () => {
  const instructions = parseInstructions(example);
  assertEquals(instructions.next().value, 10);
  assertEquals(instructions.next().value, "R");
  assertEquals(instructions.next().value, 5);
  assertEquals(instructions.next().value, "L");
  assertEquals(instructions.next().value, 5);
  assertEquals(instructions.next().value, "R");
  assertEquals(instructions.next().value, 10);
  assertEquals(instructions.next().value, "L");
  assertEquals(instructions.next().value, 4);
  assertEquals(instructions.next().value, "R");
  assertEquals(instructions.next().value, 5);
  assertEquals(instructions.next().value, "L");
  assertEquals(instructions.next().value, 5);
  assertEquals(instructions.next().done, true);
});

Deno.test("MonkeyMap", () => {
  const map = new MonkeyMap([
    { start: 9, end: 12, walls: [12] },
    { start: 9, end: 12, walls: [10] },
    { start: 9, end: 12, walls: [9] },
    { start: 9, end: 12, walls: [] },
    { start: 1, end: 12, walls: [4, 12] },
    { start: 1, end: 12, walls: [9] },
    { start: 1, end: 12, walls: [3, 8] },
    { start: 1, end: 12, walls: [11] },
    { start: 9, end: 16, walls: [12] },
    { start: 9, end: 16, walls: [14] },
    { start: 9, end: 16, walls: [10] },
    { start: 9, end: 16, walls: [15] },
  ]);
  const position = map.follow(
    [10, "R", 5, "L", 5, "R", 10, "L", 4, "R", 5, "L", 5],
  );
  assertEquals(position, { row: 6, col: 8, facing: 0 });
});

Deno.test("getPassword", () => {
  assertEquals(getPassword({ row: 6, col: 8, facing: 0 }), 6032);
});

Deno.test("part 1", () => {
  const map = new MonkeyMap(parseRows(input));
  const position = map.follow(parseInstructions(input));
  assertEquals(getPassword(position), 164014);
});
