import { assertEquals } from "testing/asserts.ts";
import { parse } from "./lib.ts";

const input = Deno.readTextFileSync(new URL("input.txt", import.meta.url));

Deno.test("parse", () => {
  assertEquals([...parse(`
    Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
    Valve BB has flow rate=13; tunnels lead to valves CC, AA
    Valve CC has flow rate=2; tunnels lead to valves DD, BB
    Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
    Valve EE has flow rate=3; tunnels lead to valves FF, DD
    Valve FF has flow rate=0; tunnels lead to valves EE, GG
    Valve GG has flow rate=0; tunnels lead to valves FF, HH
    Valve HH has flow rate=22; tunnel leads to valve GG
    Valve II has flow rate=0; tunnels lead to valves AA, JJ
    Valve JJ has flow rate=21; tunnel leads to valve II
  `)], [
    ["AA", { flowRate: 0, tunnelsTo: ["DD", "II", "BB"] }],
    ["BB", { flowRate: 13, tunnelsTo: ["CC", "AA"] }],
    ["CC", { flowRate: 2, tunnelsTo: ["DD", "BB"] }],
    ["DD", { flowRate: 20, tunnelsTo: ["CC", "AA", "EE"] }],
    ["EE", { flowRate: 3, tunnelsTo: ["FF", "DD"] }],
    ["FF", { flowRate: 0, tunnelsTo: ["EE", "GG"] }],
    ["GG", { flowRate: 0, tunnelsTo: ["FF", "HH"] }],
    ["HH", { flowRate: 22, tunnelsTo: ["GG"] }],
    ["II", { flowRate: 0, tunnelsTo: ["AA", "JJ"] }],
    ["JJ", { flowRate: 21, tunnelsTo: ["II"] }],
  ]);
});
