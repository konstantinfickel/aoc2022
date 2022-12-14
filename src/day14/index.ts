import run from "aocrunner";
import { array, lines, tuple } from "../utils/index.js";

import { flatten, map, max, min, mixin, range, repeat, times, toNumber } from "lodash-es";
import { start } from "repl";

const parseInput = lines(array(tuple(toNumber, toNumber, ','), ' -> '));

const toMap = (input: [number, number][][]): {x: number, y: number, mapA: string[][]} => {
  const minX = Math.min(min(map(flatten(input), ([x,y]) => x)) as number, 500) - 5;
  const maxX = Math.max(max(map(flatten(input), ([x,y]) => x)) as number, 500) + 5;
  const minY = Math.min(min(map(flatten(input), ([x,y]) => y)) as number, 0) - 5;
  const maxY = Math.max(max(map(flatten(input), ([x,y]) => y)) as number, 0) + 5;
  const w = maxX - minX + 1;
  const h = maxY - minY + 1;

  const inputTranslated = map(input, a => map(a , (([x,y]) => [x-minX, y-minY])));
  const mapA = times(h, () => times(w, () => ' '));

  for(let a of inputTranslated) {
    let x = a[0];
    for(let b of a.slice(1)) {
      if(b[1] === x[1]) {
        for(let newX of range(Math.min(b[0], x[0]), Math.max(b[0], x[0])+1)) {
          mapA[b[1]][newX] = '#';
        }
      } else {
        for(let newY of range(Math.min(b[1], x[1]), Math.max(b[1], x[1])+1)) {
          mapA[newY][b[0]] = '#';
        }
      }
      x = b;
    }
  }

  return {mapA, x: 500-minX, y: 0-minY};
};

const dropSand = (mapA: string[][], startX: number, startY: number) => {
  let x = startX;
  let y = startY;

  while(mapA[y+1][x-1] === ' ' || mapA[y+1][x] === ' ' || mapA[y+1][x+1] === ' ') {
    y++;
    if(y >= mapA.length -1) {
      return true;
    }
    if(mapA[y][x] === ' ') {
    } else if(mapA[y][x-1] === ' ') {
      x--;
    } else if(mapA[y][x+1] === ' ') {
      x++;
    } else {
      throw 'nonono';
    }
  }

  mapA[y][x] = 'o';
  return false;
}


const part1 = (rawInput: string) => {
  const {x,y,mapA} = toMap(parseInput(rawInput));
  let count = 0;
  while (true) {
    console.log(mapA.map(m => m.join('')).join('\n'));
    if(dropSand(mapA, x, y)) {
      return count;
    }
    count++;
  }
};

const part2 = (rawInput: string) => {
  const {x,y,mapA} = toMap(parseInput(rawInput));
  let count = 0;
  while (true) {
    console.log(mapA.map(m => m.join('')).join('\n'));
    if(dropSand(mapA, x, y)) {
      return count;
    }
    count++;
  }
};

run({
  onlyTests: false,
  part1: {
    tests: [
      {
        input: `498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9`,
        expected: 24,
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
});