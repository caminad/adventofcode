export function* parse(input: string): IterableIterator<number> {
  for (const [value] of input.matchAll(/\S+/g)) {
    yield Number(value);
  }
}

export function decrypt(numbers: Iterable<number>, options: {
  multiplier: number;
  passes: number;
}): number[] {
  const currentOrder: Box<number>[] = Array.from(
    numbers,
    (n) => Box(n * options.multiplier),
  );
  const initialOrder: readonly Box<number>[] = Array.from(currentOrder);

  for (let i = 0; i < options.passes; i++) {
    mix(currentOrder, initialOrder);
  }
  return currentOrder.map((box) => box.value);
}

export function coordinates(
  mixed: readonly number[],
): [number, number, number] {
  const index = mixed.indexOf(0);
  return [
    mixed.at((index + 1000) % mixed.length) ?? 0,
    mixed.at((index + 2000) % mixed.length) ?? 0,
    mixed.at((index + 3000) % mixed.length) ?? 0,
  ];
}

type Box<T> = { readonly value: T };
function Box<T>(value: T): Box<T> {
  return { value };
}

function mix(
  currentOrder: Box<number>[],
  initialOrder: readonly Box<number>[] = Array.from(currentOrder),
): void {
  for (const ref of initialOrder) {
    moveElement(currentOrder, currentOrder.indexOf(ref), ref.value);
  }
}

function moveElement<T>(array: T[], from: number, offset: number): void {
  if (offset !== 0) {
    insertWrapped(array, from + offset, ...array.splice(from, 1));
  }
}

function insertWrapped<T>(array: T[], index: number, ...items: T[]): void {
  index %= array.length;
  if (index === 0) {
    array.push(...items);
  } else {
    array.splice(index, 0, ...items);
  }
}
