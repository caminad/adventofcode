export class Cave {
  readonly #connections = new Set<Cave>();

  constructor(readonly name: string) {}

  isBig() {
    return /[A-Z]/.test(this.name);
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

  *path(trail: Cave[] = []): IterableIterator<Cave[]> {
    trail = [...trail, this];
    if (this.name === "end") {
      yield trail;
      return;
    }
    for (const other of this.#connections) {
      if (other.isBig() || !trail.includes(other)) {
        yield* other.path(trail);
      }
    }
  }
}
