export class Grid {
  static #elevations: ReadonlyMap<string, number> = new Map(
    Array.from("SabcdefghijklmnopqrstuvwxyzE", (c, i) => [c, i]),
  );

  static parse(input: string): Grid {
    return this.from(
      Array.from(input.matchAll(/[Sa-zE]+/g), ([chars]) => chars),
    );
  }

  static from(iterable: Iterable<Iterable<string>>): Grid {
    let first: Grid | undefined = undefined;
    let rowAbove: Grid | undefined = undefined;
    for (const row of iterable) {
      let rowFirst: Grid | undefined = undefined;
      let left: Grid | undefined = undefined;
      for (const value of row) {
        const node = new this(value);
        if (left) {
          node.#left = left;
          left.#right = node;
          if (left.#above && left.#above.#right) {
            node.#above = left.#above.#right;
            left.#above.#right.#below = node;
          }
        } else if (rowAbove) {
          // nothing to the left
          node.#above = rowAbove;
          rowAbove.#below = node;
        } else {
          first = node;
        }
        rowFirst ??= node;
        left = node;
      }
      rowAbove = rowFirst;
    }
    if (!first) {
      throw new Error("iterable is empty");
    }
    return first;
  }

  #value: string;
  #above?: Grid;
  #below?: Grid;
  #left?: Grid;
  #right?: Grid;
  constructor(value: string) {
    this.#value = value;
  }

  get [Symbol.toStringTag](): string {
    return "Grid";
  }

  [Symbol.toPrimitive](hint: "number" | "string" | "default"): number | string {
    if (hint === "number") {
      return Grid.#elevations.get(this.#value) ?? -1;
    }
    return this.#value;
  }

  *#row(): Iterable<Grid> {
    yield this;
    if (this.#right) {
      yield* this.#right.#row();
    }
  }

  *[Symbol.iterator](): IterableIterator<string[]> {
    yield Array.from(this.#row(), (node) => node.#value);
    if (this.#below) {
      yield* this.#below;
    }
  }

  #find(value: string): Grid | undefined {
    for (const node of this.#row()) {
      if (node.#value === value) {
        return node;
      }
    }
    if (this.#below) {
      return this.#below.#find(value);
    }
  }

  findStart(): Grid | undefined {
    return this.#find("S");
  }

  findEnd(): Grid | undefined {
    return this.#find("E");
  }
}
