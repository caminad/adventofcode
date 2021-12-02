export type Direction = "forward" | "down" | "up";
export function Direction(value: unknown): Direction {
  switch (value) {
    case "forward":
    case "down":
    case "up":
      return value;
    default:
      throw new TypeError(`Not a direction: ${value}`);
  }
}

export interface SubmarineCommand {
  readonly direction: Direction;
  readonly magnitude: number;
}
export function SubmarineCommand(
  direction: unknown,
  magnitude: unknown,
): SubmarineCommand {
  return {
    direction: Direction(direction),
    magnitude: Number(magnitude),
  };
}

export function* parseSubmarineCommands(
  input: string,
): IterableIterator<SubmarineCommand> {
  for (const match of input.matchAll(/(\w+) (\d+)/g)) {
    yield SubmarineCommand(match[1], match[2]);
  }
}

export interface SubmarineState {
  readonly position: number;
  readonly depth: number;
  readonly aim: number;
}
export function SubmarineState(
  position = 0,
  depth = 0,
  aim = 0,
): SubmarineState {
  return { position, depth, aim };
}

export function reduce<Item, State>(
  items: Iterable<Item>,
  reducer: (state: State, item: Item) => State,
  state: State,
): State {
  for (const item of items) {
    state = reducer(state, item);
  }
  return state;
}

export function move1(
  prevState: SubmarineState,
  command: SubmarineCommand,
): SubmarineState {
  const state = { ...prevState };
  switch (command.direction) {
    case "forward":
      state.position += command.magnitude;
      break;
    case "down":
      state.depth += command.magnitude;
      break;
    case "up":
      state.depth -= command.magnitude;
  }
  return state;
}

export function move2(
  prevState: SubmarineState,
  command: SubmarineCommand,
): SubmarineState {
  const state = { ...prevState };
  switch (command.direction) {
    case "forward":
      state.position += command.magnitude;
      state.depth += state.aim * command.magnitude;
      break;
    case "down":
      state.aim += command.magnitude;
      break;
    case "up":
      state.aim -= command.magnitude;
  }
  return state;
}
