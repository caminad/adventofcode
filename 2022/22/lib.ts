interface Row {
  readonly start: number;
  readonly end: number;
  readonly walls: readonly number[];
}

export function* parseRows(
  input: string,
): Generator<Row, void, never> {
  for (const m of input.matchAll(/^( *)([.#]+)$/mg)) {
    const start = m[1].length + 1;
    const end = m[1].length + m[2].length;
    const walls = Array.from(m[2].matchAll(/#/g), (m) => start + m.index!);
    yield { start, end, walls };
  }
}

type Instruction = "L" | "R" | number;
function Instruction(value: string | number): Instruction {
  switch (value) {
    case "L":
    case "R":
      return value;
  }
  return Number(value);
}

export function* parseInstructions(
  input: string,
): Generator<Instruction, void, never> {
  for (const m of input.matchAll(/L|R|\d+/g)) {
    yield Instruction(m[0]);
  }
}

enum Facing {
  Right,
  Down,
  Left,
  Up,
}

interface Position {
  readonly row: number;
  readonly col: number;
  readonly facing: Facing;
}

function turnRight(position: Position): Position {
  return { ...position, facing: (position.facing + 1) % 4 };
}

function turnLeft(position: Position): Position {
  return { ...position, facing: (position.facing + 3) % 4 };
}

export class MonkeyMap {
  readonly #rows: Row[];
  constructor(rows: Iterable<Row>) {
    this.#rows = [...rows];
  }

  #initialPosition(): Position {
    return {
      row: 1,
      col: this.#rows[0].start,
      facing: Facing.Right,
    };
  }

  #stepRight(position: Position): Position {
    const { start, end, walls } = this.#rows[position.row - 1];
    let col = position.col + 1;
    if (col > end) {
      col = start;
    }
    if (walls.includes(col)) {
      return position;
    }
    return { ...position, col };
  }

  #stepLeft(position: Position): Position {
    const { start, end, walls } = this.#rows[position.row - 1];
    let col = position.col - 1;
    if (col < start) {
      col = end;
    }
    if (walls.includes(col)) {
      return position;
    }
    return { ...position, col };
  }

  #stepDown(position: Position): Position {
    let row = position.row + 1;
    if (row > this.#rows.length) {
      row = 1;
    }
    if (
      this.#rows[row - 1].start > position.col ||
      this.#rows[row - 1].end < position.col
    ) {
      row = this.#rows.findIndex((r) =>
        r.start <= position.col && r.end >= position.col
      ) + 1;
    }
    if (this.#rows[row - 1].walls.includes(position.col)) {
      return position;
    }
    return { ...position, row };
  }

  #stepUp(position: Position): Position {
    let row = position.row - 1;
    if (row < 1) {
      row = this.#rows.length;
    }
    if (
      this.#rows[row - 1].start > position.col ||
      this.#rows[row - 1].end < position.col
    ) {
      row = this.#rows.findLastIndex((r) =>
        r.start <= position.col && r.end >= position.col
      ) + 1;
    }
    if (this.#rows[row - 1].walls.includes(position.col)) {
      return position;
    }
    return { ...position, row };
  }

  #step(position: Position): Position {
    switch (position.facing) {
      case Facing.Right:
        return this.#stepRight(position);
      case Facing.Down:
        return this.#stepDown(position);
      case Facing.Left:
        return this.#stepLeft(position);
      case Facing.Up:
        return this.#stepUp(position);
    }
  }

  #nextPosition(position: Position, instruction: Instruction): Position {
    switch (instruction) {
      case "L":
        return turnLeft(position);
      case "R":
        return turnRight(position);
    }
    let nextPosition = position;
    do {
      nextPosition = this.#step(nextPosition);
      instruction -= 1;
    } while (instruction > 0 && nextPosition !== position);
    return nextPosition;
  }

  follow(instructions: Iterable<Instruction>): Position {
    let position = this.#initialPosition();
    for (const instruction of instructions) {
      position = this.#nextPosition(position, instruction);
    }
    return position;
  }
}

export function getPassword({ row, col, facing }: Position): number {
  return 1000 * row + 4 * col + facing;
}
