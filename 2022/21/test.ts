import { assertEquals } from "testing/asserts.ts";
import { Jobs, parse } from "./lib.ts";

const input = Deno.readTextFileSync(new URL("input.txt", import.meta.url));

Deno.test("parse", () => {
  assertEquals([...parse(`
    root: pppw + sjmn
    dbpl: 5
    cczh: sllz + lgvd
    zczc: 2
    ptdq: humn - dvpt
    dvpt: 3
    lfqf: 4
    humn: 5
    ljgn: 2
    sjmn: drzm * dbpl
    sllz: 4
    pppw: cczh / lfqf
    lgvd: ljgn * ptdq
    drzm: hmdt - zczc
    hmdt: 32
  `)], [
    ["root", ["pppw", "+", "sjmn"]],
    ["dbpl", 5],
    ["cczh", ["sllz", "+", "lgvd"]],
    ["zczc", 2],
    ["ptdq", ["humn", "-", "dvpt"]],
    ["dvpt", 3],
    ["lfqf", 4],
    ["humn", 5],
    ["ljgn", 2],
    ["sjmn", ["drzm", "*", "dbpl"]],
    ["sllz", 4],
    ["pppw", ["cczh", "/", "lfqf"]],
    ["lgvd", ["ljgn", "*", "ptdq"]],
    ["drzm", ["hmdt", "-", "zczc"]],
    ["hmdt", 32],
  ]);
});

Deno.test("Jobs", () => {
  const jobs = new Jobs([
    ["root", ["pppw", "+", "sjmn"]],
    ["dbpl", 5],
    ["cczh", ["sllz", "+", "lgvd"]],
    ["zczc", 2],
    ["ptdq", ["humn", "-", "dvpt"]],
    ["dvpt", 3],
    ["lfqf", 4],
    ["humn", 5],
    ["ljgn", 2],
    ["sjmn", ["drzm", "*", "dbpl"]],
    ["sllz", 4],
    ["pppw", ["cczh", "/", "lfqf"]],
    ["lgvd", ["ljgn", "*", "ptdq"]],
    ["drzm", ["hmdt", "-", "zczc"]],
    ["hmdt", 32],
  ]);
  assertEquals(jobs.resolve("hmdt"), 32);
  assertEquals(jobs.resolve("zczc"), 2);
  assertEquals(jobs.resolve("drzm"), 32 - 2);
  assertEquals(jobs.resolve("sjmn"), (32 - 2) * 5);
  assertEquals(jobs.resolve("root"), 152);
});

Deno.test("part 1", () => {
  const jobs = new Jobs(parse(input));
  assertEquals(jobs.resolve("root"), 159591692827554);
});
