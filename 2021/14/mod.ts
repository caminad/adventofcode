export function parseInput(input: string): [
  polymerTemplate: string,
  pairInsertionRules: ReadonlyMap<string, string>,
] {
  const [polymerTemplate] = input.match(/\w+/) ?? [""];
  const pairInsertionRules = new Map(
    Array.from(input.matchAll(/(\w+) -> (\w+)/g), (m) => [m[1], m[2]]),
  );
  return [polymerTemplate, pairInsertionRules];
}

export function getNextStep(
  polymerTemplate: string,
  pairInsertionRules: ReadonlyMap<string, string>,
): string {
  return polymerTemplate[0] + Array.from(polymerTemplate.slice(1), (c, i) => {
    const insertion = pairInsertionRules.get(`${polymerTemplate[i]}${c}`) ?? "";
    return insertion + c;
  }).join("");
}

export function getSteps(
  n: number,
  polymerTemplate: string,
  pairInsertionRules: ReadonlyMap<string, string>,
): readonly string[] {
  const steps: string[] = [polymerTemplate];
  for (const i of Array(n).keys()) {
    steps.push(getNextStep(steps[i], pairInsertionRules));
  }
  return steps;
}

export function getElementCounts(step: string): ReadonlyMap<string, number> {
  const counts = new Map<string, number>();
  for (const c of step) {
    counts.set(c, (counts.get(c) ?? 0) + 1);
  }
  return counts;
}
