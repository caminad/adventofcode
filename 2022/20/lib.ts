export function* parse(input: string): IterableIterator<number> {
  for (const [value] of input.matchAll(/\S+/g)) {
    yield Number(value);
  }
}

export function mix(numbers: Iterable<number>): number[] {
  const boxes = Array.from(numbers, Box);
  for (const box of Array.from(boxes)) {
    moveElement(boxes, boxes.indexOf(box), box.value);
  }
  return Array.from(boxes, (box) => box.value);
}

export function coordinates(
  mixed: readonly number[],
): [number, number, number] {
  const index = mixed.indexOf(0);
  return [
    atWrapped(mixed, index + 1000),
    atWrapped(mixed, index + 2000),
    atWrapped(mixed, index + 3000),
  ];
}

type Box<T> = { readonly value: T };
function Box<T>(value: T): Box<T> {
  return { value };
}

function moveElement<T>(array: T[], from: number, offset: number): void {
  insertWrapped(array, from + offset, ...array.splice(from, 1));
}

function atWrapped<T>(array: readonly T[], index: number): T {
  return ensure(array.at(index % array.length), "Index out of bounds");
}

function insertWrapped<T>(array: T[], index: number, ...items: T[]): void {
  if (index === 0) {
    array.push(...items);
  } else {
    array.splice(index % array.length, 0, ...items);
  }
}

function ensure<T>(value: T, msg: string): NonNullable<T> {
  if (value == null) throw Error(msg);
  return value;
}
