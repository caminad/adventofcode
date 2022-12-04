import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { intersect, parse, priority } from "./lib.ts";

const input = Deno.readTextFileSync(new URL("input.txt", import.meta.url));

Deno.test("parse", () => {
  assertEquals<[string, string][]>(
    [
      ...parse(`
        vJrwpWtwJgWrhcsFMMfFFhFp
        jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
        PmmdzqPrVvPwwTWBwg
        wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
        ttgJtRGJQctTZtZT
        CrZsJsPPZsGzwwsLwLmpwMDw
      `),
    ],
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

Deno.test("intersect", () => {
  assertEquals(intersect("vJrwpWtwJgWr", "hcsFMMfFFhFp"), new Set("p"));
  assertEquals(intersect("jqHRNqRjqzjGDLGL", "rsFMfFZSrLrFZsSL"), new Set("L"));
  assertEquals(intersect("PmmdzqPrV", "vPwwTWBwg"), new Set("P"));
  assertEquals(intersect("wMqvLMZHhHMvwLH", "jbvcjnnSBnvTQFn"), new Set("v"));
  assertEquals(intersect("ttgJtRGJ", "QctTZtZT"), new Set("t"));
  assertEquals(intersect("CrZsJsPPZsGz", "wwsLwLmpwMDw"), new Set("s"));
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
  const total = Array.from(parse(input), ([a, b]) => intersect(a, b))
    .reduce((a, e) => a + priority(e), 0);
  assertEquals(total, 8039);
});
