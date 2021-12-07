export function parseInput(input: string): number[] {
  return input.match(/\d+/g)!.map(Number);
}

export function distance(position: number, destination: number): number {
  return Math.abs(position - destination);
}

export function triangle(value: number): number {
  return value * (value + 1) / 2;
}

export function findMinCost(positions: number[], costFn = distance): number {
  const positionCounts = new Map<number, number>();
  for (const position of positions) {
    positionCounts.set(position, (positionCounts.get(position) ?? 0) + 1);
  }

  for (let cost = Infinity, destination = -1;; destination++) {
    let nextCost = 0;
    for (const [position, count] of positionCounts) {
      nextCost += costFn(position, destination + 1) * count;
    }
    if (nextCost >= cost) return cost;
    cost = nextCost;
  }
}
