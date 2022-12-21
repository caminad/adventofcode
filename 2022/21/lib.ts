type Op = "+" | "-" | "*" | "/";
type Job = number | readonly [string, Op, string];

export function* parse(
  input: string,
): IterableIterator<[label: string, value: Job]> {
  for (
    const [, label, value, lhs, op, rhs] of input.matchAll(
      /([a-z]{4}): (?:(\d+)|([a-z]{4}) ([*/+-]) ([a-z]{4}))/g,
    )
  ) {
    yield [label, value ? Number(value) : [lhs, op as Op, rhs]];
  }
}

export class Jobs {
  readonly #jobs: ReadonlyMap<string, Job>;
  constructor(iterable: Iterable<[label: string, value: Job]>) {
    this.#jobs = new Map(iterable);
  }

  resolve(label: string): number {
    const job = this.#jobs.get(label);
    if (!job) {
      throw new Error(`No job for ${label}`);
    }
    if (typeof job === "number") {
      return job;
    }
    const [lhs, op, rhs] = job;
    switch (op) {
      case "+":
        return this.resolve(lhs) + this.resolve(rhs);
      case "-":
        return this.resolve(lhs) - this.resolve(rhs);
      case "*":
        return this.resolve(lhs) * this.resolve(rhs);
      case "/":
        return this.resolve(lhs) / this.resolve(rhs);
      default:
        throw new Error(`Unknown op ${op}`);
    }
  }
}
