import { assertEquals } from "testing/asserts.ts";
import { Board, Game, score } from "./mod.ts";

const exampleInput = `
7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

22 13 17 11  0
 8  2 23  4 24
21  9 14 16  7
 6 10  3 18  5
 1 12 20 15 19

 3 15  0  2 22
 9 18 13 17  5
19  8  7 25 23
20 11 10 24  4
14 21 16 12  6

14 21 17 24  4
10 16 15  9 19
18  8 23 26 20
22 11 13  6  5
 2  0 12  3  7
`;
const input = await Deno.readTextFile(new URL("./input.txt", import.meta.url));

const simpleBoard = new Board(
  // deno-fmt-ignore
  [
    1, 1, 1, 1, 1,
    1, 0, 0, 0, 0,
    1, 0, 0, 0, 0,
    1, 0, 0, 0, 0,
    1, 0, 0, 0, 0
  ],
);

const exampleGame = new Game(
  // deno-fmt-ignore
  [7, 4, 9, 5, 11, 17, 23, 2, 0, 14, 21, 24, 10, 16, 13, 6, 15, 25, 12, 22, 18, 20, 8, 19, 3, 26, 1],
  [
    new Board(
      // deno-fmt-ignore
      [
        22, 13, 17, 11,  0,
         8,  2, 23,  4, 24,
        21,  9, 14, 16,  7,
         6, 10,  3, 18,  5,
         1, 12, 20, 15, 19,
      ],
    ),
    new Board(
      // deno-fmt-ignore
      [
         3, 15,  0,  2, 22,
         9, 18, 13, 17,  5,
        19,  8,  7, 25, 23,
        20, 11, 10, 24,  4,
        14, 21, 16, 12,  6,
      ],
    ),
    new Board(
      // deno-fmt-ignore
      [
        14, 21, 17, 24,  4,
        10, 16, 15,  9, 19,
        18,  8, 23, 26, 20,
        22, 11, 13,  6,  5,
         2,  0, 12,  3,  7,
      ],
    ),
  ],
);

Deno.test("Board.prototype.checkValue", () => {
  assertEquals(simpleBoard.checkValue(0, 0, new Set([1])), true);
  assertEquals(simpleBoard.checkValue(4, 4, new Set([1])), false);
  assertEquals(simpleBoard.checkValue(0, 0, new Set([])), false);
});

Deno.test("Board.prototype.checkRow", () => {
  assertEquals(simpleBoard.checkRow(0, new Set([1])), true);
  assertEquals(simpleBoard.checkRow(4, new Set([1])), false);
  assertEquals(simpleBoard.checkRow(0, new Set([])), false);
});

Deno.test("Board.prototype.checkCol", () => {
  assertEquals(simpleBoard.checkCol(0, new Set([1])), true);
  assertEquals(simpleBoard.checkCol(4, new Set([1])), false);
  assertEquals(simpleBoard.checkCol(0, new Set([])), false);
});

Deno.test("Board.prototype.isWinner", () => {
  assertEquals(simpleBoard.isWinner(new Set([1])), true);
  assertEquals(simpleBoard.isWinner(new Set([])), false);
});

Deno.test("Game.parse", () => {
  assertEquals(Game.parse(exampleInput), exampleGame);
});

Deno.test("Game.prototype.play", () => {
  assertEquals(
    exampleGame.play(),
    [
      [
        [7, 4, 9, 5, 11, 17, 23, 2, 0, 14, 21, 24],
        new Board(
          // deno-fmt-ignore
          [
            14, 21, 17, 24,  4,
            10, 16, 15,  9, 19,
            18,  8, 23, 26, 20,
            22, 11, 13,  6,  5,
             2,  0, 12,  3,  7,
          ],
        ),
      ],
      [
        [7, 4, 9, 5, 11, 17, 23, 2, 0, 14, 21, 24, 10, 16],
        new Board(
          // deno-fmt-ignore
          [
            22, 13, 17, 11,  0,
             8,  2, 23,  4, 24,
            21,  9, 14, 16,  7,
             6, 10,  3, 18,  5,
             1, 12, 20, 15, 19,
          ],
        ),
      ],
      [
        [7, 4, 9, 5, 11, 17, 23, 2, 0, 14, 21, 24, 10, 16, 13],
        new Board(
          // deno-fmt-ignore
          [
             3, 15,  0,  2, 22,
             9, 18, 13, 17,  5,
            19,  8,  7, 25, 23,
            20, 11, 10, 24,  4,
            14, 21, 16, 12,  6,
          ],
        ),
      ],
    ],
  );
});

Deno.test("score", () => {
  assertEquals(
    score(
      [7, 4, 9, 5, 11, 17, 23, 2, 0, 14, 21, 24],
      new Board(
        // deno-fmt-ignore
        [
          14, 21, 17, 24,  4,
          10, 16, 15,  9, 19,
          18,  8, 23, 26, 20,
          22, 11, 13,  6,  5,
           2,  0, 12,  3,  7,
        ],
      ),
    ),
    4512,
  );
});

Deno.test("part 1", () => {
  const game = Game.parse(input);
  const [[marked, winner]] = game.play();
  assertEquals(score(marked, winner), 31424);
});

Deno.test("part 2", () => {
  const game = Game.parse(input);
  const [marked, winner] = game.play().at(-1)!;
  assertEquals(score(marked, winner), 23042);
});
