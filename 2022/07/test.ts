import { assertEquals, assertObjectMatch } from "testing/asserts.ts";
import { parse, run, sizes } from "./lib.ts";

const input = Deno.readTextFileSync(new URL("input.txt", import.meta.url));

Deno.test("parse", () => {
  assertEquals([...parse(`$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k
`)], [
    ["$", "cd", "/"],
    ["$", "ls"],
    ["dir", "a"],
    ["14848514", "b.txt"],
    ["8504156", "c.dat"],
    ["dir", "d"],
    ["$", "cd", "a"],
    ["$", "ls"],
    ["dir", "e"],
    ["29116", "f"],
    ["2557", "g"],
    ["62596", "h.lst"],
    ["$", "cd", "e"],
    ["$", "ls"],
    ["584", "i"],
    ["$", "cd", ".."],
    ["$", "cd", ".."],
    ["$", "cd", "d"],
    ["$", "ls"],
    ["4060174", "j"],
    ["8033020", "d.log"],
    ["5626152", "d.ext"],
    ["7214296", "k"],
  ]);
});

Deno.test("run", () => {
  assertObjectMatch(
    run([
      ["$", "cd", "/"],
      ["$", "ls"],
      ["dir", "a"],
      ["14848514", "b.txt"],
      ["8504156", "c.dat"],
      ["dir", "d"],
      ["$", "cd", "a"],
      ["$", "ls"],
      ["dir", "e"],
      ["29116", "f"],
      ["2557", "g"],
      ["62596", "h.lst"],
      ["$", "cd", "e"],
      ["$", "ls"],
      ["584", "i"],
      ["$", "cd", ".."],
      ["$", "cd", ".."],
      ["$", "cd", "d"],
      ["$", "ls"],
      ["4060174", "j"],
      ["8033020", "d.log"],
      ["5626152", "d.ext"],
      ["7214296", "k"],
    ]),
    {
      "a": {
        "e": {
          "i": 584,
        },
        "f": 29116,
        "g": 2557,
        "h.lst": 62596,
      },
      "b.txt": 14848514,
      "c.dat": 8504156,
      "d": {
        "d.ext": 5626152,
        "d.log": 8033020,
        "j": 4060174,
        "k": 7214296,
      },
    },
  );
});

Deno.test("sizes", () => {
  assertEquals([...sizes([], {
    "a": {
      "e": {
        "i": 584,
      },
      "f": 29116,
      "g": 2557,
      "h.lst": 62596,
    },
    "b.txt": 14848514,
    "c.dat": 8504156,
    "d": {
      "d.ext": 5626152,
      "d.log": 8033020,
      "j": 4060174,
      "k": 7214296,
    },
  })], [
    { path: ["a", "e", "i"], size: 584, type: "file" },
    { path: ["a", "e"], size: 584, type: "dir" },
    { path: ["a", "f"], size: 29116, type: "file" },
    { path: ["a", "g"], size: 2557, type: "file" },
    { path: ["a", "h.lst"], size: 62596, type: "file" },
    { path: ["a"], size: 94853, type: "dir" },
    { path: ["b.txt"], size: 14848514, type: "file" },
    { path: ["c.dat"], size: 8504156, type: "file" },
    { path: ["d", "d.ext"], size: 5626152, type: "file" },
    { path: ["d", "d.log"], size: 8033020, type: "file" },
    { path: ["d", "j"], size: 4060174, type: "file" },
    { path: ["d", "k"], size: 7214296, type: "file" },
    { path: ["d"], size: 24933642, type: "dir" },
    { path: [], size: 48381165, type: "dir" },
  ]);
});

Deno.test("part 1", () => {
  const dir = run(parse(input));
  let smallTotal = 0;
  for (const entry of sizes([], dir)) {
    if (entry.type === "dir" && entry.size <= 100_000) {
      smallTotal += entry.size;
    }
  }
  assertEquals(smallTotal, 1084134);
});

Deno.test("part 2", () => {
  const total = 70_000_000;
  const required = 30_000_000;
  const root = run(parse(input));
  const dirsAscending = Array.from(sizes([], root))
    .filter((x) => x.type === "dir")
    .sort((a, b) => a.size - b.size);
  const rootSize = dirsAscending.at(-1)!.size;
  const unused = total - rootSize;
  const needed = required - unused;
  const dir = dirsAscending.find((x) => x.size >= needed)!;
  assertEquals(dir.size, 6183184);
});
