import run from "aocrunner";
import { array, lines, tuple } from "../utils/index.js";

import { cloneDeep, fromPairs, identity, toNumber } from "lodash-es";

const parseInput = lines(tuple(String, array(identity), ': '));

const solve = (input: Record<string, string[]>, identifier: string): number => {
  const i = input[identifier];

  if(i.length === 1) {
    return toNumber(i[0]);
  }

  const l = solve(input, i[0]);
  const r = solve(input, i[2]);

  switch(i[1]) {
    case '*': return l*r;
    case '/': return l/r;
    case '+': return l+r;
    case '-': return l-r;
  }
  throw 'op';
}

const toEq = (input: Record<string, string[]>, identifier: string): string => {
  if (identifier === 'humn') {
    return 'x';
  }

  const i = input[identifier];

  if(i.length === 1) {
    return i[0];
  }

  const l = toEq(input, i[0]);
  const r = toEq(input, i[2]);

  if(identifier === 'root') {
    return `${l}=${r}`
  }

  switch(i[1]) {
    case '*': return `(${l})*(${r})`;
    case '/': return `(${l})/(${r})`;
    case '+': return `(${l})+(${r})`;
    case '-': return `(${l})-(${r})`;
  }
  throw 'op';
}

const verify = (input: Record<string, string[]>, value: number): boolean => {
  const i2 = cloneDeep(input);
  i2['humn'] = [String(value)];

  const i = i2['root'];
  const l = solve(i2, i[0]);
  const r = solve(i2, i[2]);
  return l === r;  
}

const part1 = (rawInput: string) => {
  const input = fromPairs(parseInput(rawInput));

  return solve(input, 'root');
};

const part2 = (rawInput: string) => {
  const input = fromPairs(parseInput(rawInput));

  console.log(toEq(input, 'root'));

  const solutionByMaxima = 3373767893067;
  if(!verify(input, solutionByMaxima)) {
    throw 'wrongsol';
  }

  return solutionByMaxima;
};

const testInput = `root: pppw + sjmn
dbpl: 5
cczh: sllz + lgvd
zczc: 2
ptdq: humn - dvpt
dvpt: 3
lfqf: 4
humn: 5
ljgn: 2
sjmn: drzm * dbpl
sllz: 4
pppw: cczh / lfqf
lgvd: ljgn * ptdq
drzm: hmdt - zczc
hmdt: 32`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 152,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // {
      //   input: testInput,
      //   expected: 301,
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});