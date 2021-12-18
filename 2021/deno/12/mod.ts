export class Cave {
  readonly #connections = new Set<Cave>();

  constructor(readonly name: string) {}

  isSmall() {
    return /[a-z]/.test(this.name);
  }

  static parse(input: string): Cave {
    const caves = new Map<string, Cave>();
    for (const m of input.matchAll(/(\w+)-(\w+)/gi)) {
      let from = caves.get(m[1]);
      if (!from) caves.set(m[1], from = new Cave(m[1]));
      let to = caves.get(m[2]);
      if (!to) caves.set(m[2], to = new Cave(m[2]));
      from.#connections.add(to);
      to.#connections.add(from);
    }
    return caves.get("start") ?? new Cave("start");
  }

  *#allConnections(seen = new WeakSet<Cave>()): IterableIterator<[Cave, Cave]> {
    if (seen.has(this)) return;
    for (const other of this.#connections) {
      if (!seen.has(other)) yield [this, other];
    }
    seen.add(this);
    for (const other of this.#connections) {
      yield* other.#allConnections(seen);
    }
  }

  allConnections() {
    return this.#allConnections();
  }

  toString() {
    return this.name;
  }

  *path(revisits = 0, trail: Cave[] = []): IterableIterator<Cave[]> {
    if (this === trail[0]) return;
    if (this.isSmall() && trail.includes(this)) {
      if (revisits > 0) {
        revisits--;
      } else {
        return;
      }
    }
    trail = [...trail, this];
    if (this.name === "end") {
      yield trail;
    } else {
      for (const other of this.#connections) {
        yield* other.path(revisits, trail);
      }
    }
  }
}
