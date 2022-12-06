import { assertEquals } from "testing/asserts.ts";
import { findDistinct } from "./lib.ts";

const input = Deno.readTextFileSync(new URL("input.txt", import.meta.url));

Deno.test("findDistinct", () => {
  assertEquals(findDistinct("mjqjpqmgbljsphdztnvjfqwrcgsmlb", 4), 7);
  assertEquals(findDistinct("bvwbjplbgvbhsrlpgdmjqwftvncz", 4), 5);
  assertEquals(findDistinct("nppdvjthqldpwncqszvftbrmjlhg", 4), 6);
  assertEquals(findDistinct("nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg", 4), 10);
  assertEquals(findDistinct("zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw", 4), 11);
});

Deno.test("part 1", () => {
  assertEquals(findDistinct(input, 4), 1356);
});

Deno.test("part 2", () => {
  assertEquals(findDistinct(input, 14), 2564);
});
