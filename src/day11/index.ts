import run from "aocrunner";

import {
  clone,
  cloneDeep,
  range,
  reduce,
  sortBy,
  times,
} from "lodash-es";

const testMonkeyInput = [
  {
    starting: [79, 98],
    operation: (x: number) => x * 19,
    next: (x: number) => (x % 23 === 0 ? 2 : 3),
  },
  {
    starting: [54, 65, 75, 74],
    operation: (x: number) => x + 6,
    next: (x: number) => (x % 19 === 0 ? 2 : 0),
  },
  {
    starting: [79, 60, 97],
    operation: (x: number) => x * x,
    next: (x: number) => (x % 13 === 0 ? 1 : 3),
  },
  {
    starting: [74],
    operation: (x: number) => x + 3,
    next: (x: number) => (x % 17 === 0 ? 0 : 1),
  },
];

const monkeyInput = [
  {
    starting: [65, 58, 93, 57, 66],
    operation: (x: number) => x * 7,
    next: (x: number) => (x % 19 === 0 ? 6 : 4),
  },
  {
    starting: [76, 97, 58, 72, 57, 92, 82],
    operation: (x: number) => x + 4,
    next: (x: number) => (x % 3 === 0 ? 7 : 5),
  },
  {
    starting: [90, 89, 96],
    operation: (x: number) => x * 5,
    next: (x: number) => (x % 13 === 0 ? 5 : 1),
  },
  {
    starting: [72, 63, 72, 99],
    operation: (x: number) => x * x,
    next: (x: number) => (x % 17 === 0 ? 0 : 4),
  },
  {
    starting: [65],
    operation: (x: number) => x + 1,
    next: (x: number) => (x % 2 === 0 ? 6 : 2),
  },
  {
    starting: [97, 71],
    operation: (x: number) => x + 8,
    next: (x: number) => (x % 11 === 0 ? 7 : 3),
  },
  {
    starting: [83, 68, 88, 55, 87, 67],
    operation: (x: number) => x + 2,
    next: (x: number) => (x % 5 === 0 ? 2 : 1),
  },
  {
    starting: [64, 81, 50, 96, 82, 53, 62, 92],
    operation: (x: number) => x + 5,
    next: (x: number) => (x % 7 === 0 ? 3 : 0),
  },
];

const part2 = (rawInput: string) => {
  const input = cloneDeep(monkeyInput);

  const { itemsSeen } = reduce(
    range(10000),
    ({ pos: oldPos, itemsSeen }, next) => {
      const pos = clone(oldPos);
      for (let i = 0; i < input.length; i++) {
        const q = pos[i];
        pos[i] = [];
        for (let item of q) {
          const newVal =
            input[i].operation(item) % (19 * 3 * 13 * 17 * 2 * 11 * 5 * 7);
          itemsSeen[i]++;
          pos[input[i].next(newVal)].push(newVal);
        }
      }
      return { pos, itemsSeen };
    },
    {
      pos: input.map(({ starting }) => starting),
      itemsSeen: times(input.length, () => 0),
    },
  );

  const iss = sortBy(itemsSeen);

  return iss[input.length - 2] * iss[input.length - 1];
};

const part1 = (rawInput: string) => {
  const input = cloneDeep(monkeyInput);

  const { itemsSeen } = reduce(
    range(20),
    ({ pos: oldPos, itemsSeen }, next) => {
      const pos = clone(oldPos);
      for (let i = 0; i < input.length; i++) {
        const q = pos[i];
        pos[i] = [];
        for (let item of q) {
          const newVal = Math.floor(input[i].operation(item) / 3);
          itemsSeen[i]++;
          pos[input[i].next(newVal)].push(newVal);
        }
      }
      return { pos, itemsSeen };
    },
    {
      pos: input.map(({ starting }) => starting),
      itemsSeen: times(input.length, () => 0),
    },
  );

  const iss = sortBy(itemsSeen);

  return iss[input.length - 2] * iss[input.length - 1];
};

run({
  part1: {
    tests: [],
    solution: part1,
  },
  part2: {
    tests: [],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
