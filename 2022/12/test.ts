import { assertEquals } from "testing/asserts.ts";
import { Grid } from "./lib.ts";

const input = Deno.readTextFileSync(new URL("input.txt", import.meta.url));

Deno.test("Grid.parse", () => {
  assertEquals([...Grid.parse(`
    Sabqponm
    abcryxxl
    accszExk
    acctuvwj
    abdefghi
  `)], [
    ["S", "a", "b", "q", "p", "o", "n", "m"],
    ["a", "b", "c", "r", "y", "x", "x", "l"],
    ["a", "c", "c", "s", "z", "E", "x", "k"],
    ["a", "c", "c", "t", "u", "v", "w", "j"],
    ["a", "b", "d", "e", "f", "g", "h", "i"],
  ]);
});

Deno.test("Grid.from", () => {
  assertEquals([...Grid.from([
    ["S", "a", "b", "q", "p", "o", "n", "m"],
    ["a", "b", "c", "r", "y", "x", "x", "l"],
    ["a", "c", "c", "s", "z", "E", "x", "k"],
    ["a", "c", "c", "t", "u", "v", "w", "j"],
    ["a", "b", "d", "e", "f", "g", "h", "i"],
  ])], [
    ["S", "a", "b", "q", "p", "o", "n", "m"],
    ["a", "b", "c", "r", "y", "x", "x", "l"],
    ["a", "c", "c", "s", "z", "E", "x", "k"],
    ["a", "c", "c", "t", "u", "v", "w", "j"],
    ["a", "b", "d", "e", "f", "g", "h", "i"],
  ]);
});

Deno.test("Grid.prototype[@@toStringTag]", () => {
  assertEquals(new Grid("S").toString(), "[object Grid]");
});

Deno.test("Grid.prototype[@@toPrimitive]", () => {
  assertEquals(String(new Grid("S")), "S");
  assertEquals(String(new Grid("a")), "a");
  assertEquals(Number(new Grid("S")), 0);
  assertEquals(Number(new Grid("a")), 1);
  assertEquals(Number(new Grid(" ")), -1);
});

Deno.test("Grid.prototype.findStart", () => {
  const grid = Grid.from([
    ["S", "a", "b", "q", "p", "o", "n", "m"],
    ["a", "b", "c", "r", "y", "x", "x", "l"],
    ["a", "c", "c", "s", "z", "E", "x", "k"],
    ["a", "c", "c", "t", "u", "v", "w", "j"],
    ["a", "b", "d", "e", "f", "g", "h", "i"],
  ]);
  assertEquals(grid.findStart(), grid);
  assertEquals(new Grid("E").findStart(), undefined);
});

Deno.test("Grid.prototype.findEnd", () => {
  const grid = Grid.from([
    ["S", "a", "b", "q", "p", "o", "n", "m"],
    ["a", "b", "c", "r", "y", "x", "x", "l"],
    ["a", "c", "c", "s", "z", "E", "x", "k"],
    ["a", "c", "c", "t", "u", "v", "w", "j"],
    ["a", "b", "d", "e", "f", "g", "h", "i"],
  ]);
  assertEquals(String(grid.findEnd()), "E");
  assertEquals(new Grid("S").findEnd(), undefined);
});

Deno.test("part 1", { ignore: true }, () => {
  const grid = Grid.parse(input);
});
