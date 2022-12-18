type Coords = readonly [x: number, y: number, z: number];

export function* parse(input: string): IterableIterator<Coords> {
  for (const [, x, y, z] of input.matchAll(/(\d+),(\d+),(\d+)/g)) {
    yield [Number(x), Number(y), Number(z)];
  }
}

enum FaceMask {
  X = 1 << 0,
  Y = 1 << 1,
  Z = 1 << 2,
  None = X & Y & Z,
  All = X | Y | Z,
}

function countFaces(mask: FaceMask): number {
  let count = 0;
  if (mask & FaceMask.X) count += 1;
  if (mask & FaceMask.Y) count += 1;
  if (mask & FaceMask.Z) count += 1;
  return count;
}

type Map3<K, V> = Map<K, Map<K, Map<K, V>>>;

export class FaceMap {
  readonly #faces: Map3<number, FaceMask> = new Map();
  constructor(points: Iterable<Coords>) {
    for (const [x, y, z] of points) {
      this.#addUnitCube(x, y, z);
    }
  }

  surfaceArea(): number {
    let count = 0;
    for (const xMap of this.#faces.values()) {
      for (const yMap of xMap.values()) {
        for (const mask of yMap.values()) {
          count += countFaces(mask);
        }
      }
    }
    return count;
  }

  #addUnitCube(x: number, y: number, z: number): void {
    this.#toggleFaces(x, y, z, FaceMask.All);
    this.#toggleFaces(x + 1, y, z, FaceMask.X);
    this.#toggleFaces(x, y + 1, z, FaceMask.Y);
    this.#toggleFaces(x, y, z + 1, FaceMask.Z);
  }

  #toggleFaces(x: number, y: number, z: number, mask: FaceMask): void {
    let xMap = this.#faces.get(x);
    if (xMap === undefined) {
      xMap = new Map();
      this.#faces.set(x, xMap);
    }
    let yMap = xMap.get(y);
    if (yMap === undefined) {
      yMap = new Map();
      xMap.set(y, yMap);
    }
    const currentMask = yMap.get(z) ?? FaceMask.None;
    yMap.set(z, currentMask ^ mask);
  }
}
