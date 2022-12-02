import run from "aocrunner";
import { lines, tuple } from "../utils/index.js";

import { fromPairs, identity, sum, toNumber } from "lodash-es";

const parseInput = lines(tuple(identity, identity));

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const out = (input.map(([them, me]) => {
    let outScore = 0;
    if (me === 'X') {
        outScore += 1;
        if (them === 'A') {
          outScore += 3;
        } else if (them === 'C') {
          outScore += 6;
        }
    } else if (me === 'Y') {
        outScore += 2;
        if (them === 'B') {
          outScore += 3;
        } else if (them === 'A') {
          outScore += 6;
        }

    } else if (me === 'Z') {
        outScore += 3;
        if (them === 'C') {
          outScore += 3;
        } else if (them === 'B') {
          outScore += 6;
        }
    }
    return outScore;
  }));

  return sum(out);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const out = input.map(([them, me]) => {
    let outScore = 0;
    if (me === 'X') { // lose
        outScore += 1;
        if (them === 'A') { // rock
          outScore += 2;
        } else if (them === 'C') {
          outScore += 1;
        }
    } else if (me === 'Y') { // draw
        outScore += 4;
        if (them === 'B') {
          outScore += 1;
        } else if (them === 'C') {
          outScore += 2;
        }

    } else if (me === 'Z') { // win
        outScore += 7;
        if (them === 'A') {
          outScore += 1;
        } else if (them === 'B') {
          outScore += 2;
        }
    }
    // uff :(
    return outScore;
  });
  return sum(out);
};

run({
  part1: {
    tests: [
      {
        input: `A Y
B X
C Z`,
        expected: 15,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `A Y
B X
C Z`,
        expected: 12,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});