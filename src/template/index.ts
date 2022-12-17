import run from "aocrunner";
import { lines } from "../utils/index.js";

import { toNumber } from "lodash-es";

const parseInput = lines(toNumber);

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  // console.log(input);

  return;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return;
};

const testInput = ``;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: "",
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // {
      //   input: testInput,
      //   expected: "",
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});