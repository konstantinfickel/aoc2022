import run from "aocrunner";
import { lines, tuple } from "../utils/index.js";

import { identity, last, range, reduce, times, toNumber } from "lodash-es";

const parseInput = lines(tuple(identity, toNumber));

const updatePos = (cmd: string, oldHeadX: number, oldHeadY: number) => {
  if (cmd === "L") {
    return { headX: oldHeadX - 1, headY: oldHeadY };
  } else if (cmd === "R") {
    return { headX: oldHeadX + 1, headY: oldHeadY };
  } else if (cmd === "U") {
    return { headX: oldHeadX, headY: oldHeadY - 1 };
  }
  return { headX: oldHeadX, headY: oldHeadY + 1 };
};

const updateTail = (headX: number, headY: number, oldTailX: number, oldTailY: number) => {
  if(Math.abs(headX - oldTailX) > 1 || Math.abs(headY - oldTailY) > 1) {
    if (headX === oldTailX) {
      if (headY > oldTailY) {
        return {tailX: oldTailX, tailY: oldTailY + 1};
      } else if (headY < oldTailY) {
        return {tailX: oldTailX, tailY: oldTailY - 1};
      }
    }
    if (headY === oldTailY) {
      if (headX > oldTailX) {
        return {tailX: oldTailX + 1, tailY: oldTailY};
      } else if (headX < oldTailX) {
        return {tailX: oldTailX - 1, tailY: oldTailY};
      }
    }
    const tailX = oldTailX + ((headX > oldTailX) ? 1 : -1);
    const tailY = oldTailY + ((headY > oldTailY) ? 1 : -1);
    return {tailX, tailY};
  }

  return {tailX: oldTailX, tailY: oldTailY};
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const simpleInput = input.flatMap(([d, t]: [unknown, number]) =>
    times(t, () => d as string),
  );

  const {visitedPositions} = reduce(
    simpleInput,
    (
      {
        position: {
          headX: oldHeadX,
          headY: oldHeadY,
          tailX: oldTailX,
          tailY: oldTailY,
        },
        visitedPositions,
      },
      nextCommand,
    ) => {
      const { headX, headY } = updatePos(nextCommand, oldHeadX, oldHeadY);
      const { tailX, tailY } = updateTail(headX, headY, oldTailX, oldTailY);
      visitedPositions.add(`${tailX}|${tailY}`);

      return { position: { headX, headY, tailX, tailY }, visitedPositions };
    },
    {
      position: { headX: 0, tailX: 0, headY: 0, tailY: 0 },
      visitedPositions: new Set([`0|0`]),
    },
  );

  return visitedPositions.size;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const simpleInput = input.flatMap(([d, t]: [unknown, number]) =>
    times(t, () => d as string),
  );

  const {visitedPositions} = reduce(
    simpleInput,
    (
      {
        position,
        visitedPositions,
      },
      nextCommand,
    ) => {
      const { headX, headY } = updatePos(nextCommand, position[0].x, position[0].y);

      let newTail: {x: number, y:number}[] = [{x: headX, y: headY}];
      
      for(const i of range(1, position.length)) {
        const { tailX, tailY } = updateTail(newTail[i-1].x, newTail[i-1].y, position[i].x, position[i].y);
        newTail.push({x: tailX, y: tailY});
      }
      let l = last(newTail);
      visitedPositions.add(`${l.x}|${l.y}`);

      return { position: newTail, visitedPositions };
    },
    {
      position: times(10, () => ({x: 0, y: 0})),
      visitedPositions: new Set([`0|0`]),
    },
  );

  return visitedPositions.size;
};

run({
  part1: {
    tests: [
      {
        input: `R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2`,
        expected: 13,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `R 5
U 8
L 8
D 3
R 17
D 10
L 25
U 20`,
        expected: 36,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
