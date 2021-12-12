export function parseInput(input: string): number[] {
  return input.match(/\d+/g)!.map(Number);
}

export function simulate(population: readonly number[], days: number): number {
  const timers = population.reduce((a, day) => (a[day]++, a), Array(9).fill(0));
  for (let day = 0; day < days; day++) {
    const parents = timers.shift();
    timers[6] += parents; // reintroduce parents with timer 6
    timers.push(parents); // offspring are born with timer 8
  }
  return timers.reduce((a, b) => a + b);
}
