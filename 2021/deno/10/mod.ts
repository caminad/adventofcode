class ParseError {
  constructor(readonly message: string) {}
}

export class ParseSyntaxError extends ParseError {
  constructor(readonly expected: string, readonly found: string) {
    super(`Expected "${expected}", but found "${found}" instead.`);
  }

  #score() {
    switch (this.found) {
      case ")":
        return 3;
      case "]":
        return 57;
      case "}":
        return 1197;
      case ">":
        return 25137;
      default:
        return 0;
    }
  }

  static score(parseErrors: Iterable<ParseError>): number {
    let score = 0;
    for (const parseError of parseErrors) {
      if (parseError instanceof ParseSyntaxError) {
        score += parseError.#score();
      }
    }
    return score;
  }
}

export class ParseIncompleteError extends ParseError {
  constructor(readonly suffix: string) {
    super(`Complete by adding "${suffix}"`);
  }

  #score() {
    let total = 0;
    for (const c of this.suffix) {
      total *= 5;
      total += ")]}>".indexOf(c) + 1;
    }
    return total;
  }

  static score(parseErrors: Iterable<ParseError>): number {
    const scores = [];
    for (const parseError of parseErrors) {
      if (parseError instanceof ParseIncompleteError) {
        scores.push(parseError.#score());
      }
    }
    return scores.sort((a, b) => a - b).at(scores.length / 2) ?? 0;
  }
}

const BRACKETS = {
  "(": ")",
  "[": "]",
  "{": "}",
  "<": ">",
};

function parseLine(line: string): ParseError {
  let suffix = "";
  for (const c of line) {
    switch (c) {
      case "(":
      case "[":
      case "{":
      case "<":
        suffix = BRACKETS[c] + suffix;
        break;
      case suffix.at(0):
        suffix = suffix.slice(1);
        break;
      default:
        return new ParseSyntaxError(suffix.slice(0, 1), c);
    }
  }
  return new ParseIncompleteError(suffix);
}

export function* parseInput(input: string): IterableIterator<ParseError> {
  for (const [line] of input.matchAll(/\S+/g)) {
    yield parseLine(line);
  }
}
