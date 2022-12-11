import { assertEquals } from "testing/asserts.ts";
import { MonkeyRule, parse, run } from "./lib.ts";

const input = Deno.readTextFileSync(new URL("input.txt", import.meta.url));

Deno.test("parse", () => {
  assertEquals<MonkeyRule[]>([...parse(`
    Monkey 0:
      Starting items: 79, 98
      Operation: new = old * 19
      Test: divisible by 23
        If true: throw to monkey 2
        If false: throw to monkey 3

    Monkey 1:
      Starting items: 54, 65, 75, 74
      Operation: new = old + 6
      Test: divisible by 19
        If true: throw to monkey 2
        If false: throw to monkey 0

    Monkey 2:
      Starting items: 79, 60, 97
      Operation: new = old * old
      Test: divisible by 13
        If true: throw to monkey 1
        If false: throw to monkey 3

    Monkey 3:
      Starting items: 74
      Operation: new = old + 3
      Test: divisible by 17
        If true: throw to monkey 0
        If false: throw to monkey 1
  `)], [
    {
      startingItems: [79n, 98n],
      operation: { operator: "*", value: 19n },
      condition: { divisor: 23n, ifTrue: 2, ifFalse: 3 },
    },
    {
      startingItems: [54n, 65n, 75n, 74n],
      operation: { operator: "+", value: 6n },
      condition: { divisor: 19n, ifTrue: 2, ifFalse: 0 },
    },
    {
      startingItems: [79n, 60n, 97n],
      operation: { operator: "*" },
      condition: { divisor: 13n, ifTrue: 1, ifFalse: 3 },
    },
    {
      startingItems: [74n],
      operation: { operator: "+", value: 3n },
      condition: { divisor: 17n, ifTrue: 0, ifFalse: 1 },
    },
  ]);
});

Deno.test("run", () => {
  const rounds = Array.from(
    run([
      {
        startingItems: [79n, 98n],
        operation: { operator: "*", value: 19n },
        condition: { divisor: 23n, ifTrue: 2, ifFalse: 3 },
      },
      {
        startingItems: [54n, 65n, 75n, 74n],
        operation: { operator: "+", value: 6n },
        condition: { divisor: 19n, ifTrue: 2, ifFalse: 0 },
      },
      {
        startingItems: [79n, 60n, 97n],
        operation: { operator: "*" },
        condition: { divisor: 13n, ifTrue: 1, ifFalse: 3 },
      },
      {
        startingItems: [74n],
        operation: { operator: "+", value: 3n },
        condition: { divisor: 17n, ifTrue: 0, ifFalse: 1 },
      },
    ], 20),
  );

  assertEquals(rounds.slice(0, 11).map((x) => x.states.map((s) => s.items)), [
    [
      [79n, 98n],
      [54n, 65n, 75n, 74n],
      [79n, 60n, 97n],
      [74n],
    ],
    [
      [20n, 23n, 27n, 26n],
      [2080n, 25n, 167n, 207n, 401n, 1046n],
      [],
      [],
    ],
    [
      [695n, 10n, 71n, 135n, 350n],
      [43n, 49n, 58n, 55n, 362n],
      [],
      [],
    ],
    [
      [16n, 18n, 21n, 20n, 122n],
      [1468n, 22n, 150n, 286n, 739n],
      [],
      [],
    ],
    [
      [491n, 9n, 52n, 97n, 248n, 34n],
      [39n, 45n, 43n, 258n],
      [],
      [],
    ],
    [
      [15n, 17n, 16n, 88n, 1037n],
      [20n, 110n, 205n, 524n, 72n],
      [],
      [],
    ],
    [
      [8n, 70n, 176n, 26n, 34n],
      [481n, 32n, 36n, 186n, 2190n],
      [],
      [],
    ],
    [
      [162n, 12n, 14n, 64n, 732n, 17n],
      [148n, 372n, 55n, 72n],
      [],
      [],
    ],
    [
      [51n, 126n, 20n, 26n, 136n],
      [343n, 26n, 30n, 1546n, 36n],
      [],
      [],
    ],
    [
      [116n, 10n, 12n, 517n, 14n],
      [108n, 267n, 43n, 55n, 288n],
      [],
      [],
    ],
    [
      [91n, 16n, 20n, 98n],
      [481n, 245n, 22n, 26n, 1092n, 30n],
      [],
      [],
    ],
  ]);
  assertEquals(rounds.at(15)?.states.map((s) => s.items), [
    [83n, 44n, 8n, 184n, 9n, 20n, 26n, 102n],
    [110n, 36n],
    [],
    [],
  ]);
  assertEquals(rounds.at(20), {
    round: 20,
    states: [
      { items: [10n, 12n, 14n, 26n, 34n], inspections: 101 },
      { items: [245n, 93n, 53n, 199n, 115n], inspections: 95 },
      { items: [], inspections: 7 },
      { items: [], inspections: 105 },
    ],
    monkeyBusiness: 10605,
  });
});

Deno.test("part 1", () => {
  const rules = Array.from(parse(input));
  const rounds = Array.from(run(rules, 20));
  assertEquals(rounds.at(20)?.monkeyBusiness, 95472);
});
