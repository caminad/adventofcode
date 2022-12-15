type Coords = readonly [x: bigint, y: bigint];

export function* parse(input: string): IterableIterator<[Coords, Coords]> {
  let sensor: Coords | undefined;
  for (const [, x, y] of input.matchAll(/x=(-?\d+), y=(-?\d+)/g)) {
    if (sensor === undefined) {
      sensor = [BigInt(x), BigInt(y)];
    } else {
      yield [sensor, [BigInt(x), BigInt(y)]];
      sensor = undefined;
    }
  }
}

function absDiff(a: bigint, b: bigint): bigint {
  return a > b ? a - b : b - a;
}

function manhattanDistance([x0, y0]: Coords, [x1, y1]: Coords): bigint {
  return absDiff(x0, x1) + absDiff(y0, y1);
}

export class SensorSet {
  readonly #sensors = new Map<bigint, Map<bigint, bigint>>();
  readonly #beacons = new Map<bigint, Set<bigint>>();
  #xmin = 0n;
  #xmax = 0n;
  #ymin = 0n;
  #ymax = 0n;

  constructor(pairs: Iterable<[Coords, Coords]>) {
    for (const [sensor, beacon] of pairs) {
      this.#addSensor(sensor, beacon);
      this.#addBeacon(beacon);
    }
  }

  #updateLimits(x: bigint, y: bigint, distance: bigint): void {
    const xmin = x - distance;
    const xmax = x + distance;
    const ymin = y - distance;
    const ymax = y + distance;
    this.#xmin = xmin < this.#xmin ? xmin : this.#xmin;
    this.#xmax = xmax > this.#xmax ? xmax : this.#xmax;
    this.#ymin = ymin < this.#ymin ? ymin : this.#ymin;
    this.#ymax = ymax > this.#ymax ? ymax : this.#ymax;
  }

  #addSensor([x, y]: Coords, beacon: Coords): void {
    const distance = manhattanDistance([x, y], beacon);
    let col = this.#sensors.get(x);
    if (!col) {
      col = new Map();
      this.#sensors.set(x, col);
    }
    col.set(y, distance);
    this.#updateLimits(x, y, distance);
  }

  #addBeacon([x, y]: Coords): void {
    let col = this.#beacons.get(x);
    if (!col) {
      col = new Set();
      this.#beacons.set(x, col);
    }
    col.add(y);
  }

  #hasSensor(x: bigint, y: bigint): boolean {
    const col = this.#sensors.get(x);
    if (!col) {
      return false;
    }
    return col.has(y);
  }

  #hasBeacon(x: bigint, y: bigint): boolean {
    const col = this.#beacons.get(x);
    if (!col) {
      return false;
    }
    return col.has(y);
  }

  *#eachSensor(): IterableIterator<[Coords, bigint]> {
    for (const [x, col] of this.#sensors) {
      for (const [y, distance] of col) {
        yield [[x, y], distance];
      }
    }
  }

  #visible(x: bigint, y: bigint): boolean {
    for (const [sensor, distance] of this.#eachSensor()) {
      if (manhattanDistance(sensor, [x, y]) <= distance) {
        return true;
      }
    }
    return false;
  }

  *render(ymin = this.#ymin, ymax = this.#ymax): IterableIterator<string> {
    for (let y = ymin; y <= ymax; y++) {
      let line = "";
      for (let x = this.#xmin; x <= this.#xmax; x++) {
        if (this.#hasSensor(x, y)) {
          line += "S";
        } else if (this.#hasBeacon(x, y)) {
          line += "B";
        } else if (this.#visible(x, y)) {
          line += "#";
        } else {
          line += ".";
        }
      }
      yield line;
    }
  }

  countVisible(y: bigint): number {
    const nearbySensors: { coords: Coords; distance: bigint }[] = [];
    for (const [xSensor, row] of this.#sensors.entries()) {
      for (const [ySensor, distance] of row) {
        if (ySensor + distance >= y && ySensor - distance <= y) {
          nearbySensors.push({ coords: [xSensor, ySensor], distance });
        }
      }
    }
    let count = 0;
    for (let x = this.#xmin; x <= this.#xmax; x++) {
      if (this.#hasBeacon(x, y)) {
        continue;
      }
      for (const { coords, distance } of nearbySensors) {
        if (manhattanDistance(coords, [x, y]) <= distance) {
          count++;
          break;
        }
      }
    }
    return count;
  }
}
