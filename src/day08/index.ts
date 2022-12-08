import run from "aocrunner";
import { lines } from "../utils/index.js";

import { isUndefined, max, range, sum, toNumber } from "lodash-es";

const parseInput = lines((x) => x.split("").map(toNumber));

const isVisible = (map: number[][], x: number, y: number) => {
  const lx = range(0, x).find((xn) => map[xn][y] >= map[x][y]);
  const rx = range(x + 1, map.length).find((xn) => map[xn][y] >= map[x][y]);

  const ly = range(0, y).find((yn) => map[x][yn] >= map[x][y]);
  const ry = range(y + 1, map[x].length).find((yn) => map[x][yn] >= map[x][y]);

  return (
    isUndefined(lx) || isUndefined(ly) || isUndefined(rx) || isUndefined(ry)
  );
};

const countTrees = (map: number[][], x: number, y: number) => {
  let xposview = 0;
  for (let xn = x + 1; xn < map.length; xn++) {
    xposview++;
    if (map[xn][y] >= map[x][y]) {
      break;
    }
  }

  let xnegview = 0;
  for (let xn = x - 1; xn >= 0; xn--) {
    xnegview++
    if (map[xn][y] >= map[x][y]) {
      break;
    }
  }

  let yposview = 0;
  for (let yn = y + 1; yn < map[x].length; yn++) {
    yposview++;
    if (map[x][yn] >= map[x][y]) {
      break;
    }
  }

  let ynegview = 0;
  for (let yn = y - 1; yn >= 0; yn--) {
    ynegview++;
    if (map[x][yn] >= map[x][y]) {
      break;
    }
  }

  return xposview * xnegview * yposview * ynegview;
};

const part1 = (rawInput: string) => {
  const map = parseInput(rawInput);

  return sum(
    range(0, map.length)
      .map((y) =>
        range(0, map[y].length).map((x) => (isVisible(map, x, y) ? 1 : 0)),
      )
      .map(sum),
  );
};

const part2 = (rawInput: string) => {
  const map = parseInput(rawInput);

  return max(
    range(0, map.length)
      .map((y) => range(0, map[y].length).map((x) => countTrees(map, x, y)))
      .map(max),
  );
};

run({
  part1: {
    tests: [
      {
        input: `30373
25512
65332
33549
35390`,
        expected: 21,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
