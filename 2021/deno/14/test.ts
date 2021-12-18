import { assertEquals } from "https://deno.land/std@0.117.0/testing/asserts.ts";
import { getElementCounts, getNextStep, getSteps, parseInput } from "./mod.ts";

const input = await Deno.readTextFile(new URL("input.txt", import.meta.url));

const exampleInput = `NNCB

CH -> B
HH -> N
CB -> H
NH -> C
HB -> C
HC -> B
HN -> C
NN -> C
BH -> H
NC -> B
NB -> B
BN -> B
BB -> N
BC -> B
CC -> N
CN -> C
`;
const exampleParsedInput = [
  "NNCB",
  new Map([
    ["CH", "B"],
    ["HH", "N"],
    ["CB", "H"],
    ["NH", "C"],
    ["HB", "C"],
    ["HC", "B"],
    ["HN", "C"],
    ["NN", "C"],
    ["BH", "H"],
    ["NC", "B"],
    ["NB", "B"],
    ["BN", "B"],
    ["BB", "N"],
    ["BC", "B"],
    ["CC", "N"],
    ["CN", "C"],
  ]),
] as const;

Deno.test("parseInput", () => {
  assertEquals(parseInput(exampleInput), exampleParsedInput);
});

Deno.test("getNextStep", () => {
  const [polymerTemplate, pairInsertionRules] = exampleParsedInput;
  const steps: string[] = [polymerTemplate];
  for (const i of Array(4).keys()) {
    steps.push(getNextStep(steps[i], pairInsertionRules));
  }
  assertEquals(steps.slice(1), [
    "NCNBCHB",
    "NBCCNBBBCBHCB",
    "NBBBCNCCNBBNBNBBCHBHHBCHB",
    "NBBNBNBBCCNBCNCCNBBNBBNBBBNBBNBBCBHCBHHNHCBBCBHCB",
  ]);
});

Deno.test("getSteps", () => {
  const steps = getSteps(10, ...exampleParsedInput);
  assertEquals(steps[5].length, 97);
  assertEquals(steps[10].length, 3073);
});

Deno.test("getElementCounts", () => {
  const lastStep = getSteps(10, ...exampleParsedInput).at(-1)!;
  const counts = getElementCounts(lastStep);
  assertEquals(counts.get("B"), 1749);
  assertEquals(counts.get("C"), 298);
  assertEquals(counts.get("H"), 161);
  assertEquals(counts.get("N"), 865);
  assertEquals(
    Math.max(...counts.values()) - Math.min(...counts.values()),
    1588,
  );
});

Deno.test("part 1", () => {
  const lastStep = getSteps(10, ...parseInput(input)).at(-1)!;
  const counts = getElementCounts(lastStep);
  assertEquals(
    Math.max(...counts.values()) - Math.min(...counts.values()),
    2375,
  );
});
