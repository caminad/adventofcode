type ParsedEntry = [label: string, valve: {
  readonly flowRate: number;
  readonly tunnelsTo: readonly string[];
}];

export function* parse(input: string): IterableIterator<ParsedEntry> {
  for (
    const m of input.matchAll(
      /Valve ([A-Z]{2}) has flow rate=(\d+); tunnels? leads? to valves? ([A-Z]{2}(?:, [A-Z]{2})*)/g,
    )
  ) {
    yield [m[1], { flowRate: Number(m[2]), tunnelsTo: m[3].split(", ") }];
  }
}

export class ValveNode {
  static from(entries: Iterable<ParsedEntry>, firstLabel = "AA"): ValveNode {
    const nodes = new Map<string, ValveNode>();
    for (const [label, valve] of entries) {
      const node = new ValveNode(valve.flowRate);
      for (const to of valve.tunnelsTo) {
        nodes.get(to)?.connect(node);
      }
      nodes.set(label, node);
    }
    return nodes.get(firstLabel)!;
  }

  #edges = new Set<ValveNode>();
  #rate: number;

  constructor(rate: number) {
    this.#rate = rate;
  }

  *edges(): IterableIterator<ValveNode> {
    yield* this.#edges;
  }

  get rate(): number {
    return this.#rate;
  }

  connect(node: ValveNode): void {
    this.#edges.add(node);
    node.#edges.add(this);
  }
}
