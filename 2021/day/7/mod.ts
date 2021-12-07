export function parseInput(input: string): number[] {
  return input.match(/\d+/g)!.map(Number);
}

export function distance(position: number, destination: number): number {
  return Math.abs(position - destination);
}

export function triangle(value: number): number {
  return value * (value + 1) / 2;
}

function getCounts(positions: number[]): number[] {
  const counts = Array(Math.max(...positions) + 1).fill(0);
  for (const position of positions) {
    counts[position]++;
  }
  return counts;
}

export function findCheapestDestination(
  positions: number[],
  costFn = distance,
): { cost: number; destination: number } {
  const positionCounts = new Map<number, number>();
  for (const position of positions) {
    positionCounts.set(position, (positionCounts.get(position) ?? 0) + 1);
  }

  let cost = Infinity, destination = 0;
  while (true) {
    let nextCost = 0;
    for (const [position, count] of positionCounts) {
      nextCost += costFn(position, destination + 1) * count;
    }
    if (nextCost >= cost) {
      return { cost, destination };
    }
    destination++;
    cost = nextCost;
  }
}
