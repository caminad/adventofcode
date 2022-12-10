type Vector = readonly [x: number, y: number];
function Vector(x: number, y: number): Vector {
  return [x, y];
}
Vector.add = function add(a: Vector, b: Vector): Vector {
  return [a[0] + b[0], a[1] + b[1]];
};
Vector.subtract = function subtract(a: Vector, b: Vector): Vector {
  return [a[0] - b[0], a[1] - b[1]];
};
Vector.sign = function sign(a: Vector): Vector {
  return [Math.sign(a[0]), Math.sign(a[1])];
};
Vector.equal = function equal(a: Vector, b: Vector): boolean {
  return a[0] === b[0] && a[1] === b[1];
};

const DIRECTIONS = {
  D: Vector(0, -1),
  L: Vector(-1, 0),
  R: Vector(1, 0),
  U: Vector(0, 1),
} as const;
type Direction = keyof typeof DIRECTIONS;

export function* parse(
  input: string,
): IterableIterator<[direction: Direction, units: number]> {
  for (const [, direction, units] of input.matchAll(/([DLRU]) (\d+)/g)) {
    yield [direction as "D" | "L" | "R" | "U", Number(units)];
  }
}

const INITIAL_STATE = {
  head: Vector(0, 0),
  tail: Vector(0, 0),
} as const;
type State = typeof INITIAL_STATE;

function moveHead(state: State, direction: Direction): State {
  return { ...state, head: Vector.add(state.head, DIRECTIONS[direction]) };
}

function moveTail(state: State): State {
  const offset = Vector.subtract(state.head, state.tail);
  if (offset.every((a) => a < 2 && a > -2)) {
    return state;
  }
  return { ...state, tail: Vector.add(state.tail, Vector.sign(offset)) };
}

export function move(state: State, direction: Direction): State {
  return moveTail(moveHead(state, direction));
}

export function* sequence(
  directions: Iterable<[direction: Direction, units: number]>,
): IterableIterator<State> {
  let state = INITIAL_STATE;
  for (const [direction, units] of directions) {
    for (let i = 0; i < units; i++) {
      state = move(state, direction);
      yield state;
    }
  }
}
