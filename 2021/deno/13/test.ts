import { assertEquals } from "https://deno.land/std@0.117.0/testing/asserts.ts";
import { Manual } from "./mod.ts";

const input = await Deno.readTextFile(new URL("input.txt", import.meta.url));

const exampleInput = `
6,10
0,14
9,10
0,3
10,4
4,11
6,0
6,12
4,1
0,13
10,12
3,4
3,0
8,4
1,10
2,14
8,10
9,0

fold along y=7
fold along x=5
`;
const exampleManual = new Manual(
  [
    "6,10",
    "0,14",
    "9,10",
    "0,3",
    "10,4",
    "4,11",
    "6,0",
    "6,12",
    "4,1",
    "0,13",
    "10,12",
    "3,4",
    "3,0",
    "8,4",
    "1,10",
    "2,14",
    "8,10",
    "9,0",
  ],
  [
    { y: 7 },
    { x: 5 },
  ],
);

Deno.test("parsing a manual", () => {
  assertEquals(Manual.parse(exampleInput), exampleManual);
});

Deno.test("folding a manual once", () => {
  assertEquals(exampleManual.fold().size, 17);
});

Deno.test("displaying a manual", () => {
  assertEquals(
    exampleManual.toString(),
    `
┌────────────────────────┐
│       ██    ██    ██   │
│         ██             │
│                        │
│ ██                     │
│       ██        ██  ██ │
│                        │
│                        │
│ ━━━━━━━━━━━━━━━━━━━━━━ │
│                        │
│                        │
│   ██        ██  ████   │
│         ██             │
│             ██      ██ │
│ ██                     │
│ ██  ██                 │
└────────────────────────┘
`.trim(),
  );
  assertEquals(
    exampleManual.fold().toString(),
    `
┌────────────────────────┐
│ ██  ████  ▕ ██    ██   │
│ ██      ██▕            │
│           ▕ ██      ██ │
│ ██      ██▕            │
│   ██  ██  ▕ ██  ██████ │
└────────────────────────┘
`.trim(),
  );
});

Deno.test("complete folding", () => {
  assertEquals(
    exampleManual.foldAll().toString(),
    `
┌────────────┐
│ ██████████ │
│ ██      ██ │
│ ██      ██ │
│ ██      ██ │
│ ██████████ │
└────────────┘
`.trim(),
  );
});

Deno.test("part 1", () => {
  assertEquals(Manual.parse(input).fold().size, 765);
});

Deno.test("part 2", () => {
  assertEquals(
    Manual.parse(input).foldAll().toString(),
    /* RZKZLPGH */ `
┌────────────────────────────────────────────────────────────────────────────────┐
│ ██████    ████████  ██    ██  ████████  ██        ██████      ████    ██    ██ │
│ ██    ██        ██  ██  ██          ██  ██        ██    ██  ██    ██  ██    ██ │
│ ██    ██      ██    ████          ██    ██        ██    ██  ██        ████████ │
│ ██████      ██      ██  ██      ██      ██        ██████    ██  ████  ██    ██ │
│ ██  ██    ██        ██  ██    ██        ██        ██        ██    ██  ██    ██ │
│ ██    ██  ████████  ██    ██  ████████  ████████  ██          ██████  ██    ██ │
└────────────────────────────────────────────────────────────────────────────────┘
`.trim(),
  );
});
