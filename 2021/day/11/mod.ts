interface Octopus {
  energy: number;
  north?: Octopus;
  south?: Octopus;
  west?: Octopus;
  east?: Octopus;
}

export class Octopuses implements IterableIterator<{ flashes: number }> {
  readonly #side = 10;
  #values = Array.from(
    Array(this.#side ** 2),
    (): Octopus => ({ energy: 0 }),
  ).map((octopus, i, a) => {
    const row = Math.floor(i / this.#side);
    const col = i % this.#side;
    if (row > 0) {
      octopus.north = a[i - this.#side];
    }
    if (row < this.#side - 1) {
      octopus.south = a[i + this.#side];
    }
    if (col > 0) {
      octopus.west = a[i - 1];
    }
    if (col < this.#side - 1) {
      octopus.east = a[i + 1];
    }
    return octopus;
  });
  #flashes = 0;

  static parse(input: string): Octopuses {
    const octopuses = new Octopuses();
    const energies = Array.from(input.matchAll(/\d/g), Number);
    for (const [offset, energy] of energies.entries()) {
      octopuses.#values[offset].energy = energy;
    }
    return octopuses;
  }

  *#lateralNeighborhood(
    octopus: Octopus | undefined,
  ): IterableIterator<Octopus> {
    if (octopus?.west && octopus.west.energy > 0) yield octopus.west;
    if (octopus && octopus.energy > 0) yield octopus;
    if (octopus?.east && octopus.east.energy > 0) yield octopus.east;
  }

  *#neighborhood(octopus: Octopus) {
    yield* this.#lateralNeighborhood(octopus.north);
    yield* this.#lateralNeighborhood(octopus);
    yield* this.#lateralNeighborhood(octopus.south);
  }

  #flash(octopus: Octopus) {
    octopus.energy = 0;
    this.#flashes++;
    for (const neighbor of this.#neighborhood(octopus)) neighbor.energy++;
  }

  next() {
    for (const octopus of this.#values) octopus.energy++;
    let flashers;
    do {
      flashers = this.#values.filter((octopus) => octopus.energy > 9);
      flashers.forEach((octopus) => this.#flash(octopus));
    } while (flashers.length > 0);
    return { value: { flashes: this.#flashes } };
  }

  [Symbol.iterator]() {
    return this;
  }

  toString() {
    return Array.from(
      Array(10),
      (_, row) =>
        this.#values.slice(row * this.#side, (row + 1) * this.#side)
          .map((o) => o.energy).join(""),
    )
      .join("\n");
  }
}
