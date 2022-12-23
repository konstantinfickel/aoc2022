import run from "aocrunner";
import { array, lines } from "../utils/index.js";

import { max, min, times } from "lodash-es";

const parseInput = lines(array(String, ""));

const Direction = {
  NORTH: 0,
  SOUTH: 1,
  WEST: 2,
  EAST: 3,
} as const;
type Direction = typeof Direction[keyof typeof Direction];

const surroundings = ([x, y]: [number, number]): Array<[number, number]> => [
  [x - 1, y - 1],
  [x - 1, y],
  [x - 1, y + 1],
  [x, y - 1],
  [x, y + 1],
  [x + 1, y - 1],
  [x + 1, y],
  [x + 1, y + 1],
];

const directionMap = {
  [Direction.NORTH]: {
    check: ([x, y]: [number, number]): Array<[number, number]> => [
      [x - 1, y - 1],
      [x, y - 1],
      [x + 1, y - 1],
    ],
    move: ([x, y]: [number, number]): [number, number] => [x, y - 1],
  },
  [Direction.SOUTH]: {
    check: ([x, y]: [number, number]): Array<[number, number]> => [
      [x - 1, y + 1],
      [x, y + 1],
      [x + 1, y + 1],
    ],
    move: ([x, y]: [number, number]): [number, number] => [x, y + 1],
  },
  [Direction.WEST]: {
    check: ([x, y]: [number, number]): Array<[number, number]> => [
      [x - 1, y - 1],
      [x - 1, y],
      [x - 1, y + 1],
    ],
    move: ([x, y]: [number, number]): [number, number] => [x - 1, y],
  },
  [Direction.EAST]: {
    check: ([x, y]: [number, number]): Array<[number, number]> => [
      [x + 1, y - 1],
      [x + 1, y],
      [x + 1, y + 1],
    ],
    move: ([x, y]: [number, number]): [number, number] => [x + 1, y],
  },
} as const;

const pos2str = ([x, y]: [number, number]) => `${x};${y}`;

const move = (
  elvePositionsCurrent: Map<string, [number, number]>,
  startDirection: Direction,
): Map<string, [number, number]> => {
  const plannedPositions: Map<string, number> = new Map();
  const positionPlans: [[number, number], [number, number]][] = [];

  // PLAN
  for (const currPos of elvePositionsCurrent.values()) {
    let nextElvePos: [number, number] = currPos;
    if (
      surroundings(currPos).some((pos) =>
        elvePositionsCurrent.has(pos2str(pos)),
      )
    ) {
      for (let dOff = 0; dOff < 4; dOff++) {
        const d = ((startDirection + dOff) % 4) as Direction;
        if (
          !directionMap[d]
            .check(currPos)
            .some((pos) => elvePositionsCurrent.has(pos2str(pos)))
        ) {
          nextElvePos = directionMap[d].move(currPos);
          break;
        }
      }
    }
    plannedPositions.set(
      pos2str(nextElvePos),
      (plannedPositions.get(pos2str(nextElvePos)) ?? 0) + 1,
    );
    positionPlans.push([currPos, nextElvePos]);
  }

  const newPositions: Map<string, [number, number]> = new Map();

  // MOVE
  for (const [oldPos, newPos] of positionPlans) {
    if (plannedPositions.get(pos2str(newPos)) === 1) {
      if (newPositions.has(pos2str(newPos))) {
        throw "err1";
      }
      newPositions.set(pos2str(newPos), newPos);
      continue;
    }

    if (newPositions.has(pos2str(oldPos))) {
      throw `err2 ${oldPos};${newPos}`;
    }
    newPositions.set(pos2str(oldPos), oldPos);
  }

  return newPositions;
};

const evaluate = (elvePositionsCurrent: Map<string, [number, number]>) => {
  const positions = Array.from(elvePositionsCurrent.values());
  const minX = min(positions.map(([x, y]) => x)) as number;
  const maxX = max(positions.map(([x, y]) => x)) as number;
  const minY = min(positions.map(([x, y]) => y)) as number;
  const maxY = max(positions.map(([x, y]) => y)) as number;

  const map = times(maxY - minY + 1, () => times(maxX - minX + 1, () => "."));
  positions.forEach(([x, y]) => (map[y - minY][x - minX] = "#"));
  // console.log(map.map((x) => x.join("")).join("\n"));

  return (maxX - minX + 1) * (maxY - minY + 1) - positions.length;
};
const toStrMap = (elvePositionsCurrent: Map<string, [number, number]>) => {
  const positions = Array.from(elvePositionsCurrent.values());
  const minX = min(positions.map(([x, y]) => x)) as number;
  const maxX = max(positions.map(([x, y]) => x)) as number;
  const minY = min(positions.map(([x, y]) => y)) as number;
  const maxY = max(positions.map(([x, y]) => y)) as number;

  const map = times(maxY - minY + 1, () => times(maxX - minX + 1, () => "."));
  positions.forEach(([x, y]) => (map[y - minY][x - minX] = "#"));
  return map.map((x) => x.join("")).join("\n");
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let elvePositions = new Map(
    input.flatMap((row, y) =>
      row.flatMap(
        (entry, x) =>
          (entry === "#" ? [[pos2str([x, y]), [x, y]]] : []) as Array<
            [string, [number, number]]
          >,
      ),
    ),
  );

  evaluate(elvePositions);
  for (let i = 1; i <= 10; i++) {
    elvePositions = move(elvePositions, ((i - 1) % 4) as Direction);
    evaluate(elvePositions);
  }

  return evaluate(elvePositions);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let elvePositions = new Map(
    input.flatMap((row, y) =>
      row.flatMap(
        (entry, x) =>
          (entry === "#" ? [[pos2str([x, y]), [x, y]]] : []) as Array<
            [string, [number, number]]
          >,
      ),
    ),
  );
  let strMap = toStrMap(elvePositions);

  evaluate(elvePositions);
  for (let i = 1; true; i++) {
    elvePositions = move(elvePositions, ((i - 1) % 4) as Direction);
    const newStrMap = toStrMap(elvePositions);
    if (newStrMap === strMap) {
      return i;
    }
    strMap = newStrMap;
  }
};

const testInput = `....#..
..###.#
#...#.#
.#...##
#.###..
##.#.##
.#..#..`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 110,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 20,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
