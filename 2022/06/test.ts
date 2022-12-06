import { assertEquals } from "testing/asserts.ts";
import { findStartOfPacket } from "./lib.ts";

const input = Deno.readTextFileSync(new URL("input.txt", import.meta.url));

Deno.test("findStartOfPacket", () => {
  assertEquals(findStartOfPacket("mjqjpqmgbljsphdztnvjfqwrcgsmlb"), 7);
  assertEquals(findStartOfPacket("bvwbjplbgvbhsrlpgdmjqwftvncz"), 5);
  assertEquals(findStartOfPacket("nppdvjthqldpwncqszvftbrmjlhg"), 6);
  assertEquals(findStartOfPacket("nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg"), 10);
  assertEquals(findStartOfPacket("zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw"), 11);
});

Deno.test("part 1", () => {
  assertEquals(findStartOfPacket(input), 1356);
});
