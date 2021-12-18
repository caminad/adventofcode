type Dot = `${number},${number}`;
type Fold = { readonly x: number } | { readonly y: number };

export class Manual {
  readonly #dots: ReadonlySet<Dot>;
  readonly #folds: ReadonlyArray<Fold>;
  constructor(dots: Iterable<Dot>, folds: Iterable<Fold>) {
    this.#dots = new Set(dots);
    this.#folds = Array.from(folds);
  }

  static parse(s: string): Manual {
    return new Manual(
      s.match(/\d+,\d+/g) as Dot[],
      Array.from(
        s.matchAll(/(x|y)=(\d+)/g),
        (m) => ({ [m[1]]: Number(m[2]) } as Fold),
      ),
    );
  }

  get size(): number {
    return this.#dots.size;
  }

  #reflect(dot: Dot): Dot {
    const fold = this.#folds.at(0);
    if (!fold) return dot;
    let [x, y] = dot.split(",").map(Number);
    if ("x" in fold && x > fold.x) x = 2 * fold.x - x;
    if ("y" in fold && y > fold.y) y = 2 * fold.y - y;
    return `${x},${y}`;
  }

  fold(): Manual {
    const dots = Array.from(this.#dots, (dot) => this.#reflect(dot));
    return new Manual(dots, this.#folds.slice(1));
  }

  foldAll(): Manual {
    if (this.#folds.length === 0) return this;
    return this.fold().foldAll();
  }

  #dimensions(): [width: number, height: number] {
    let [width, height] = [0, 0];
    for (const dot of this.#dots) {
      const [x, y] = dot.split(",").map(Number);
      if (x >= width) width = x + 1;
      if (y >= height) height = y + 1;
    }
    return [width, height];
  }

  #charAt(x: number, y: number): string {
    if (this.#dots.has(`${x},${y}`)) return "██";
    const fold = this.#folds.at(0);
    if (fold) {
      if ("x" in fold && fold.x === x) return "▕ ";
      if ("y" in fold && fold.y === y) return "━━";
    }
    return "  ";
  }

  #rowAt(y: number, width: number): string {
    return Array.from(Array(width).keys(), (x) => this.#charAt(x, y))
      .join("");
  }

  toString(): string {
    const [width, height] = this.#dimensions();
    const result = [];
    result.push("┌─" + "──".repeat(width) + "─┐");
    for (let y = 0; y < height; y++) {
      result.push("│ " + this.#rowAt(y, width) + " │");
    }
    result.push("└─" + "──".repeat(width) + "─┘");
    return result.join("\n");
  }
}
