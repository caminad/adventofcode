export function parseInput(input: string): number[] {
  return input.match(/\d+/g)!.map(Number);
}

export function distance(origin: number, destination: number): number {
  return Math.abs(origin - destination);
}

export function getCost(
  values: number[],
  costFn: (value: number) => number,
): number {
  return values.reduce((sum, value) => sum + costFn(value), 0);
}

export function triangle(value: number): number {
  return value * (value + 1) / 2;
}

export function findCheapestDestination(
  positions: number[],
  costFn: (distance: number) => number = (d) => d,
): { cost: number; destination: number } {
  let cheapestDestination = { cost: Infinity, destination: -1 };
  for (const destination of Array(Math.max(...positions) + 1).keys()) {
    const distances = positions.map((p) => distance(p, destination));
    const cost = distances.reduce((sum, d) => sum + costFn(d), 0);
    if (cost < cheapestDestination.cost) {
      cheapestDestination = { cost, destination };
    }
  }
  return cheapestDestination;
}
