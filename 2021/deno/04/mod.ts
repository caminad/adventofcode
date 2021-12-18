export class Board {
  readonly size = 5;

  constructor(readonly values: number[]) {}

  checkValue(row: number, col: number, draw: Set<number>): boolean {
    const value = this.values.at((row * this.size) + col);
    return typeof value !== "undefined" && draw.has(value);
  }

  checkRow(row: number, draw: Set<number>): boolean {
    for (let col = 0; col < this.size; col++) {
      if (!this.checkValue(row, col, draw)) return false;
    }
    return true;
  }

  checkCol(col: number, draw: Set<number>): boolean {
    for (let row = 0; row < this.size; row++) {
      if (!this.checkValue(row, col, draw)) return false;
    }
    return true;
  }

  isWinner(draw: Set<number>): boolean {
    for (let n = 0; n < this.size; n++) {
      if (this.checkRow(n, draw) || this.checkCol(n, draw)) return true;
    }
    return false;
  }
}

function parseNumbers(input: string): number[] {
  return input.match(/\d+/g)!.map(Number);
}

export class Game {
  constructor(readonly pool: number[], readonly boards: Board[]) {}

  static parse(input: string): Game {
    const [pool, ...boards] = input.split("\n\n").map(parseNumbers);
    return new Game(pool, boards.map((b) => new Board(b)));
  }

  play() {
    const winners: [marked: number[], board: Board][] = [];
    const draw = new Set<number>();
    let boards = this.boards;

    for (const called of this.pool) {
      draw.add(called);
      for (const board of boards) {
        if (board.isWinner(draw)) {
          boards = boards.filter((b) => b !== board);
          winners.push([[...draw], board]);
        }
      }
    }
    return winners;
  }
}

export function score(marked: number[], board: Board): number {
  const sum = board.values
    .filter((value) => !marked.includes(value))
    .reduce((a, b) => a + b, 0);

  return sum * marked.at(-1)!;
}
