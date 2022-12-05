import { assertEquals } from "testing/asserts.ts";
import {
  Instruction,
  move,
  parseInstructions,
  parseStacks,
  tops,
} from "./lib.ts";

const input = Deno.readTextFileSync(new URL("input.txt", import.meta.url));

Deno.test("parseInstructions", () => {
  assertEquals<Instruction[]>([...parseInstructions(`
    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2
`)], [
    { move: 1, from: 2, to: 1 },
    { move: 3, from: 1, to: 3 },
    { move: 2, from: 2, to: 1 },
    { move: 1, from: 1, to: 2 },
  ]);
});

Deno.test("parseStacks", () => {
  assertEquals<Map<number, string[]>>(
    parseStacks(`
    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2
`),
    new Map([
      [1, ["Z", "N"]],
      [2, ["M", "C", "D"]],
      [3, ["P"]],
    ]),
  );
});

Deno.test("move", () => {
  const stacks = new Map([
    [1, ["Z", "N"]],
    [2, ["M", "C", "D"]],
    [3, ["P"]],
  ]);
  move(stacks, { move: 1, from: 2, to: 1 });
  assertEquals(
    stacks,
    new Map([
      [1, ["Z", "N", "D"]],
      [2, ["M", "C"]],
      [3, ["P"]],
    ]),
  );
  move(stacks, { move: 3, from: 1, to: 3 });
  assertEquals(
    stacks,
    new Map([
      [1, []],
      [2, ["M", "C"]],
      [3, ["P", "D", "N", "Z"]],
    ]),
  );
  move(stacks, { move: 2, from: 2, to: 1 });
  assertEquals(
    stacks,
    new Map([
      [1, ["C", "M"]],
      [2, []],
      [3, ["P", "D", "N", "Z"]],
    ]),
  );
  move(stacks, { move: 1, from: 1, to: 2 });
  assertEquals(
    stacks,
    new Map([
      [1, ["C"]],
      [2, ["M"]],
      [3, ["P", "D", "N", "Z"]],
    ]),
  );
});

Deno.test("tops", () => {
  assertEquals(
    tops(
      new Map([
        [1, ["C"]],
        [2, ["M"]],
        [3, ["P", "D", "N", "Z"]],
      ]),
    ),
    ["C", "M", "Z"],
  );
});

Deno.test("part 1", () => {
  const stacks = parseStacks(input);
  for (const instruction of parseInstructions(input)) {
    move(stacks, instruction);
  }
  assertEquals(tops(stacks).join(""), "JCMHLVGMG");
});
