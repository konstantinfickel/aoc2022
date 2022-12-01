import run from "aocrunner";
import { lines, sections } from "../utils/index.js";

import { map, max, reverse, sum, toNumber } from "lodash-es";

const parseInput = sections(lines(toNumber));

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);


  return max(map(input, sum));
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const sums = map(input, sum).sort();
  reverse(sums)
  return sum(sums.slice(0,3));
};

run({
  part1: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
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