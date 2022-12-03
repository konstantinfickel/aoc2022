import run from "aocrunner";
import { lines } from "../utils/index.js";

import { flatMap, identity, intersection, range, sum, toNumber } from "lodash-es";

const parseInput = lines((x) => {
  const y = x.split('');
  const len = y.length;
  return [y.slice(0, len/2), y.slice(len/2)]
});

const evalueCharValue = (x: string) => {
  const y = x.charCodeAt(0);
  if ('a'.charCodeAt(0) <= y && y <= 'z'.charCodeAt(0)) {
    return y - 'a'.charCodeAt(0) + 1;
  }
  if ('A'.charCodeAt(0) <= y && y <= 'Z'.charCodeAt(0)) {
    return y - 'A'.charCodeAt(0) + 27;
  }
  return y;
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const z = sum(input.map(([l,r]) => {
    return sum(intersection(l, r).map(evalueCharValue));
  }));

  return z;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let result = 0
  range(0, input.length/3).forEach(x => {
    const a = intersection(flatMap(input[x*3]), flatMap(input[x*3+1]), flatMap(input[x*3+2]));
    result += evalueCharValue(a[0] as any);
  });

  return result;
};

run({
  part1: {
    tests: [
      {
         input: `vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw`,
         expected: 157,
       },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw`,
        expected: 70,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});