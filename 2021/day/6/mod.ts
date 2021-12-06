export function parseInput(input: string): number[] {
  return input.match(/\d+/g)!.map(Number);
}

export function simulate(state: number[], days: number): void {
  for (let day = 0; day < days; day++) {
    for (const i in state) {
      if (state[i] === 0) {
        state[i] = 6;
        state.push(8);
      } else {
        state[i]--;
      }
    }
  }
}
