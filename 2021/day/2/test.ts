import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.117.0/testing/asserts.ts";
import {
  Direction,
  move1,
  move2,
  parseSubmarineCommands,
  reduce,
  SubmarineCommand,
  SubmarineState,
} from "./mod.ts";

const exampleInput = "forward 5 down 5 forward 8 up 3 down 8 forward 2";
const input = await Deno.readTextFile(new URL("./input.txt", import.meta.url));

Deno.test("Direction", () => {
  assertEquals<Direction>(Direction("forward"), "forward");
  assertEquals<Direction>(Direction("down"), "down");
  assertEquals<Direction>(Direction("up"), "up");
  assertThrows(() => Direction("???"), TypeError, "Not a direction: ???");
});

Deno.test("SubmarineCommand", () => {
  assertEquals<SubmarineCommand>(SubmarineCommand("forward", 42), {
    direction: "forward",
    magnitude: 42,
  });
});

Deno.test("parseSubmarineCommands", () => {
  assertEquals<SubmarineCommand[]>(
    [...parseSubmarineCommands(exampleInput)],
    [
      SubmarineCommand("forward", 5),
      SubmarineCommand("down", 5),
      SubmarineCommand("forward", 8),
      SubmarineCommand("up", 3),
      SubmarineCommand("down", 8),
      SubmarineCommand("forward", 2),
    ],
  );
});

Deno.test("SubmarineState", () => {
  assertEquals<SubmarineState>(SubmarineState(), {
    position: 0,
    depth: 0,
    aim: 0,
  });
  assertEquals<SubmarineState>(SubmarineState(1, 2, 3), {
    position: 1,
    depth: 2,
    aim: 3,
  });
});

Deno.test("reduce", () => {
  const prepend = <T>(a: T[], e: T) => [e, ...a];
  assertEquals<number[]>(reduce([1, 2], prepend, [0]), [2, 1, 0]);
});

Deno.test("part 1 example", () => {
  const commands = parseSubmarineCommands(exampleInput);
  const state = reduce(commands, move1, SubmarineState());
  assertEquals<SubmarineState>(state, SubmarineState(15, 10));
  assertEquals<number>(state.depth * state.position, 150);
});

Deno.test("part 1", () => {
  const commands = parseSubmarineCommands(input);
  const state = reduce(commands, move1, SubmarineState());
  assertEquals<number>(state.depth * state.position, 1635930);
});

Deno.test("part 2 example", () => {
  const commands = parseSubmarineCommands(exampleInput);
  const state = reduce(commands, move2, SubmarineState());
  assertEquals<SubmarineState>(state, SubmarineState(15, 60, 10));
  assertEquals<number>(state.depth * state.position, 900);
});

Deno.test("part 2", () => {
  const commands = parseSubmarineCommands(input);
  const state = reduce(commands, move2, SubmarineState());
  assertEquals<number>(state.depth * state.position, 1781819478);
});
