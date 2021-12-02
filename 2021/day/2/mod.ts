export function* parseInput(
  input: string
): IterableIterator<readonly [dx: number, dy: number]> {
  for (const match of input.matchAll(/\b(forward|up|down) (\d+)/g)) {
    const magnitude = Number(match[2]);
    switch (match[1]) {
      case "forward": {
        yield [magnitude, 0];
        break;
      }
      case "down": {
        yield [0, magnitude];
        break;
      }
      case "up": {
        yield [0, -magnitude];
        break;
      }
    }
  }
}

export function followCourse(
  course: Iterable<readonly [dx: number, dy: number]>
): readonly [x: number, y: number] {
  let [x, y] = [0, 0];
  for (const [dx, dy] of course) {
    x += dx;
    y += dy;
  }
  return [x, y];
}
