import run from "aocrunner";
import { lines } from "../utils/index.js";

import { toNumber } from "lodash-es";
import Decimal from "decimal.js";

const parseInput = lines(toNumber);

const groveCoordinate = (a: [number, number, Decimal][]): Decimal => {
  const nullp = a.findIndex(([_1, _2, v]) => v.isZero());
  return a[(1000 + nullp) % a.length][2]
    .add(a[(2000 + nullp) % a.length][2])
    .add(a[(3000 + nullp) % a.length][2]);
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const amendedInput: [number, number, Decimal][] = input.map((x, i) => [
    x,
    i,
    new Decimal(x),
  ]);

  let a: [number, number, Decimal][] = amendedInput;

    for (let i = 0; i < input.length; i++) {
      const p = a.findIndex(([x, j]) => j === i);
      const e = a[p];
      const v = e[0];
      let np = v + p;

      const al = a.length - 1;
      if (np > a.length) {
        np = (np % al);
      }
      if (np < 0) {
        np = (np % al) + al;
      }

      if (np < p) {
        a = [...a.slice(0, np), e, ...a.slice(np, p), ...a.slice(p + 1)];
      } else if (p < np) {
        np += 1;
        a = [...a.slice(0, p), ...a.slice(p + 1, np), e, ...a.slice(np)];
      }
    }

  return groveCoordinate(a).toString();
};

const part2 = (rawInput: string) => {
  const factor = 811589153;
  const input = parseInput(rawInput);
  const amendedInput: [number, number, Decimal][] = input.map((x, i) => {
    const p: Decimal = new Decimal(x).mul(factor);
    const rp = p.mod(new Decimal(input.length-1).mul(input.length));

    return [rp.toNumber(), i, p];
  });

  let a: [number, number, Decimal][] = amendedInput;

  for (let z = 0; z < 10; z++) {
    for (let i = 0; i < input.length; i++) {
      const p = a.findIndex(([x, j]) => j === i);
      const e = a[p];
      const v = e[0];
      let np = v + p;

      const al = a.length - 1;
      if (np > a.length) {
        np = (np % al);
      }
      if (np < 0) {
        np = (np % al) + al;
      }

      if (np < p) {
        a = [...a.slice(0, np), e, ...a.slice(np, p), ...a.slice(p + 1)];
      } else if (p < np) {
        np += 1;
        a = [...a.slice(0, p), ...a.slice(p + 1, np), e, ...a.slice(np)];
      }
    }
  }

  return groveCoordinate(a).toString();
};

const testInput = `1
2
-3
3
-2
0
4`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: '3',
      },
      {
        input: `0
        1
        0`,
        expected: '1',
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: '1623178306',//WTF
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
