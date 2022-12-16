import run from "aocrunner";
import { lines } from "../utils/index.js";

import {
  difference,
  isNull,
  max,
  min,
  negate,
  range,
  reduce,
  toNumber,
  union,
} from "lodash-es";

const parseInput = lines((l) => {
  const r =
    /^Sensor at x=(-?[\d]+), y=(-?[\d]+): closest beacon is at x=(-?[\d]+), y=(-?[\d]+)$/;
  const m = r.exec(l) as RegExpExecArray;
  return [
    [toNumber(m[1]), toNumber(m[2])],
    [toNumber(m[3]), toNumber(m[4])],
  ];
});

const manDist = ([ax, ay], [bx, by]): number => {
  return Math.abs(ax - bx) + Math.abs(ay - by);
};

const occupiesInRow = (
  s: [number, number],
  b: [number, number],
  rowOfInterest: number,
): [number, number] | null => {
  const d = manDist(s, b);
  const c = d - Math.abs(rowOfInterest - s[1]);
  if (c >= 0) {
    return [s[0] - c, s[0] + c];
  }
  return null;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const rowOfInterest = 2000000;
  const i = input
    .map(([s, b]) =>
      occupiesInRow(
        s as [number, number],
        b as [number, number],
        rowOfInterest,
      ),
    )
    .filter(negate(isNull))
    .map(([s, e]) => range(s, e + 1));

  const biroi = input
    .filter(([s, b]) => b[1] === rowOfInterest)
    .map(([s, b]) => b[0]);
  const i2 = difference(union(...i), biroi).sort((a, b) => a - b);

  return i2.length;
};

const intersectOrTouch = ([a1, a2], [b1, b2]): boolean =>
  Math.min(a2, b2) - Math.max(a1, b1) >= 0;

const intersect = ([a1, a2], [b1, b2]): boolean =>
  Math.min(a2, b2) - Math.max(a1, b1) > 0;

const unionAll = (input: [number, number][]): [number, number][] => {
  return reduce(
    input,
    (all, cur) => {
      const intersected = [...all.filter((x) => intersectOrTouch(x, cur)), cur];
      const notIntersected = all.filter((x) => !intersectOrTouch(x, cur));

      const imin = min(intersected.map(([x, y]) => x)) as number;
      const imax = max(intersected.map(([x, y]) => y)) as number;

      return [...notIntersected, [imin, imax]];
    },
    [] as [number, number][],
  );
};

const getRowOfInterest = (
  input: [[number, number], [number, number]][],
  areaBorder: number,
) => {
  for (let i = 0; i <= areaBorder; i++) {
    const row = unionAll(
      input
        .map(([s, b]) =>
          occupiesInRow(s as [number, number], b as [number, number], i),
        )
        .filter(negate(isNull)) as [number, number][],
    );
    
    if(row.filter(x => intersect([0, areaBorder], x)).length > 1) {
      return i;
    }
  }
  throw "nonono";
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const areaBorder = 4000000;

  const rowOfInterest = getRowOfInterest(input, areaBorder);
  const occupied = input
    .map(([s, b]) =>
      occupiesInRow(
        s as [number, number],
        b as [number, number],
        rowOfInterest,
      ),
    )
    .filter(negate(isNull))
    .map(([s, e]) => range(s, e + 1));

  console.log(union(...occupied));
  const column = difference(range(0, areaBorder + 1), union(...occupied))[0];

  return rowOfInterest + column * 4000000;
};

run({
  part1: {
    tests: [
//       {
//         input: `Sensor at x=2, y=18: closest beacon is at x=-2, y=15
// Sensor at x=9, y=16: closest beacon is at x=10, y=16
// Sensor at x=13, y=2: closest beacon is at x=15, y=3
// Sensor at x=12, y=14: closest beacon is at x=10, y=16
// Sensor at x=10, y=20: closest beacon is at x=10, y=16
// Sensor at x=14, y=17: closest beacon is at x=10, y=16
// Sensor at x=8, y=7: closest beacon is at x=2, y=10
// Sensor at x=2, y=0: closest beacon is at x=2, y=10
// Sensor at x=0, y=11: closest beacon is at x=2, y=10
// Sensor at x=20, y=14: closest beacon is at x=25, y=17
// Sensor at x=17, y=20: closest beacon is at x=21, y=22
// Sensor at x=16, y=7: closest beacon is at x=15, y=3
// Sensor at x=14, y=3: closest beacon is at x=15, y=3
// Sensor at x=20, y=1: closest beacon is at x=15, y=3`,
//         expected: 26,
//       },
    ],
    solution: part1,
  },
  part2: {
    tests: [
//       {
//         input: `Sensor at x=2, y=18: closest beacon is at x=-2, y=15
// Sensor at x=9, y=16: closest beacon is at x=10, y=16
// Sensor at x=13, y=2: closest beacon is at x=15, y=3
// Sensor at x=12, y=14: closest beacon is at x=10, y=16
// Sensor at x=10, y=20: closest beacon is at x=10, y=16
// Sensor at x=14, y=17: closest beacon is at x=10, y=16
// Sensor at x=8, y=7: closest beacon is at x=2, y=10
// Sensor at x=2, y=0: closest beacon is at x=2, y=10
// Sensor at x=0, y=11: closest beacon is at x=2, y=10
// Sensor at x=20, y=14: closest beacon is at x=25, y=17
// Sensor at x=17, y=20: closest beacon is at x=21, y=22
// Sensor at x=16, y=7: closest beacon is at x=15, y=3
// Sensor at x=14, y=3: closest beacon is at x=15, y=3
// Sensor at x=20, y=1: closest beacon is at x=15, y=3`,
//         expected: 56000011,
//       },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
