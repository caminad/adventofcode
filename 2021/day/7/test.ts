import { assertEquals } from "https://deno.land/std@0.117.0/testing/asserts.ts";
import {
  distance,
  findCheapestDestination,
  parseInput,
  triangle,
} from "./mod.ts";

const input = await Deno.readTextFile(new URL("input.txt", import.meta.url));

const exampleInput = `16,1,2,0,4,2,7,1,2,14`;
const exampleParsedInput = [16, 1, 2, 0, 4, 2, 7, 1, 2, 14];

Deno.test("parseInput", () => {
  assertEquals(parseInput(exampleInput), exampleParsedInput);
});

Deno.test("distance", () => {
  assertEquals(
    exampleParsedInput.map((p) => distance(p, 2)),
    [14, 1, 0, 2, 2, 0, 5, 1, 0, 12],
  );
  assertEquals(
    exampleParsedInput.reduce((a, e) => a + distance(e, 1), 0),
    41,
  );
  assertEquals(
    exampleParsedInput.reduce((a, e) => a + distance(e, 3), 0),
    39,
  );
  assertEquals(
    exampleParsedInput.reduce((a, e) => a + distance(e, 10), 0),
    71,
  );
});

Deno.test("triangle", () => {
  assertEquals(
    Array.from(Array(10).keys(), triangle),
    [0, 1, 3, 6, 10, 15, 21, 28, 36, 45],
  );
});

Deno.test("findCheapestDestination", () => {
  assertEquals(findCheapestDestination(exampleParsedInput), {
    cost: 37,
    destination: 2,
  });
});

Deno.test("expensive movement", () => {
  const costFn = (p: number, d: number) => triangle(distance(p, d));
  assertEquals(findCheapestDestination(exampleParsedInput, costFn), {
    cost: 168,
    destination: 5,
  });
});

Deno.test("part 1", () => {
  assertEquals(findCheapestDestination(parseInput(input)).cost, 335330);
});

Deno.test("part 2", () => {
  const costFn = (p: number, d: number) => triangle(distance(p, d));
  assertEquals(
    findCheapestDestination(parseInput(input), costFn).cost,
    92439766,
  );
});
