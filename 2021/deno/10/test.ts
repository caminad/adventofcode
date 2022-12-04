import { assertEquals } from "testing/asserts.ts";
import { ParseIncompleteError, parseInput, ParseSyntaxError } from "./mod.ts";

const input = await Deno.readTextFile(new URL("input.txt", import.meta.url));

const exampleInput = `
[({(<(())[]>[[{[]{<()<>>
[(()[<>])]({[<{<<[]>>(
{([(<{}[<>[]}>{[]{[(<()>
(((({<>}<{<{<>}{[]{[]{}
[[<[([]))<([[{}[[()]]]
[{[{({}]{}}([{[{{{}}([]
{<[[]]>}<{[{[{[]{()[[[]
[<(<(<(<{}))><([]([]()
<{([([[(<>()){}]>(<<{{
<{([{{}}[<[[[<>{}]]]>[]]
`;
const exampleParsedInput = [
  new ParseIncompleteError("}}]])})]"),
  new ParseIncompleteError(")}>]})"),
  new ParseSyntaxError("]", "}"),
  new ParseIncompleteError("}}>}>))))"),
  new ParseSyntaxError("]", ")"),
  new ParseSyntaxError(")", "]"),
  new ParseIncompleteError("]]}}]}]}>"),
  new ParseSyntaxError(">", ")"),
  new ParseSyntaxError("]", ">"),
  new ParseIncompleteError("])}>"),
];

Deno.test("parseInput", () => {
  assertEquals([...parseInput(exampleInput)], exampleParsedInput);
});

Deno.test("ParseSyntaxError.score", () => {
  assertEquals(ParseSyntaxError.score(exampleParsedInput), 26397);
});

Deno.test("ParseIncompleteError.score", () => {
  assertEquals(ParseIncompleteError.score(exampleParsedInput), 288957);
});

Deno.test("part 1", () => {
  assertEquals(ParseSyntaxError.score(parseInput(input)), 366027);
});

Deno.test("part 2", () => {
  assertEquals(ParseIncompleteError.score(parseInput(input)), 1118645287);
});
