import run from "aocrunner";
import { array, lines, sectionsWithPremable } from "../utils/index.js";

import { assign, cloneDeep, findIndex, max, times, toNumber } from "lodash-es";

const parseInput = sectionsWithPremable(lines(array(String, "")), String);

const Direction = {
  RIGHT: 0,
  DOWN: 1,
  LEFT: 2,
  UP: 3,
  END: -1,
} as const;
type Direction = typeof Direction[keyof typeof Direction];

const connTest: Array<
  [[number, number, Direction], [number, number, Direction]]
> = [
  [
    [1, 0, Direction.LEFT],
    [2, 3, Direction.DOWN],
  ],
  [
    [1, 0, Direction.DOWN],
    [2, 2, Direction.DOWN],
  ],
  [
    [1, 1, Direction.DOWN],
    [2, 2, Direction.LEFT],
  ],
  [
    [2, 3, Direction.RIGHT],
    [0, 2, Direction.RIGHT],
  ],
  [
    [2, 3, Direction.UP],
    [1, 2, Direction.RIGHT],
  ],
  [
    [1, 0, Direction.UP],
    [0, 2, Direction.UP],
  ],
  [
    [1, 1, Direction.UP],
    [0, 2, Direction.LEFT],
  ],
];

const connReal: Array<
  [[number, number, Direction], [number, number, Direction]]
> = [
  [
    [0, 1, Direction.UP],
    [3, 0, Direction.LEFT],
  ],
  [
    [0, 2, Direction.UP],
    [3, 0, Direction.DOWN],
  ],
  [
    [0, 2, Direction.RIGHT],
    [2, 1, Direction.RIGHT],
  ],
  [
    [0, 2, Direction.DOWN],
    [1, 1, Direction.RIGHT],
  ],
  [
    [2, 1, Direction.DOWN],
    [3, 0, Direction.RIGHT],
  ],
  [
    [0, 1, Direction.LEFT],
    [2, 0, Direction.LEFT],
  ],
  [
    [2, 0, Direction.UP],
    [1, 1, Direction.LEFT],
  ],
];

const conn1 = connReal;

const conn = [
  ...conn1,
  ...conn1.map(
    ([x, y]) =>
      [y, x] as [[number, number, Direction], [number, number, Direction]],
  ),
] as [[number, number, Direction], [number, number, Direction]][];

const parseDirections = (v: string): [number, Direction][] => {
  const result: [number, Direction][] = [];

  let amount: number = 0;

  for (const x of v.split("")) {
    if (/^R|L|U|D$/.test(x)) {
      let direction;
      switch (x) {
        case "R":
          direction = Direction.RIGHT;
          break;
        case "D":
          direction = Direction.DOWN;
          break;
        case "L":
          direction = Direction.LEFT;
          break;
        case "U":
          direction = Direction.UP;
          break;
        default:
          throw "dir";
      }
      result.push([amount, direction]);
      amount = 0;
    } else {
      amount = 10 * amount + toNumber(x);
    }
  }
  result.push([amount, Direction.END]);

  return result;
};

const getCubeDimensions = (
  map: string[][],
): { w: number; h: number; d: number } => {
  const wr = map[0].length;
  const hr = map.length;
  const d = gcd(wr, hr);

  const w = wr / d;
  const h = hr / d;

  return { w, h, d };
};

const print = (map: string[][], x: number, y: number, direction: Direction) => {
  const map2 = cloneDeep(map);
  let dc = "+";
  if (direction === Direction.UP) {
    dc = "^";
  } else if (direction === Direction.LEFT) {
    dc = "<";
  } else if (direction === Direction.RIGHT) {
    dc = ">";
  } else if (direction === Direction.DOWN) {
    dc = "v";
  }
  map2[y][x] = dc;
  return map2.map((x: string[]) => x.join("")).join("\n");
};

const move = (
  map: string[][],
  oldX: number,
  oldY: number,
  amount: number,
  direction: Direction,
): { x: number; y: number; direction: Direction } => {
  let x = oldX;
  let y = oldY;

  let lastXInMap = x;
  let lastYInMap = y;
  let lastDirectionInMap = direction;
  // console.log(print(map, x, y, direction));
  // console.log();

  let stepsLeft = amount;

  while (stepsLeft > 0) {
    let stepX = 0;
    let stepY = 0;

    switch (direction) {
      case Direction.DOWN:
        stepY = 1;
        break;
      case Direction.UP:
        stepY = -1;
        break;
      case Direction.RIGHT:
        stepX = 1;
        break;
      case Direction.LEFT:
        stepX = -1;
        break;
    }
    x += stepX;
    y += stepY;

    if (
      x >= map[0].length ||
      x < 0 ||
      y >= map.length ||
      y < 0 ||
      map[y][x] === " "
    ) {
      const { d } = getCubeDimensions(map);

      const oldCubeX = Math.floor(lastXInMap / d);
      const oldCubeY = Math.floor(lastYInMap / d);
      const oldCubeDirection = direction;

      let distanceFromLeft = 0;
      if (oldCubeDirection === Direction.UP) {
        distanceFromLeft = x - oldCubeX * d;
      } else if (oldCubeDirection === Direction.LEFT) {
        distanceFromLeft = d - 1 - (y - oldCubeY * d);
      } else if (oldCubeDirection === Direction.RIGHT) {
        distanceFromLeft = y - oldCubeY * d;
      } else if (oldCubeDirection === Direction.DOWN) {
        distanceFromLeft = d - 1 - (x - oldCubeX * d);
      }

      // console.log(oldCubeY, oldCubeX, oldCubeDirection);
      const newCubePair = conn.find(
        ([f]) =>
          f[0] === oldCubeY && f[1] === oldCubeX && f[2] === oldCubeDirection,
      ) as [[number, number, Direction], [number, number, Direction]];
      const newCubePart= newCubePair[1];

      const newCubeX = newCubePart[1];
      const newCubeY = newCubePart[0];
      const newCubeDirection = newCubePart[2];
      if (newCubeDirection === Direction.UP) {
        x = newCubeX * d + (d - 1) - distanceFromLeft;
        y = newCubeY * d;
      } else if (newCubeDirection === Direction.LEFT) {
        x = newCubeX * d;
        y = distanceFromLeft + newCubeY * d;
      } else if (newCubeDirection === Direction.RIGHT) {
        x = (newCubeX + 1) * d - 1;
        y = newCubeY * d + (d - 1) - distanceFromLeft;
      } else if (newCubeDirection === Direction.DOWN) {
        x = distanceFromLeft + newCubeX * d;
        y = (newCubeY + 1) * d - 1;
      }

      direction = ((newCubeDirection + 2) % 4) as Direction;
    }

    if (map[y][x] === ".") {
      stepsLeft -= 1;
      // console.log(print(map, x, y, direction));
      // console.log();
      lastXInMap = x;
      lastYInMap = y;
      lastDirectionInMap = direction;
    } else if (map[y][x] === "#") {
      return { x: lastXInMap, y: lastYInMap, direction: lastDirectionInMap };
    }
  }

  return { x: lastXInMap, y: lastYInMap, direction: lastDirectionInMap };
};

const solve = (
  { map, i }: { map: string[][]; i: [number, Direction][] },
  inX: number,
  inY: number,
  inDirection: Direction,
) => {
  let x = inX;
  let y = inY;
  let direction: Direction = inDirection;

  for (const [ma, md] of i) {
    const { x: nx, y: ny, direction: nd } = move(map, x, y, ma, direction);
    x = nx;
    y = ny;
    direction = nd;

    if (md === Direction.LEFT) {
      direction = ((direction + 3) % 4) as Direction;
    } else if (md === Direction.RIGHT) {
      direction = ((direction + 1) % 4) as Direction;
    }
  }

  return { column: x, row: y, direction };
};

const part1 = (rawInput: string) => {
  return;
  const input = parseInput(rawInput);
  const map = input[0];
  const w = max(map.map((x) => x.length)) as number;
  const map2 = map.map((x) =>
    assign(
      times(w, () => " "),
      x,
    ),
  );

  const input2 = {
    map: map2,
    i: parseDirections(input[1][0]),
  };

  const { column, row, direction } = solve(input2, 0, 0, Direction.RIGHT);

  return 1000 * (row + 1) + 4 * (column + 1) + direction;
};
function gcd(x: number, y: number) {
  while (y) {
    var t = y;
    y = x % y;
    x = t;
  }
  return x;
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const map = input[0];
  const w = max(map.map((x) => x.length)) as number;
  const map2 = map.map((x) =>
    assign(
      times(w, () => " "),
      x,
    ),
  );

  const input2 = {
    map: map2,
    i: parseDirections(input[1][0]),
  };

  // console.log(map[0], map[0].findIndex((x) => x !== " "))
  const { column, row, direction } = solve(
    input2,
    map[0].findIndex((x) => x !== " "),
    0,
    Direction.RIGHT,
  );

  return 1000 * (row + 1) + 4 * (column + 1) + direction;
};

const testInput = `        ...#
        .#..
        #...
        ...  
...#.......#
........#...
..#....#....
..........#.
        ...#....
        .....#..
        .#......
        ......#.

10R5L5R10L4R5L5`;

run({
  part1: {
    tests: [
      // {
      //   input: testInput,
      //   expected: 6032,
      // },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // {
      //   input: testInput,
      //   expected: 5031,
      // },
    ],
    solution: part2,
  },
  trimTestInputs: false,
  onlyTests: false,
});
