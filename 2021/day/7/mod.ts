export function parseInput(input: string): number[] {
  return input.match(/\d+/g)!.map(Number);
}

export function getCost(positions: number[], destination: number): number {
  return positions.reduce((sum, p) => sum + Math.abs(destination - p), 0);
}

export function findCheapestDestination(
  positions: number[],
): [destination: number, cost: number] {
  const destinationCosts: [destination: number, cost: number][] = Array.from({
    length: Math.max(...positions) + 1,
  }, (_, destination) => [destination, getCost(positions, destination)]);
  return destinationCosts.sort((a, b) => a[1] - b[1])[0];
}
