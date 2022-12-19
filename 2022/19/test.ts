import { assertEquals } from "testing/asserts.ts";
import { next, parse, State } from "./lib.ts";

const input = Deno.readTextFileSync(new URL("input.txt", import.meta.url));

Deno.test("parse", () => {
  assertEquals([...parse(`
    Blueprint 1:
      Each ore robot costs 4 ore.
      Each clay robot costs 2 ore.
      Each obsidian robot costs 3 ore and 14 clay.
      Each geode robot costs 2 ore and 7 obsidian.

    Blueprint 2:
      Each ore robot costs 2 ore.
      Each clay robot costs 3 ore.
      Each obsidian robot costs 3 ore and 8 clay.
      Each geode robot costs 3 ore and 12 obsidian.
  `)], [
    [1, {
      ore: { ore: 4 },
      clay: { ore: 2 },
      obsidian: { ore: 3, clay: 14 },
      geode: { ore: 2, obsidian: 7 },
    }],
    [2, {
      ore: { ore: 2 },
      clay: { ore: 3 },
      obsidian: { ore: 3, clay: 8 },
      geode: { ore: 3, obsidian: 12 },
    }],
  ]);
});

Deno.test("State", () => {
  assertEquals<State>(
    State({
      ore: { ore: 4 },
      clay: { ore: 2 },
      obsidian: { ore: 3, clay: 14 },
      geode: { ore: 2, obsidian: 7 },
    }),
    {
      blueprint: {
        ore: { ore: 4 },
        clay: { ore: 2 },
        obsidian: { ore: 3, clay: 14 },
        geode: { ore: 2, obsidian: 7 },
      },
      minute: 0,
      robots: {
        active: { ore: 1, clay: 0, obsidian: 0, geode: 0 },
        queued: { ore: 0, clay: 0, obsidian: 0, geode: 0 },
      },
      resources: { ore: 0, clay: 0, obsidian: 0, geode: 0 },
    },
  );
});

Deno.test("next (simple)", () => {
  const blueprint = {
    ore: { ore: 4 },
    clay: { ore: 2 },
    obsidian: { ore: 3, clay: 14 },
    geode: { ore: 2, obsidian: 7 },
  };

  let state = State(blueprint);
  const states = Array.from({ length: 8 }, () => {
    state = next(state);
    return state;
  });

  assertEquals(states, [{
    blueprint,
    minute: 1,
    robots: {
      active: { ore: 1, clay: 0, obsidian: 0, geode: 0 },
      queued: { ore: 0, clay: 0, obsidian: 0, geode: 0 },
    },
    resources: { ore: 1, clay: 0, obsidian: 0, geode: 0 },
  }, {
    blueprint,
    minute: 2,
    robots: {
      active: { ore: 1, clay: 0, obsidian: 0, geode: 0 },
      queued: { ore: 0, clay: 0, obsidian: 0, geode: 0 },
    },
    resources: { ore: 2, clay: 0, obsidian: 0, geode: 0 },
  }, {
    blueprint,
    minute: 3,
    robots: {
      active: { ore: 1, clay: 1, obsidian: 0, geode: 0 },
      queued: { ore: 0, clay: 0, obsidian: 0, geode: 0 },
    },
    resources: { ore: 1, clay: 0, obsidian: 0, geode: 0 },
  }, {
    blueprint,
    minute: 4,
    robots: {
      active: { ore: 1, clay: 1, obsidian: 0, geode: 0 },
      queued: { ore: 0, clay: 0, obsidian: 0, geode: 0 },
    },
    resources: { ore: 2, clay: 1, obsidian: 0, geode: 0 },
  }, {
    blueprint,
    minute: 5,
    robots: {
      active: { ore: 1, clay: 2, obsidian: 0, geode: 0 },
      queued: { ore: 0, clay: 0, obsidian: 0, geode: 0 },
    },
    resources: { ore: 1, clay: 2, obsidian: 0, geode: 0 },
  }, {
    blueprint,
    minute: 6,
    robots: {
      active: { ore: 1, clay: 2, obsidian: 0, geode: 0 },
      queued: { ore: 0, clay: 0, obsidian: 0, geode: 0 },
    },
    resources: { ore: 2, clay: 4, obsidian: 0, geode: 0 },
  }, {
    blueprint,
    minute: 7,
    robots: {
      active: { ore: 1, clay: 3, obsidian: 0, geode: 0 },
      queued: { ore: 0, clay: 0, obsidian: 0, geode: 0 },
    },
    resources: { ore: 1, clay: 6, obsidian: 0, geode: 0 },
  }, {
    blueprint,
    minute: 8,
    robots: {
      active: { ore: 1, clay: 3, obsidian: 0, geode: 0 },
      queued: { ore: 0, clay: 0, obsidian: 0, geode: 0 },
    },
    resources: { ore: 2, clay: 9, obsidian: 0, geode: 0 },
  }]);
});

Deno.test("next (smart)", { ignore: true }, () => {
  const blueprint = {
    ore: { ore: 4 },
    clay: { ore: 2 },
    obsidian: { ore: 3, clay: 14 },
    geode: { ore: 2, obsidian: 7 },
  };
  let state = State(blueprint);

  while (state.minute < 9) {
    state = next(state);
  }
  assertEquals(state, {
    blueprint,
    minute: 9,
    robots: {
      active: { ore: 1, clay: 3, obsidian: 0, geode: 0 },
      queued: { ore: 0, clay: 0, obsidian: 0, geode: 0 },
    },
    resources: { ore: 3, clay: 12, obsidian: 0, geode: 0 },
  });
});

Deno.test("part 1", { ignore: true }, () => {
});
