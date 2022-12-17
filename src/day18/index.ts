import run from "aocrunner";
import { lines, triple } from "../utils/index.js";

import { min, max, toNumber, isEmpty } from "lodash-es";

const parseInput = lines(triple(toNumber, toNumber, toNumber, ","));

const key = ([x, y, z]: number[]) => `${x},${y},${z}`;

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const set = new Set(input.map(key));

  let sides = 0;
  for (const [x, y, z] of input) {
    if (!set.has(key([x + 1, y, z]))) {
      sides++;
    }
    if (!set.has(key([x - 1, y, z]))) {
      sides++;
    }
    if (!set.has(key([x, y + 1, z]))) {
      sides++;
    }
    if (!set.has(key([x, y - 1, z]))) {
      sides++;
    }
    if (!set.has(key([x, y, z + 1]))) {
      sides++;
    }
    if (!set.has(key([x, y, z - 1]))) {
      sides++;
    }
  }

  return sides;
};

const allSides = ([x, y, z]: [number, number, number]): [number, number, number][] => {
  return [
    [x + 1, y, z],
    [x - 1, y, z],
    [x, y + 1, z],
    [x, y - 1, z],
    [x, y, z + 1],
    [x, y, z - 1],
  ];
};

const connectedToOutside = (
  set: Set<string>,
  s: [number, number, number],
  [minX, minY, minZ]: [number, number, number],
  [maxX, maxY, maxZ]: [number, number, number],
): boolean => {
  let visited: Set<string> = new Set();
  let queue: [number, number, number][] = [s];

  while (!isEmpty(queue)) {
    const [x,y,z] = queue.pop() as [number, number, number];
    if (set.has(key([x,y,z]))) {
      continue;
    }
    if (x > maxX || x < minX || y > maxY || y < minY || z > maxZ || z < minZ) {
      return true;
    }
    for (const n of allSides([x,y,z])) {
      if (!visited.has(key(n))) {
        queue.push(n);
        visited.add(key(n));
      }
    }
  }

  return false;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const set = new Set(input.map(key));

  const minI = [
    min(input.map(([x, y, z]) => x)),
    min(input.map(([x, y, z]) => y)),
    min(input.map(([x, y, z]) => z)),
  ] as [number, number, number];

  const maxI = [
    max(input.map(([x, y, z]) => x)),
    max(input.map(([x, y, z]) => y)),
    max(input.map(([x, y, z]) => z)),
  ] as [number, number, number];

  let sides = 0;
  for (const [x, y, z] of input) {
    if (connectedToOutside(set, [x + 1, y, z], minI, maxI)) {
      sides++;
    }
    if (connectedToOutside(set, [x - 1, y, z], minI, maxI)) {
      sides++;
    }
    if (connectedToOutside(set, [x, y + 1, z], minI, maxI)) {
      sides++;
    }
    if (connectedToOutside(set, [x, y - 1, z], minI, maxI)) {
      sides++;
    }
    if (connectedToOutside(set, [x, y, z + 1], minI, maxI)) {
      sides++;
    }
    if (connectedToOutside(set, [x, y, z - 1], minI, maxI)) {
      sides++;
    }
  }

  return sides;
};

const testInput = `2,2,2
1,2,2
3,2,2
2,1,2
2,3,2
2,2,1
2,2,3
2,2,4
2,2,6
1,2,5
3,2,5
2,1,5
2,3,5`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 64,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 58,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
