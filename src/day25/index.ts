import run from "aocrunner";
import Decimal from "decimal.js";
import { fromPairs, isEqual, map, over, reduce, sum, toPairs } from "lodash-es";
import { lines } from "../utils/index.js";

const snafuDict = {
  '=': -2,
  '-': -1,
  '0': 0,
  '1': 1,
  '2': 2,
};

const snfauDictInv = fromPairs(map(toPairs(snafuDict), ([x, y]) => [y, x]));

const snafuToNumber = (snafu: string): Decimal => {
  let num = new Decimal(0);

  for (const p of snafu.split('')) {
    num = num.mul(5).add(snafuDict[p]);
  }

  return num;
}

const numberToSnafu = (num: Decimal): string => {
  const nums: number[] = [];
  let n = num;
  while (n.gt(0)) {
    nums.push(n.mod(5).toNumber());
    n = n.divToInt(5);
  }
  const nums2 = [];
  let overflow: number = 0;
  for (const d of nums) {
    const x: number = d + overflow;
    overflow = 0;
    if (x >= 3) {
      nums2.push(x - 5);
      overflow = 1;
    } else {
      nums2.push(x);
    }
  }
  if (overflow > 0) {
    nums2.push(overflow);
  }
  nums2.reverse()
  return nums2.map(x => snfauDictInv[x]).join('');
}

const parseInput = lines(snafuToNumber);

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const result = reduce(input, (x, p) => x.add(p), new Decimal(0));
  return numberToSnafu(result);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return;
};

const testInput = `1=-0-2
12111
2=0=
21
2=01
111
20012
112
1=-1=
1-12
12
1=
122`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: "2=-1=0",
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