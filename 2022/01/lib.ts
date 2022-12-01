export function parse(input: string): number[][] {
  return input.trim().split("\n\n").map((group) =>
    group.split("\n").map(Number)
  );
}

export function sum(numbers: number[]): number {
  return numbers.reduce((a, b) => a + b, 0);
}

export function leaders(groups: number[][]): number[] {
  return groups.map(sum).sort((a, b) => b - a);
}
