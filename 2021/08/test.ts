import { assertEquals } from "https://deno.land/std@0.117.0/testing/asserts.ts";
import { countUniqueDigits, parseInput } from "./mod.ts";

const input = await Deno.readTextFile(new URL("input.txt", import.meta.url));

const exampleInput = `
be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe
edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc
fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg
fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb
aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea
fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb
dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe
bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef
egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb
gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce
`;
const exampleParsedInput = [
  {
    signalPatterns: [
      "be",
      "cfbegad",
      "cbdgef",
      "fgaecd",
      "cgeb",
      "fdcge",
      "agebfd",
      "fecdb",
      "fabcd",
      "edb",
    ],
    outputValue: ["fdgacbe", "cefdb", "cefbgd", "gcbe"],
  },
  {
    signalPatterns: [
      "edbfga",
      "begcd",
      "cbg",
      "gc",
      "gcadebf",
      "fbgde",
      "acbgfd",
      "abcde",
      "gfcbed",
      "gfec",
    ],
    outputValue: ["fcgedb", "cgb", "dgebacf", "gc"],
  },
  {
    signalPatterns: [
      "fgaebd",
      "cg",
      "bdaec",
      "gdafb",
      "agbcfd",
      "gdcbef",
      "bgcad",
      "gfac",
      "gcb",
      "cdgabef",
    ],
    outputValue: ["cg", "cg", "fdcagb", "cbg"],
  },
  {
    signalPatterns: [
      "fbegcd",
      "cbd",
      "adcefb",
      "dageb",
      "afcb",
      "bc",
      "aefdc",
      "ecdab",
      "fgdeca",
      "fcdbega",
    ],
    outputValue: ["efabcd", "cedba", "gadfec", "cb"],
  },
  {
    signalPatterns: [
      "aecbfdg",
      "fbg",
      "gf",
      "bafeg",
      "dbefa",
      "fcge",
      "gcbea",
      "fcaegb",
      "dgceab",
      "fcbdga",
    ],
    outputValue: ["gecf", "egdcabf", "bgf", "bfgea"],
  },
  {
    signalPatterns: [
      "fgeab",
      "ca",
      "afcebg",
      "bdacfeg",
      "cfaedg",
      "gcfdb",
      "baec",
      "bfadeg",
      "bafgc",
      "acf",
    ],
    outputValue: ["gebdcfa", "ecba", "ca", "fadegcb"],
  },
  {
    signalPatterns: [
      "dbcfg",
      "fgd",
      "bdegcaf",
      "fgec",
      "aegbdf",
      "ecdfab",
      "fbedc",
      "dacgb",
      "gdcebf",
      "gf",
    ],
    outputValue: ["cefg", "dcbef", "fcge", "gbcadfe"],
  },
  {
    signalPatterns: [
      "bdfegc",
      "cbegaf",
      "gecbf",
      "dfcage",
      "bdacg",
      "ed",
      "bedf",
      "ced",
      "adcbefg",
      "gebcd",
    ],
    outputValue: ["ed", "bcgafe", "cdgba", "cbgef"],
  },
  {
    signalPatterns: [
      "egadfb",
      "cdbfeg",
      "cegd",
      "fecab",
      "cgb",
      "gbdefca",
      "cg",
      "fgcdab",
      "egfdb",
      "bfceg",
    ],
    outputValue: ["gbdfcae", "bgc", "cg", "cgb"],
  },
  {
    signalPatterns: [
      "gcafb",
      "gcf",
      "dcaebfg",
      "ecagb",
      "gf",
      "abcdeg",
      "gaef",
      "cafbge",
      "fdbac",
      "fegbdc",
    ],
    outputValue: ["fgae", "cfgab", "fg", "bagce"],
  },
];

Deno.test("parseInput", () => {
  assertEquals([...parseInput(exampleInput)], exampleParsedInput);
});

Deno.test("countUniqueDigits", () => {
  assertEquals(countUniqueDigits(exampleParsedInput), 26);
});

Deno.test("part 1", () => {
  assertEquals(countUniqueDigits(parseInput(input)), 375);
});
