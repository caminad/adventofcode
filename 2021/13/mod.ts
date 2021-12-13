type Dot = readonly [x: number, y: number];
type Fold = readonly [axis: "x" | "y", offset: number];

function Dot(m: RegExpMatchArray): [x: number, y: number] {
  return [Number(m[1]), Number(m[2])];
}

function Fold(m: RegExpMatchArray): ["x" | "y", number] {
  if (m[1] === "x" || m[1] === "y") {
    return [m[1], Number(m[2])];
  }
  throw new Error(`Not an axis: ${m[1]}`);
}

export class Manual {
  constructor(
    readonly dots: readonly Dot[],
    readonly folds: readonly Fold[],
  ) {}

  static parse(s: string): Manual {
    return new Manual(
      Array.from(s.matchAll(/(\d+),(\d+)/g), Dot),
      Array.from(s.matchAll(/(x|y)=(\d+)/g), Fold),
    );
  }

  sparseDots() {
    const rows = new Map<number, Set<number>>();
    for (const [x, y] of this.dots) {
      let row = rows.get(y);
      if (!row) rows.set(y, row = new Set());
      row.add(x);
    }
    return rows;
  }

  getSize() {
    let size = 0;
    for (const row of this.sparseDots().values()) {
      size += row.size;
    }
    return size;
  }

  fold(): Manual {
    const [[axis, offset], ...folds] = this.folds;
    const dots: Dot[] = this.dots.map(([x, y]) => {
      if (axis === "y" && y > offset) {
        return [x, 2 * offset - y];
      }
      if (axis === "x" && x > offset) {
        return [2 * offset - x, y];
      }
      return [x, y];
    });
    return new Manual(dots, folds);
  }

  toString() {
    const dots = this.sparseDots();
    const width = Math.max(...this.dots.map((d) => d[0])) + 1;
    const height = Math.max(...this.dots.map((d) => d[1])) + 1;
    return Array.from(Array(height), (_, y) => {
      return Array.from(Array(width), (_, x) => {
        if (dots.get(y)?.has(x)) return "#";
        return ".";
      }).join("");
    }).join("\n");
  }
}
