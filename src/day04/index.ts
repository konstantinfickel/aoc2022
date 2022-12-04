import run from "aocrunner";
import { lines, tuple } from "../utils/index.js";

import { map, max, min, sum, toNumber } from "lodash-es";

const parseInput = lines(tuple(tuple(toNumber, toNumber, '-'), tuple(toNumber, toNumber, '-'), ','));

const isInside = (left: [number, number], right: [number, number]) => {
  return left[0] <= right[0] && right[1] <= left[1];
}

const isInsideBi = (left: [number, number], right: [number, number]) => {
  return isInside(left,right) || isInside(right, left);
}

const overlaps = (left: [number, number], right: [number, number]) => {
  return Math.max(left[0], right[0])<= Math.min(left[1], right[1]);
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return sum(map(input, ([x,y]) => isInsideBi(x,y) ? 1 : 0))
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return sum(map(input, ([x,y]) => overlaps(x,y) ? 1 : 0))
};

run({
  part1: {
    tests: [
      {
        input: `2-4,6-8
        2-3,4-5
        5-7,7-9
        2-8,3-7
        6-6,4-6
        2-6,4-8
        `,
        expected: 2,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});