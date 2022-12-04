import { assertEquals } from "testing/asserts.ts";
import { parse, Round, RULES_V1, RULES_V2, score } from "./lib.ts";

const input = Deno.readTextFileSync(new URL("input.txt", import.meta.url));

Deno.test("parse", () => {
  assertEquals<Round[]>([...parse("A Y B X C Z")], ["A Y", "B X", "C Z"]);
});

Deno.test("score", () => {
  assertEquals(score(["A Y"], RULES_V1), 8);
  assertEquals(score(["B X"], RULES_V1), 1);
  assertEquals(score(["C Z"], RULES_V1), 6);
  assertEquals(score(["A Y", "B X", "C Z"], RULES_V1), 15);

  assertEquals(score(["A Y"], RULES_V2), 4);
  assertEquals(score(["B X"], RULES_V2), 1);
  assertEquals(score(["C Z"], RULES_V2), 7);
  assertEquals(score(["A Y", "B X", "C Z"], RULES_V2), 12);
});

Deno.test("part 1", () => {
  assertEquals(score(parse(input), RULES_V1), 14297);
});

Deno.test("part 2", () => {
  assertEquals(score(parse(input), RULES_V2), 10498);
});
