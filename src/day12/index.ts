import run from "aocrunner";
import { lines } from "../utils/index.js";

import { cloneDeep, isElement, isEmpty, min, reduce, toNumber } from "lodash-es";

const playerPos = Symbol();
const endPos = Symbol();

const parseChar = (x: string): number | typeof playerPos | typeof endPos => {
  const cc = x.charCodeAt(0) - 'a'.charCodeAt(0);

  if(0 <= cc && cc < 26) {
    return cc;
  }

  if (x === 'S') {
    return playerPos;
  }

  return endPos;
}

const h = (x): number => {
  if (x === playerPos) {
    return 0;
  } else if (x === endPos) {
    return 25;
  }
  return x;
}

const parseInput = lines((x) => x.split('').map(parseChar));


const bfs = (map, startX, startY) => {
  let queue = [{x: startX, y: startY, dist: 0}]
  const visited = new Set();

  while (!isEmpty(queue)) {
    const {x: oldX, y: oldY, dist: oldDist} = queue[0];
    queue = queue.slice(1);

    if (visited.has(`${oldX}|${oldY}`)) {
      continue;
    }
    visited.add(`${oldX}|${oldY}`);
    const dist = oldDist+1;
    if(map[oldY][oldX] === endPos) {
      return oldDist;
    }
    if(oldX>0 && (h(map[oldY][oldX]) - h(map[oldY][oldX-1])) >= -1) {
      queue.push({x: oldX-1, y:oldY, dist});
    }
    if(oldY>0 && (h(map[oldY][oldX]) - h(map[oldY-1][oldX])) >= -1) {
      queue.push({x:oldX, y: oldY-1, dist});
    }
    if(oldX+1<map[0].length && (h(map[oldY][oldX]) - h(map[oldY][oldX+1])) >= -1) {
      queue.push({x: oldX+1, y:oldY, dist});
    }
    if(oldY+1<map.length && (h(map[oldY][oldX]) - h(map[oldY+1][oldX])) >= -1) {
      queue.push({x: oldX, y: oldY+1, dist});
    }

  }

  return Number.POSITIVE_INFINITY;
};

const part1 = (rawInput: string) => {
  const map = parseInput(rawInput);

  let res = [];

  for(let y = 0; y< map.length; y++) {
    for(let x = 0; x< map[y].length; x++) {
      if(map[y][x] === playerPos)
      return bfs(map, x, y);
    }
  }

  return;
};

const part2 = (rawInput: string) => {
  const map = cloneDeep(parseInput(rawInput));

  let res = [];

  for(let y = 0; y< map.length; y++) {
    for(let x = 0; x< map[y].length; x++) {
      if(map[y][x] == playerPos) {
        map[y][x] = 0;
      }
    }
  }

  for(let y = 0; y< map.length; y++) {
    for(let x = 0; x< map[y].length; x++) {
      if(map[y][x] == 0 || map[y][x] == playerPos)
      res.push(bfs(map, x, y));
    }
  }

  return min(res);
};

run({
  part1: {
    tests: [
      {
        input: `Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi`,
        expected: 31,
      },
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