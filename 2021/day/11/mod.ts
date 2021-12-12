export class Octopus implements IterableIterator<number> {
  #energy: number;
  #north?: Octopus;
  #south?: Octopus;
  #west?: Octopus;
  #east?: Octopus;

  constructor(energy: number) {
    this.#energy = energy;
  }

  static parse(input: string): Octopus {
    const octopuses = Array.from(
      input.matchAll(/\d/g),
      ([d]) => new Octopus(Number(d)),
    );
    const side = Math.floor(Math.sqrt(octopuses.length));
    octopuses.forEach((octopus, index, octopuses) => {
      if (index / side < side - 1) {
        octopus.#south = octopuses[index + side];
        octopus.#south.#north = octopus;
      }
      if (index % side < side - 1) {
        octopus.#east = octopuses[index + 1];
        octopus.#east.#west = octopus;
      }
    });
    return octopuses[0];
  }

  *#horizontal(): IterableIterator<Octopus> {
    yield this;
    if (this.#east) yield* this.#east.#horizontal();
  }

  *#swarm(): IterableIterator<Octopus> {
    yield* this.#horizontal();
    if (this.#south) yield* this.#south.#swarm();
  }

  toString(): string {
    const row = Array.from(this.#horizontal(), (o) => o.#energy).join("");
    if (this.#south) return row + "\n" + this.#south.toString();
    return row;
  }

  *#rowNeighborhood(): IterableIterator<Octopus> {
    if (this.#west && this.#west.#energy) yield this.#west;
    if (this.#energy) yield this;
    if (this.#east && this.#east.#energy) yield this.#east;
  }

  *#neighborhood(): IterableIterator<Octopus> {
    if (this.#north) yield* this.#north.#rowNeighborhood();
    yield* this.#rowNeighborhood();
    if (this.#south) yield* this.#south.#rowNeighborhood();
  }

  #willFlash(): Octopus[] {
    return Array.from(this.#swarm()).filter((o) => o.#energy > 9);
  }

  #flash(): number {
    const willFlash = this.#willFlash();
    if (!willFlash.length) return 0;
    for (const octopus of willFlash) {
      octopus.#energy = 0;
      for (const neighbor of octopus.#neighborhood()) neighbor.#energy++;
    }
    return willFlash.length + this.#flash();
  }

  next(): IteratorResult<number, number> {
    for (const octopus of this.#swarm()) octopus.#energy++;
    const value = this.#flash();
    for (const octopus of this.#swarm()) {
      if (octopus.#energy) return { value };
    }
    return { value, done: true };
  }

  countFlashes(steps: number): number {
    let count = 0;
    while (steps-- > 0) count += this.next().value;
    return count;
  }

  [Symbol.iterator]() {
    return this;
  }
}
