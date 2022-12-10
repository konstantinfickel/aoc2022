import run from "aocrunner";
import { lines, tuple } from "../utils/index.js";

import { chunk, reduce, times, toNumber } from "lodash-es";

const parseInput = lines(tuple(String, toNumber));

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const ai = input.flatMap(x => x[0] === 'addx' ? [['noop', 0], x] : [x])

  const res = reduce(ai, ({x, cycle, s}, [op, value]) => {
    const newCycle = cycle+1;
    const newS = ((newCycle - 20) % 40 === 0) ? s + x * newCycle : s;
    const newX = (op === 'addx') ? x + value as number : x;
    return {x: newX, cycle: newCycle, s: newS};
  }, {x: 1, cycle: 0, s: 0})

  return res.s;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const ai = input.flatMap(x => x[0] === 'addx' ? [['noop', 0], x] : [x])

  const res = reduce(ai, ({x, cycle, s}, [op, value]) => {
    const newCycle = cycle+1;

    const newS = [...s];
    newS[(newCycle+239)%240] = (Math.abs(newCycle % 40 - (x + 1) % 40) <= 1) ? '#' : ' ';

    const newX = (op === 'addx') ? x + value as number : x;
    return {x: newX, cycle: newCycle, s: newS};
  }, {x: 1, cycle: 0, s: times(240, () => ' ')})
  
  console.log(chunk(res.s, 40).map(x => x.join('')).join('\n'));

  return 'ECZUZALR';
};


run({
  part1: {
    tests: [
      {
        input: `addx 15
addx -11
addx 6
addx -3
addx 5
addx -1
addx -8
addx 13
addx 4
noop
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx -35
addx 1
addx 24
addx -19
addx 1
addx 16
addx -11
noop
noop
addx 21
addx -15
noop
noop
addx -3
addx 9
addx 1
addx -3
addx 8
addx 1
addx 5
noop
noop
noop
noop
noop
addx -36
noop
addx 1
addx 7
noop
noop
noop
addx 2
addx 6
noop
noop
noop
noop
noop
addx 1
noop
noop
addx 7
addx 1
noop
addx -13
addx 13
addx 7
noop
addx 1
addx -33
noop
noop
noop
addx 2
noop
noop
noop
addx 8
noop
addx -1
addx 2
addx 1
noop
addx 17
addx -9
addx 1
addx 1
addx -3
addx 11
noop
noop
addx 1
noop
addx 1
noop
noop
addx -13
addx -19
addx 1
addx 3
addx 26
addx -30
addx 12
addx -1
addx 3
addx 1
noop
noop
noop
addx -9
addx 18
addx 1
addx 2
noop
noop
addx 9
noop
noop
noop
addx -1
addx 2
addx -37
addx 1
addx 3
noop
addx 15
addx -21
addx 22
addx -6
addx 1
noop
addx 2
addx 1
noop
addx -10
noop
noop
addx 20
addx 1
addx 2
addx 2
addx -6
addx -11
noop
noop
noop`,

        expected: 13140,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `addx 15
addx -11
addx 6
addx -3
addx 5
addx -1
addx -8
addx 13
addx 4
noop
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx -35
addx 1
addx 24
addx -19
addx 1
addx 16
addx -11
noop
noop
addx 21
addx -15
noop
noop
addx -3
addx 9
addx 1
addx -3
addx 8
addx 1
addx 5
noop
noop
noop
noop
noop
addx -36
noop
addx 1
addx 7
noop
noop
noop
addx 2
addx 6
noop
noop
noop
noop
noop
addx 1
noop
noop
addx 7
addx 1
noop
addx -13
addx 13
addx 7
noop
addx 1
addx -33
noop
noop
noop
addx 2
noop
noop
noop
addx 8
noop
addx -1
addx 2
addx 1
noop
addx 17
addx -9
addx 1
addx 1
addx -3
addx 11
noop
noop
addx 1
noop
addx 1
noop
noop
addx -13
addx -19
addx 1
addx 3
addx 26
addx -30
addx 12
addx -1
addx 3
addx 1
noop
noop
noop
addx -9
addx 18
addx 1
addx 2
noop
noop
addx 9
noop
noop
noop
addx -1
addx 2
addx -37
addx 1
addx 3
noop
addx 15
addx -21
addx 22
addx -6
addx 1
noop
addx 2
addx 1
noop
addx -10
noop
noop
addx 20
addx 1
addx 2
addx 2
addx -6
addx -11
noop
noop
noop`,

        expected: 13140,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});