import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { parse, score } from "./lib.ts";

const input = Deno.readTextFileSync(new URL("input.txt", import.meta.url));

Deno.test("parse", () => {
  assertEquals(
    [...parse("A Y B X C Z")],
    [
      { opponent: "rock", player: "paper" },
      { opponent: "paper", player: "rock" },
      { opponent: "scissors", player: "scissors" },
    ],
  );
});

Deno.test("score", () => {
  assertEquals(score({ opponent: "rock", player: "paper" }), 8);
  assertEquals(score({ opponent: "paper", player: "rock" }), 1);
  assertEquals(score({ opponent: "scissors", player: "scissors" }), 6);
});

Deno.test("part 1", () => {
  let total = 0;
  for (const round of parse(input)) {
    total += score(round);
  }
  assertEquals(total, 14297);
});
