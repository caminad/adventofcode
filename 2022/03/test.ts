import { assertEquals } from "testing/asserts.ts";
import {
  findCommonItem,
  inCompartments,
  inElfGroups,
  parse,
  priority,
} from "./lib.ts";

const input = Deno.readTextFileSync(new URL("input.txt", import.meta.url));

Deno.test("parse", () => {
  assertEquals<string[]>(
    [...parse(`
      vJrwpWtwJgWrhcsFMMfFFhFp
      jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
      PmmdzqPrVvPwwTWBwg
      wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
      ttgJtRGJQctTZtZT
      CrZsJsPPZsGzwwsLwLmpwMDw
    `)],
    [
      "vJrwpWtwJgWrhcsFMMfFFhFp",
      "jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL",
      "PmmdzqPrVvPwwTWBwg",
      "wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn",
      "ttgJtRGJQctTZtZT",
      "CrZsJsPPZsGzwwsLwLmpwMDw",
    ],
  );
});

Deno.test("inCompartments", () => {
  assertEquals<[string, string][]>(
    [...inCompartments([
      "vJrwpWtwJgWrhcsFMMfFFhFp",
      "jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL",
      "PmmdzqPrVvPwwTWBwg",
      "wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn",
      "ttgJtRGJQctTZtZT",
      "CrZsJsPPZsGzwwsLwLmpwMDw",
    ])],
    [
      ["vJrwpWtwJgWr", "hcsFMMfFFhFp"],
      ["jqHRNqRjqzjGDLGL", "rsFMfFZSrLrFZsSL"],
      ["PmmdzqPrV", "vPwwTWBwg"],
      ["wMqvLMZHhHMvwLH", "jbvcjnnSBnvTQFn"],
      ["ttgJtRGJ", "QctTZtZT"],
      ["CrZsJsPPZsGz", "wwsLwLmpwMDw"],
    ],
  );
});

Deno.test("inElfGroups", () => {
  assertEquals<[string, string, string][]>(
    [...inElfGroups([
      "vJrwpWtwJgWrhcsFMMfFFhFp",
      "jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL",
      "PmmdzqPrVvPwwTWBwg",
      "wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn",
      "ttgJtRGJQctTZtZT",
      "CrZsJsPPZsGzwwsLwLmpwMDw",
    ])],
    [
      [
        "vJrwpWtwJgWrhcsFMMfFFhFp",
        "jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL",
        "PmmdzqPrVvPwwTWBwg",
      ],
      [
        "wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn",
        "ttgJtRGJQctTZtZT",
        "CrZsJsPPZsGzwwsLwLmpwMDw",
      ],
    ],
  );
});

Deno.test("findCommonItem", () => {
  assertEquals(findCommonItem(["vJrwpWtwJgWr", "hcsFMMfFFhFp"]), "p");
  assertEquals(findCommonItem(["jqHRNqRjqzjGDLGL", "rsFMfFZSrLrFZsSL"]), "L");
  assertEquals(findCommonItem(["PmmdzqPrV", "vPwwTWBwg"]), "P");
  assertEquals(findCommonItem(["wMqvLMZHhHMvwLH", "jbvcjnnSBnvTQFn"]), "v");
  assertEquals(findCommonItem(["ttgJtRGJ", "QctTZtZT"]), "t");
  assertEquals(findCommonItem(["CrZsJsPPZsGz", "wwsLwLmpwMDw"]), "s");
});

Deno.test("priority", () => {
  assertEquals(priority("p"), 16);
  assertEquals(priority("L"), 38);
  assertEquals(priority("P"), 42);
  assertEquals(priority("v"), 22);
  assertEquals(priority("t"), 20);
  assertEquals(priority("s"), 19);
  assertEquals(priority("pLPvts"), 157);
});

Deno.test("part 1", () => {
  const commonItems = Array.from(inCompartments(parse(input)), findCommonItem);
  assertEquals(priority(commonItems), 8039);
});

Deno.test("part 2", () => {
  const commonItems = Array.from(inElfGroups(parse(input)), findCommonItem);
  assertEquals(priority(commonItems), 2510);
});
