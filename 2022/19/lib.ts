type DeepWriteable<T> = { -readonly [P in keyof T]: DeepWriteable<T[P]> };

interface Blueprint {
  readonly ore: { readonly ore: number };
  readonly clay: { readonly ore: number };
  readonly obsidian: { readonly ore: number; readonly clay: number };
  readonly geode: { readonly ore: number; readonly obsidian: number };
}
function Blueprint(): Blueprint {
  return {
    ore: { ore: 0 },
    clay: { ore: 0 },
    obsidian: { ore: 0, clay: 0 },
    geode: { ore: 0, obsidian: 0 },
  };
}

type ActiveRobots = { readonly [Resource in keyof Blueprint]: number };
function ActiveRobots(): ActiveRobots {
  return { ore: 1, clay: 0, obsidian: 0, geode: 0 };
}

type QueuedRobots = { readonly [Resource in keyof Blueprint]: number };
function QueuedRobots(): QueuedRobots {
  return { ore: 0, clay: 0, obsidian: 0, geode: 0 };
}

type Resources = { readonly [Resource in keyof Blueprint]: number };
function Resources(): Resources {
  return { ore: 0, clay: 0, obsidian: 0, geode: 0 };
}

export interface State {
  readonly blueprint: Blueprint;
  readonly minute: number;
  readonly robots: {
    readonly active: ActiveRobots;
    readonly queued: QueuedRobots;
  };
  readonly resources: Resources;
}
export function State(blueprint: Blueprint): State {
  return {
    blueprint,
    minute: 0,
    robots: {
      active: ActiveRobots(),
      queued: QueuedRobots(),
    },
    resources: Resources(),
  };
}

export function* parse(input: string): IterableIterator<[number, Blueprint]> {
  let n = 0;
  let blueprint: DeepWriteable<Blueprint> | undefined;
  for (
    const [, kind, oreCost, otherCost] of input.matchAll(
      /(ore|clay|obsidian|geode) robot costs (\d+) ore(?: and (\d+))?/g,
    )
  ) {
    blueprint ||= Blueprint();
    switch (kind) {
      case "ore":
        blueprint.ore.ore = Number(oreCost);
        break;
      case "clay":
        blueprint.clay.ore = Number(oreCost);
        break;
      case "obsidian":
        blueprint.obsidian.ore = Number(oreCost);
        blueprint.obsidian.clay = Number(otherCost);
        break;
      case "geode":
        blueprint.geode.ore = Number(oreCost);
        blueprint.geode.obsidian = Number(otherCost);
        n += 1;
        yield [n, blueprint];
        blueprint = undefined;
        break;
    }
  }
}

function buildOreRobot({
  blueprint,
  resources,
  robots,
}: DeepWriteable<State>): void {
  const costs = blueprint.ore;
  if (costs.ore <= resources.ore) {
    resources.ore -= costs.ore;
    robots.queued.ore += 1;
  }
}

function buildClayRobot({
  blueprint,
  resources,
  robots,
}: DeepWriteable<State>): void {
  const costs = blueprint.clay;
  if (costs.ore <= resources.ore) {
    resources.ore -= costs.ore;
    robots.queued.clay += 1;
  }
}

function buildObsidianRobot({
  blueprint,
  resources,
  robots,
}: DeepWriteable<State>): void {
  const costs = blueprint.obsidian;
  if (costs.ore <= resources.ore && costs.clay <= resources.clay) {
    resources.ore -= costs.ore;
    resources.clay -= costs.clay;
    robots.queued.obsidian += 1;
  }
}

function buildGeodeRobot({
  blueprint,
  resources,
  robots,
}: DeepWriteable<State>): void {
  const costs = blueprint.geode;
  if (costs.ore <= resources.ore && costs.obsidian <= resources.obsidian) {
    resources.ore -= costs.ore;
    resources.obsidian -= costs.obsidian;
    robots.queued.geode += 1;
  }
}

function collectResources({
  resources,
  robots,
}: DeepWriteable<State>): void {
  resources.ore += robots.active.ore;
  resources.clay += robots.active.clay;
  resources.obsidian += robots.active.obsidian;
  resources.geode += robots.active.geode;
}

function finishBuilding({
  robots,
}: DeepWriteable<State>): void {
  robots.active.ore += robots.queued.ore;
  robots.active.clay += robots.queued.clay;
  robots.active.obsidian += robots.queued.obsidian;
  robots.active.geode += robots.queued.geode;
  robots.queued.ore = 0;
  robots.queued.clay = 0;
  robots.queued.obsidian = 0;
  robots.queued.geode = 0;
}

export function next(state: State): State {
  const nextState: DeepWriteable<State> = structuredClone(state);

  buildOreRobot(nextState);
  buildClayRobot(nextState);
  buildObsidianRobot(nextState);
  buildGeodeRobot(nextState);

  collectResources(nextState);
  finishBuilding(nextState);

  nextState.minute += 1;

  return nextState;
}
