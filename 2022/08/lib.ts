type Point = { row: number; col: number };

export function* parse(input: string): IterableIterator<number[]> {
  for (const [heights] of input.matchAll(/\d+/g)) {
    yield Array.from(heights, Number);
  }
}

export class Grid {
  readonly #rows: number[][];

  constructor(rows: Iterable<Iterable<number>>) {
    this.#rows = Array.from(rows, (row) => Array.from(row));
  }

  visible(point: Point): boolean {
    const height = this.#rows[point.row][point.col];
    return (
      this.#exterior(point) ||
      this.#northOf(point).every((h) => h < height) ||
      this.#southOf(point).every((h) => h < height) ||
      this.#westOf(point).every((h) => h < height) ||
      this.#eastOf(point).every((h) => h < height)
    );
  }

  totalVisible(): number {
    let total = 0;
    for (const [row, cols] of this.#rows.entries()) {
      for (const col of cols.keys()) {
        if (this.visible({ row, col })) {
          total += 1;
        }
      }
    }
    return total;
  }

  #exterior(point: Point): boolean {
    return (
      point.row === 0 || point.row === this.#rows.length - 1 ||
      point.col === 0 || point.col === this.#rows[point.row].length - 1
    );
  }

  #northOf(point: Point): number[] {
    return this.#rows.slice(0, point.row).map((row) => row[point.col]);
  }

  #southOf(point: Point): number[] {
    return this.#rows.slice(point.row + 1).map((row) => row[point.col]);
  }

  #westOf(point: Point): number[] {
    return this.#rows[point.row].slice(0, point.col);
  }

  #eastOf(point: Point): number[] {
    return this.#rows[point.row].slice(point.col + 1);
  }
}
