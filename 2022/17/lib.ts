const SHAPES = [
  new Uint8Array([
    0b0001_1110,
  ]).reverse(),
  new Uint8Array([
    0b0000_1000,
    0b0001_1100,
    0b0000_1000,
  ]).reverse(),
  new Uint8Array([
    0b0000_0100,
    0b0000_0100,
    0b0001_1100,
  ]).reverse(),
  new Uint8Array([
    0b0001_0000,
    0b0001_0000,
    0b0001_0000,
    0b0001_0000,
  ]).reverse(),
  new Uint8Array([
    0b0001_1000,
    0b0001_1000,
  ]).reverse(),
] as const;

export class Model {
  readonly #shapeOffset = 3;
  readonly #shapes = Array.from(SHAPES);
  readonly #jets: ("<" | ">")[];
  #rows = new Uint8Array(0);
  #overlay = this.#nextOverlay();
  constructor(input: string) {
    this.#jets = Array.from(input.matchAll(/[<>]/g), (m) => m[0] as "<" | ">");
  }

  #nextOverlay(): Uint8Array {
    const shape = this.#shapes.shift();
    if (!shape) throw new Error("no shapes");
    this.#shapes.push(shape);

    const offset = this.#rows.length + this.#shapeOffset;
    const overlay = new Uint8Array(offset + shape.length);
    overlay.set(shape, offset);
    return overlay;
  }

  #rowAt(height: number): number {
    return this.#rows.at(height) ?? 0;
  }

  #overlayAt(height: number): number {
    return this.#overlay.at(height) ?? 0;
  }

  #moveLeft(): boolean {
    let canMove = true;
    const overlay = Uint8Array.from(this.#overlay, (mask, height) => {
      if (mask === 0) {
        return 0;
      }
      if (mask >> 6) {
        // touching edge
        canMove = false;
        return 0;
      }
      mask <<= 1;
      if (mask & this.#rowAt(height)) {
        // touching something
        canMove = false;
        return 0;
      }
      return mask;
    });
    if (canMove) {
      this.#overlay = overlay;
      return true;
    }
    return false;
  }

  #moveRight(): boolean {
    let canMove = true;
    const overlay = Uint8Array.from(this.#overlay, (mask, height) => {
      if (mask === 0) {
        return 0;
      }
      if (mask & 1) {
        // touching edge
        canMove = false;
        return 0;
      }
      mask >>= 1;
      if (mask & this.#rowAt(height)) {
        // touching something
        canMove = false;
        return 0;
      }
      return mask;
    });
    if (canMove) {
      this.#overlay = overlay;
      return true;
    }
    return false;
  }

  #moveDown(): boolean {
    if (this.#overlay.at(0) !== 0) {
      // touching bottom
      return false;
    }
    const overlay = this.#overlay.slice(1);
    const canMove = overlay.every((mask, height) => {
      return mask === 0 || (mask & this.#rowAt(height)) === 0;
    });
    if (canMove) {
      this.#overlay = overlay;
      return true;
    }
    return false;
  }

  step(): boolean {
    const jet = this.#jets.shift();
    if (!jet) throw new Error("no jets");
    this.#jets.push(jet);
    if (jet === "<") {
      this.#moveLeft();
    }
    if (jet === ">") {
      this.#moveRight();
    }
    if (!this.#moveDown()) {
      if (this.#overlay.length > this.#rows.length) {
        const rows = new Uint8Array(this.#overlay.length);
        rows.set(this.#rows);
        this.#rows = rows;
      }
      for (const [height, mask] of this.#overlay.entries()) {
        this.#rows[height] |= mask;
      }
      this.#overlay = this.#nextOverlay();
      return false;
    }
    return true;
  }

  heightAfter(rocks: number): number {
    while (rocks-- > 0) {
      while (this.step());
    }
    return this.#rows.length;
  }

  toString(): string {
    const length = Math.max(this.#rows.length, this.#overlay.length);
    return Array.from({ length }, (_, height) => {
      let line = "";
      for (let mask = 1 << 6; mask > 0; mask >>= 1) {
        if (this.#rowAt(height) & mask) {
          line += "#";
        } else if (this.#overlayAt(height) & mask) {
          line += "@";
        } else {
          line += ".";
        }
      }
      return line;
    }).reverse().join("\n");
  }
}
