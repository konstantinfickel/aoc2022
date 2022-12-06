import run from "aocrunner";
import { lines } from "../utils/index.js";

import { range, toNumber, uniq } from "lodash-es";

const parseInput = (x) => x.split('');

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const N = 4;

  let res = -1;

  range(0, input.length - N).forEach(i => {
    const x = input.slice(i, i+N);
    if (x.length === uniq(x).length && res === -1) {
        res = i;
    }
  });

  return res +N;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const N = 14;

  let res = -1;

  range(0, input.length - N).forEach(i => {
    const x = input.slice(i, i+N);
    if (x.length === uniq(x).length && res === -1) {
        res = i;
    }
  });

  return res +N;
};

run({
  part1: {
    tests: [
      {
        input: `bvwbjplbgvbhsrlpgdmjqwftvncz`,
        expected: 5,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `mjqjpqmgbljsphdztnvjfqwrcgsmlb`,
        expected: 19,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});