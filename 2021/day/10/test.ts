import { assertEquals } from "https://deno.land/std@0.117.0/testing/asserts.ts";
import { checkLine, getSyntaxErrorScore, parseInput } from "./mod.ts";

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
  "[({(<(())[]>[[{[]{<()<>>",
  "[(()[<>])]({[<{<<[]>>(",
  "{([(<{}[<>[]}>{[]{[(<()>",
  "(((({<>}<{<{<>}{[]{[]{}",
  "[[<[([]))<([[{}[[()]]]",
  "[{[{({}]{}}([{[{{{}}([]",
  "{<[[]]>}<{[{[{[]{()[[[]",
  "[<(<(<(<{}))><([]([]()",
  "<{([([[(<>()){}]>(<<{{",
  "<{([{{}}[<[[[<>{}]]]>[]]",
];

Deno.test("parseInput", () => {
  assertEquals(parseInput(exampleInput), exampleParsedInput);
});

Deno.test("checkLine", () => {
  assertEquals(checkLine("[({(<(())[]>[[{[]{<()<>>"), { ok: true });
  assertEquals(checkLine("{([(<{}[<>[]}>{[]{[(<()>"), {
    ok: false,
    expected: "]",
    found: "}",
  });
  assertEquals(checkLine("[[<[([]))<([[{}[[()]]]"), {
    ok: false,
    expected: "]",
    found: ")",
  });
  assertEquals(checkLine("[{[{({}]{}}([{[{{{}}([]"), {
    ok: false,
    expected: ")",
    found: "]",
  });
  assertEquals(checkLine("[<(<(<(<{}))><([]([]()"), {
    ok: false,
    expected: ">",
    found: ")",
  });
  assertEquals(checkLine("<{([([[(<>()){}]>(<<{{"), {
    ok: false,
    expected: "]",
    found: ">",
  });
});

Deno.test("getSyntaxErrorScore", () => {
  assertEquals(getSyntaxErrorScore(exampleParsedInput.map(checkLine)), 26397);
});

Deno.test("part 1", () => {
  assertEquals(getSyntaxErrorScore(parseInput(input).map(checkLine)), 366027);
});
