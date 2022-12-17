import run from "aocrunner";
import { lines } from "../utils/index.js";

import { cloneDeep, isEmpty, isUndefined, map, max, range, times, toNumber } from "lodash-es";

const parseInput = (x: string) => x.split("");

const shapes = [
  [["#", "#", "#", "#"]],
  [
    [".", "#", "."],
    ["#", "#", "#"],
    [".", "#", "."],
  ],
  [
    ["#", "#", "#"],
    [".", ".", "#"],
    [".", ".", "#"],
  ],
  [["#"], ["#"], ["#"], ["#"]],
  [
    ["#", "#"],
    ["#", "#"],
  ],
];

const getHighestRock = (x: string[][]) => {
  const i = x.findIndex(x => !x.includes('#'));
  if(i === -1) {
    throw 'mapTooSmall!';
  }
  return i;
}

const place = (m: string[][], r: string[][], x: number, y: number): undefined | string[][] => {
  const mn = cloneDeep(m);
  for(let ry = 0; ry < r.length; ry++) {
    for(let rx = 0; rx < r[ry].length; rx++) {
      if(r[ry][rx] === '#') {
        if(mn[y+ry][x+rx] === '#') {
          return undefined;
        }
        mn[y+ry][x+rx] = '#';
      }
    }
  }
  return mn;
}

const mToStr = (x) => x.map(x => x.join('')).join('\n');

const solve = (target: number) => (rawInput: string) => {
  const jetPushs = parseInput(rawInput);
  let jetPos = 0;
  const width = 7
  let leftHeight = 0;

  const detectCycle = new Map();

  let map = times(100, () => times(width, () => "."));

  for (let i = 0; i < target; i++) {
    const shape = shapes[i%shapes.length];

    const cutOff = max(range(0, map.length-1).filter(y => isEmpty(range(0, width).filter(x => map[y][x] === '.' && map[y+1][x] === '.'))));
    if(cutOff) {
      leftHeight += cutOff;
      map = map.slice(cutOff);
    }

    let rockX = 2;
    let rockY = getHighestRock(map) + 3;
    let lastPlaced = map;

    while(map.length < rockY + shape.length) {
      map.push(times(width, () => "."));
    }

    while(true) {
      if(rockY < 0) break;
      let placed = place(map, shape, rockX, rockY);
      if(!placed) break;
      lastPlaced = placed;

      const jetPush = jetPushs[jetPos];
      jetPos = (jetPos + 1) % jetPushs.length;

      const attemptRockX = jetPush === '<' ? Math.max(rockX - 1, 0) : Math.min(rockX + 1, width - shape[0].length);
      const placedJet = place(map, shape, attemptRockX, rockY);
      if(!isUndefined(placedJet)) {
        rockX = attemptRockX;
        lastPlaced = placedJet;
      }

      rockY--;
    }
    map = lastPlaced;

    const mstr = `${mToStr(map)}|${i % shapes.length}|${jetPos}`;
    if(detectCycle.has(mstr)) {
      const {i: ci, h} = detectCycle.get(mstr);
      const cycleLength = i - ci;
      const skipCycles = Math.floor((target - i) / cycleLength);
      leftHeight += skipCycles * (getHighestRock(map) + leftHeight - h);
      i += skipCycles * cycleLength;
    }
    detectCycle.set(mstr, {i, h: getHighestRock(map) + leftHeight});
  }

  return getHighestRock(map) + leftHeight;
};

const part1 = solve(2022);
const part2 = solve(1000000000000);


run({
  part1: {
    tests: [
      {
        input: `>>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>`,
        expected: 3068,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `>>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>`,
        expected: 1514285714288,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
