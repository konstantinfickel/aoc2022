import run from "aocrunner";
import { array, lines, sectionsWithPremable } from "../utils/index.js";

import { assign, max, times, toNumber } from "lodash-es";

const parseInput = sectionsWithPremable(lines(array(String, '')), String);

const Direction = {
  RIGHT: 0,
  DOWN: 1,
  LEFT: 2,
  UP: 3,
  END: -1,
} as const;
type Direction = typeof Direction[keyof typeof Direction];

const parseDirections = (v: string): [number, Direction][] => {
  const result: [number, Direction][] = [];

  let amount: number = 0;

  for(const x of v.split('')) {
    if(/^R|L|U|D$/.test(x)) {
      let direction;
      switch(x) {
        case 'R': direction = Direction.RIGHT; break;
        case 'D': direction = Direction.DOWN; break;
        case 'L': direction = Direction.LEFT; break;
        case 'U': direction = Direction.UP; break;
        default: throw 'dir';
      }
      result.push([amount, direction])
      amount = 0;
    } else {
      amount = 10*amount + toNumber(x);
    }
  }
  result.push([amount, Direction.END])

  return result;
}

const move = (map: string[][], oldX: number, oldY: number, amount: number, direction: Direction): {x: number, y: number} => {
  let x = oldX;
  let y = oldY;

  let lastXInMap = x;
  let lastYInMap = y;

  let stepsLeft = amount;

  let stepX = 0;
  let stepY = 0;

  switch(direction) {
    case Direction.DOWN:
      stepY=1;
      break;
    case Direction.UP:
      stepY=-1;
      break;
    case Direction.RIGHT:
      stepX=1;
      break;
    case Direction.LEFT:
      stepX=-1;
      break;
  }

  while(stepsLeft > 0) {
    x += stepX;
    y += stepY;

    if(x >= map[0].length) {
      x -= map[0].length;
    } else if(x < 0) {
      x += map[0].length;
    }
    if(y >= map.length) {
      y -= map.length;
    } else if(y < 0) {
      y += map.length;
    }

    if(map[y][x] === '.') {
      stepsLeft -= 1;
      lastXInMap = x;
      lastYInMap = y;
    } else if(map[y][x] === '#') {
      return {x: lastXInMap,y: lastYInMap};
    }
  }

  return {x: lastXInMap,y: lastYInMap};
}

const solve = ({map, i}: {map: string[][], i: [number, Direction][]}, inX: number, inY: number, inDirection: Direction) => {
  let x = inX;
  let y = inY;
  let direction: Direction = inDirection;

  for(const [ma, md] of i) {
    const {x:nx, y:ny} = move(map, x, y, ma, direction);
    x = nx;
    y = ny;

    if(md === Direction.LEFT) {
      direction = (direction + 3) % 4 as Direction;
    } else if (md === Direction.RIGHT) {
      direction = (direction + 1) % 4 as Direction;
    }
  }

  return {column: x, row: y, direction};
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const map = input[0];
  const w = max(map.map(x => x.length)) as number;
  const map2 = map.map(x => assign(times(w, () => ' '), x))

  const input2 = {
    map: map2,
    i: parseDirections(input[1][0]),
  };

  const {column, row, direction} = solve(input2, 0, 0, Direction.RIGHT);

  return 1000*(row+1) + 4*(column+1) + direction;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return;
};

const testInput = `        ...#
        .#..
        #...
        ...  
...#.......#
........#...
..#....#....
..........#.
        ...#....
        .....#..
        .#......
        ......#.

10R5L5R10L4R5L5`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 6032,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 5031,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
