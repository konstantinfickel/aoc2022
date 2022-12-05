import run from "aocrunner";
import { lines, sectionsWithPremable } from "../utils/index.js";

import { after, cloneDeep, first, flatMap, flatten, flattenDepth, identity, isElement, isEmpty, range, split, times, toNumber } from "lodash-es";

const boxParser = (x: string) => {
  const l = x.split('\n');

  const amountOfLines = l[l.length - 1].trim().split(/\s+/).length;

  const crateStacks = times(amountOfLines, n => {
    const s = l.slice(0, -1).map(x => x[4*n+1]);
    return s.filter(x => !isEmpty(x.trim()));
  });

  return crateStacks;
};

const commandParser = (x) => {
  const groups = /move (\d+) from (\d+) to (\d+)/.exec(x);
  if (!groups) {
    return [];
  }
  const amount = toNumber(groups[1]);
  return {
    from: toNumber(groups[2]) -1,
    to: toNumber(groups[3]) -1,
    amount: amount,
  };
};

const move = (boxes: string[][], command: {from: number, to:number, amount: number}, revert: boolean) => {
  const newBoxes = cloneDeep(boxes);

  const {from, to, amount} = command;

  const element = newBoxes[from].slice(0, amount);

  if(revert) {
    element.reverse();
  }

  newBoxes[from] = newBoxes[from].slice(amount);
  newBoxes[to] = [...element, ...newBoxes[to]]

  return newBoxes;
};

const parseInput = sectionsWithPremable(boxParser, lines(commandParser));

const part1 = (rawInput: string) => {
  const [boxes, rawCommands] = parseInput(rawInput);
  const commands = flatten(flatten(rawCommands));

  const afterBoxes = commands.reduce((prev, command) => move(prev, command, true), boxes);
  
  return afterBoxes.map(x => first(x)).join('');
};

const part2 = (rawInput: string) => {
  const [boxes, rawCommands] = parseInput(rawInput);
  const commands = flatten(flatten(rawCommands));

  const afterBoxes = commands.reduce((prev, command) => move(prev, command, false), boxes);
  
  return afterBoxes.map(x => first(x)).join('');
};

run({
  part1: {
    tests: [
//       { input: `    [D]    
// [N] [C]    
// [Z] [M] [P]
//  1   2   3 

// move 1 from 2 to 1
// move 3 from 1 to 3
// move 2 from 2 to 1
// move 1 from 1 to 2`,
//         expected: 'CMZ',
//       },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});