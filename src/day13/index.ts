import run from "aocrunner";
import { lines, sections } from "../utils/index.js";

import {
  flatten,
  isArray,
  isEmpty,
  isNumber,
  isUndefined,
  map,
  sortBy,
  sum,
  toNumber,
} from "lodash-es";
import { deepEqual } from "assert";

const parseInput = sections(lines((x) => JSON.parse(x)));

const rightOrder = (left, right): 1 | 0 | -1 => {
  if (isEmpty(left) && isEmpty(right)) {
    return 0;
  }

  if (isEmpty(left) || isEmpty(right)) {
    return isEmpty(left) ? 1 : -1;
  }

  const [leftFront, ...leftRest] = left;
  const [rightFront, ...rightRest] = right;

  if (isNumber(leftFront) && isNumber(rightFront) && leftFront !== rightFront) {
    return leftFront < rightFront ? 1 : -1;
  }

  if (isArray(leftFront) || isArray(rightFront)) {
    const o = rightOrder(
      isArray(leftFront) ? leftFront : [leftFront],
      isArray(rightFront) ? rightFront : [rightFront],
    );
    if (o !== 0) {
      return o;
    }
  }

  if(isEmpty(leftRest) && isEmpty(rightRest)) {
    return 0;
  }

  return rightOrder(leftRest, rightRest);
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const s = sum(
    map(input, ([left, right], index) => {
      return rightOrder(left, right) === 1 ? index + 1 : 0;
    }),
  );

  return s;
};

const part2 = (rawInput: string) => {
  const input = [...flatten(parseInput(rawInput)), [[2]], [[6]]]
  const sorted = input.sort((l, r) => -rightOrder(l, r));

  const a = sorted.findIndex(x => JSON.stringify(x) === '[[2]]')+1
  const b = sorted.findIndex(x => JSON.stringify(x) === '[[6]]')+1

  return a*b;
};

run({
  part1: {
    tests: [
      {
        input: `[1,1,3,1,1]
[1,1,5,1,1]

[[1],[2,3,4]]
[[1],4]

[9]
[[8,7,6]]

[[4,4],4,4]
[[4,4],4,4,4]

[7,7,7,7]
[7,7,7]

[]
[3]

[[[]]]
[[]]

[1,[2,[3,[4,[5,6,7]]]],8,9]
[1,[2,[3,[4,[5,6,0]]]],8,9]`,
        expected: 13,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `[]
[[]]
[[[]]]
[1,1,3,1,1]
[1,1,5,1,1]
[[1],[2,3,4]]
[1,[2,[3,[4,[5,6,0]]]],8,9]
[1,[2,[3,[4,[5,6,7]]]],8,9]
[[1],4]
[3]
[[4,4],4,4]
[[4,4],4,4,4]
[7,7,7]
[7,7,7,7]
[[8,7,6]]
[9]
`,
        expected: 140,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
