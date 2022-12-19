import run from "aocrunner";
import { lines } from "../utils/index.js";

import {
  cloneDeep,
  keys,
  map,
  sum,
  toNumber,
} from "lodash-es";

const testInput: Array<
  Record<Materials, Array<{ amount: number; type: Materials }>>
> = [
  {
    ore: [{ amount: 4, type: "ore" }],
    clay: [{ amount: 2, type: "ore" }],
    obsidian: [
      { amount: 3, type: "ore" },
      { amount: 14, type: "clay" },
    ],
    geode: [
      { amount: 2, type: "ore" },
      { amount: 7, type: "obsidian" },
    ],
  },
  {
    ore: [{ amount: 2, type: "ore" }],
    clay: [{ amount: 3, type: "ore" }],
    obsidian: [
      { amount: 3, type: "ore" },
      { amount: 8, type: "clay" },
    ],
    geode: [
      { amount: 3, type: "ore" },
      { amount: 12, type: "obsidian" },
    ],
  },
];

const input: Array<
  Record<Materials, Array<{ amount: number; type: Materials }>>
> = [
  {
    ore: [{ amount: 4, type: "ore" }],
    clay: [{ amount: 4, type: "ore" }],
    obsidian: [
      { amount: 4, type: "ore" },
      { amount: 18, type: "clay" },
    ],
    geode: [
      { amount: 4, type: "ore" },
      { amount: 9, type: "obsidian" },
    ],
  },
  {
    ore: [{ amount: 2, type: "ore" }],
    clay: [{ amount: 2, type: "ore" }],
    obsidian: [
      { amount: 2, type: "ore" },
      { amount: 17, type: "clay" },
    ],
    geode: [
      { amount: 2, type: "ore" },
      { amount: 10, type: "obsidian" },
    ],
  },
  {
    ore: [{ amount: 4, type: "ore" }],
    clay: [{ amount: 4, type: "ore" }],
    obsidian: [
      { amount: 2, type: "ore" },
      { amount: 7, type: "clay" },
    ],
    geode: [
      { amount: 4, type: "ore" },
      { amount: 13, type: "obsidian" },
    ],
  },
  {
    ore: [{ amount: 4, type: "ore" }],
    clay: [{ amount: 3, type: "ore" }],
    obsidian: [
      { amount: 4, type: "ore" },
      { amount: 20, type: "clay" },
    ],
    geode: [
      { amount: 4, type: "ore" },
      { amount: 8, type: "obsidian" },
    ],
  },
  {
    ore: [{ amount: 4, type: "ore" }],
    clay: [{ amount: 4, type: "ore" }],
    obsidian: [
      { amount: 4, type: "ore" },
      { amount: 5, type: "clay" },
    ],
    geode: [
      { amount: 2, type: "ore" },
      { amount: 10, type: "obsidian" },
    ],
  },
  {
    ore: [{ amount: 4, type: "ore" }],
    clay: [{ amount: 4, type: "ore" }],
    obsidian: [
      { amount: 4, type: "ore" },
      { amount: 8, type: "clay" },
    ],
    geode: [
      { amount: 3, type: "ore" },
      { amount: 19, type: "obsidian" },
    ],
  },
  {
    ore: [{ amount: 4, type: "ore" }],
    clay: [{ amount: 4, type: "ore" }],
    obsidian: [
      { amount: 4, type: "ore" },
      { amount: 8, type: "clay" },
    ],
    geode: [
      { amount: 4, type: "ore" },
      { amount: 14, type: "obsidian" },
    ],
  },
  {
    ore: [{ amount: 4, type: "ore" }],
    clay: [{ amount: 4, type: "ore" }],
    obsidian: [
      { amount: 3, type: "ore" },
      { amount: 6, type: "clay" },
    ],
    geode: [
      { amount: 2, type: "ore" },
      { amount: 14, type: "obsidian" },
    ],
  },
  {
    ore: [{ amount: 3, type: "ore" }],
    clay: [{ amount: 3, type: "ore" }],
    obsidian: [
      { amount: 3, type: "ore" },
      { amount: 6, type: "clay" },
    ],
    geode: [
      { amount: 2, type: "ore" },
      { amount: 16, type: "obsidian" },
    ],
  },
  {
    ore: [{ amount: 2, type: "ore" }],
    clay: [{ amount: 4, type: "ore" }],
    obsidian: [
      { amount: 4, type: "ore" },
      { amount: 19, type: "clay" },
    ],
    geode: [
      { amount: 2, type: "ore" },
      { amount: 18, type: "obsidian" },
    ],
  },
  {
    ore: [{ amount: 3, type: "ore" }],
    clay: [{ amount: 4, type: "ore" }],
    obsidian: [
      { amount: 4, type: "ore" },
      { amount: 14, type: "clay" },
    ],
    geode: [
      { amount: 4, type: "ore" },
      { amount: 10, type: "obsidian" },
    ],
  },
  {
    ore: [{ amount: 2, type: "ore" }],
    clay: [{ amount: 3, type: "ore" }],
    obsidian: [
      { amount: 3, type: "ore" },
      { amount: 13, type: "clay" },
    ],
    geode: [
      { amount: 3, type: "ore" },
      { amount: 15, type: "obsidian" },
    ],
  },
  {
    ore: [{ amount: 3, type: "ore" }],
    clay: [{ amount: 4, type: "ore" }],
    obsidian: [
      { amount: 4, type: "ore" },
      { amount: 13, type: "clay" },
    ],
    geode: [
      { amount: 3, type: "ore" },
      { amount: 7, type: "obsidian" },
    ],
  },
  {
    ore: [{ amount: 2, type: "ore" }],
    clay: [{ amount: 4, type: "ore" }],
    obsidian: [
      { amount: 4, type: "ore" },
      { amount: 16, type: "clay" },
    ],
    geode: [
      { amount: 4, type: "ore" },
      { amount: 17, type: "obsidian" },
    ],
  },
  {
    ore: [{ amount: 3, type: "ore" }],
    clay: [{ amount: 4, type: "ore" }],
    obsidian: [
      { amount: 3, type: "ore" },
      { amount: 15, type: "clay" },
    ],
    geode: [
      { amount: 3, type: "ore" },
      { amount: 20, type: "obsidian" },
    ],
  },
  {
    ore: [{ amount: 4, type: "ore" }],
    clay: [{ amount: 4, type: "ore" }],
    obsidian: [
      { amount: 2, type: "ore" },
      { amount: 18, type: "clay" },
    ],
    geode: [
      { amount: 4, type: "ore" },
      { amount: 20, type: "obsidian" },
    ],
  },
  {
    ore: [{ amount: 2, type: "ore" }],
    clay: [{ amount: 4, type: "ore" }],
    obsidian: [
      { amount: 4, type: "ore" },
      { amount: 18, type: "clay" },
    ],
    geode: [
      { amount: 2, type: "ore" },
      { amount: 11, type: "obsidian" },
    ],
  },
  {
    ore: [{ amount: 3, type: "ore" }],
    clay: [{ amount: 4, type: "ore" }],
    obsidian: [
      { amount: 2, type: "ore" },
      { amount: 14, type: "clay" },
    ],
    geode: [
      { amount: 3, type: "ore" },
      { amount: 14, type: "obsidian" },
    ],
  },
  {
    ore: [{ amount: 4, type: "ore" }],
    clay: [{ amount: 4, type: "ore" }],
    obsidian: [
      { amount: 2, type: "ore" },
      { amount: 11, type: "clay" },
    ],
    geode: [
      { amount: 2, type: "ore" },
      { amount: 7, type: "obsidian" },
    ],
  },
  {
    ore: [{ amount: 4, type: "ore" }],
    clay: [{ amount: 3, type: "ore" }],
    obsidian: [
      { amount: 2, type: "ore" },
      { amount: 19, type: "clay" },
    ],
    geode: [
      { amount: 3, type: "ore" },
      { amount: 10, type: "obsidian" },
    ],
  },
  {
    ore: [{ amount: 4, type: "ore" }],
    clay: [{ amount: 4, type: "ore" }],
    obsidian: [
      { amount: 4, type: "ore" },
      { amount: 7, type: "clay" },
    ],
    geode: [
      { amount: 2, type: "ore" },
      { amount: 19, type: "obsidian" },
    ],
  },
  {
    ore: [{ amount: 2, type: "ore" }],
    clay: [{ amount: 3, type: "ore" }],
    obsidian: [
      { amount: 3, type: "ore" },
      { amount: 18, type: "clay" },
    ],
    geode: [
      { amount: 2, type: "ore" },
      { amount: 19, type: "obsidian" },
    ],
  },
  {
    ore: [{ amount: 4, type: "ore" }],
    clay: [{ amount: 3, type: "ore" }],
    obsidian: [
      { amount: 4, type: "ore" },
      { amount: 20, type: "clay" },
    ],
    geode: [
      { amount: 2, type: "ore" },
      { amount: 15, type: "obsidian" },
    ],
  },
  {
    ore: [{ amount: 2, type: "ore" }],
    clay: [{ amount: 4, type: "ore" }],
    obsidian: [
      { amount: 4, type: "ore" },
      { amount: 13, type: "clay" },
    ],
    geode: [
      { amount: 3, type: "ore" },
      { amount: 11, type: "obsidian" },
    ],
  },
  {
    ore: [{ amount: 3, type: "ore" }],
    clay: [{ amount: 3, type: "ore" }],
    obsidian: [
      { amount: 3, type: "ore" },
      { amount: 8, type: "clay" },
    ],
    geode: [
      { amount: 2, type: "ore" },
      { amount: 12, type: "obsidian" },
    ],
  },
  {
    ore: [{ amount: 2, type: "ore" }],
    clay: [{ amount: 4, type: "ore" }],
    obsidian: [
      { amount: 2, type: "ore" },
      { amount: 20, type: "clay" },
    ],
    geode: [
      { amount: 3, type: "ore" },
      { amount: 15, type: "obsidian" },
    ],
  },
  {
    ore: [{ amount: 3, type: "ore" }],
    clay: [{ amount: 4, type: "ore" }],
    obsidian: [
      { amount: 4, type: "ore" },
      { amount: 18, type: "clay" },
    ],
    geode: [
      { amount: 3, type: "ore" },
      { amount: 13, type: "obsidian" },
    ],
  },
  {
    ore: [{ amount: 4, type: "ore" }],
    clay: [{ amount: 4, type: "ore" }],
    obsidian: [
      { amount: 4, type: "ore" },
      { amount: 17, type: "clay" },
    ],
    geode: [
      { amount: 2, type: "ore" },
      { amount: 13, type: "obsidian" },
    ],
  },
  {
    ore: [{ amount: 2, type: "ore" }],
    clay: [{ amount: 4, type: "ore" }],
    obsidian: [
      { amount: 3, type: "ore" },
      { amount: 14, type: "clay" },
    ],
    geode: [
      { amount: 4, type: "ore" },
      { amount: 9, type: "obsidian" },
    ],
  },
  {
    ore: [{ amount: 3, type: "ore" }],
    clay: [{ amount: 4, type: "ore" }],
    obsidian: [
      { amount: 4, type: "ore" },
      { amount: 6, type: "clay" },
    ],
    geode: [
      { amount: 3, type: "ore" },
      { amount: 16, type: "obsidian" },
    ],
  },
];

const parseInput = lines(toNumber);

type Materials = "ore" | "clay" | "obsidian" | "geode";
const craft = (
  type: Materials,
  costs: Record<Materials, { amount: number; type: Materials }[]>,
  stock: Record<Materials, number>,
): Record<Materials, number> | null => {
  const costsForType = costs[type];
  let newStock = cloneDeep(stock);

  for (const { amount: cAmount, type: cType } of costsForType) {
    if (newStock[cType] >= cAmount) {
      newStock[cType] -= cAmount;
    } else {
      return null;
    }
  }

  return newStock;
};

const mult = (
  m: number,
  stock: Record<Materials, number>,
): Record<Materials, number> => {
  let ret = cloneDeep(stock);

  for (const t of keys(ret)) {
    ret[t as Materials] *= m;
  }
  return ret;
};

const add = (
  robots: Record<Materials, number>,
  stock: Record<Materials, number>,
): Record<Materials, number> => {
  let ret = cloneDeep(stock);

  for (const t of keys(robots)) {
    ret[t as Materials] += robots[t as Materials];
  }
  return ret;
};

const r2str = (r: Record<Materials, number>) =>
  `${r.ore}|${r.obsidian}|${r.geode}|${r.clay}`;

const build = (
  recipes: Record<Materials, { type: Materials; amount: number }[]>,
  robots: Record<Materials, number>,
  stock: Record<Materials, number>,
): Array<{
  robots: Record<Materials, number>;
  stock: Record<Materials, number>;
}> => {
  const possibleRes: Array<{
    robots: Record<Materials, number>;
    stock: Record<Materials, number>;
  }> = [];
  for (const rk of keys(recipes)) {
    const newStock = craft(rk as Materials, recipes, stock);
    if (newStock) {
      possibleRes.push({
        robots: { ...robots, [rk]: robots[rk as Materials] + 1 },
        stock: add(newStock, robots),
      });
    }
  }
  if (
    (robots.obsidian > 0 && possibleRes.length < 4) ||
    (robots.clay > 0 && robots.ore > 0 && possibleRes.length < 3) ||
    possibleRes.length < 2
  ) {
    // not all robots could be build, maybe wait
    possibleRes.push({ robots, stock: add(stock, robots) });
  }
  return possibleRes;
};

const LT = 1;
const GT = -1;
const EQ = 0;

const compareStock = (
  { geode: lg, clay: lc, ore: lo, obsidian: lb }: Record<Materials, number>,
  { geode: rg, clay: rc, ore: ro, obsidian: rb }: Record<Materials, number>,
) => {
  if (lg < rg) {
    return LT;
  } else if (lg > rg) {
    return GT;
  }

  if (lb < rb) {
    return LT;
  } else if (lb > rb) {
    return GT;
  }

  if (lc < rc) {
    return LT;
  } else if (lc > rc) {
    return GT;
  }

  if (lo < ro) {
    return LT;
  } else if (lo > ro) {
    return GT;
  }

  return EQ;
};

const solveWithRecipes = (
  recipes: Record<Materials, { type: Materials; amount: number }[]>,
  time: number,
): number => {
  const stock = {
    ore: 0,
    clay: 0,
    obsidian: 0,
    geode: 0,
  };
  const robots = {
    ore: 1,
    clay: 0,
    obsidian: 0,
    geode: 0,
  };

  let stateQueue: Array<{
    robots: Record<Materials, number>;
    stock: Record<Materials, number>;
  }> = [{ stock, robots }];
  for (let i = 0; i < time; i++) {
    let newStateQueue: Array<{
      robots: Record<Materials, number>;
      stock: Record<Materials, number>;
    }> = [];

    for (let { robots, stock } of stateQueue) {
      newStateQueue.push(...build(recipes, robots, stock));
    }

    newStateQueue.sort(
      (
        { robots: lRobots, stock: lStock },
        { robots: rRobots, stock: rStock },
      ) =>
        compareStock(
          add(mult(i, lStock), mult(time - i - 1, lRobots)),
          add(mult(i, rStock), mult(time - i - 1, rRobots)),
        ),
    );

    console.log(i, newStateQueue.slice(0, 2));

    stateQueue = newStateQueue.slice(0, 5000);
  }

  return stateQueue[0].stock.geode;
};

const part1 = () => {
  return;
  const data = input;
  const time = 24;

  return sum(map(
    data,
    (recipes, index) => solveWithRecipes(recipes, time) * (index + 1),
  ));
};

const part2 = (rawInput: string) => {
  const data = input.slice(0, 3);
  const time = 32;

  const r = map(
    data,
    (recipes, index) => solveWithRecipes(recipes, time),
  );

  return r[0] * r[1] * r[2];
};

run({
  part1: {
    tests: [],
    solution: part1,
  },
  part2: {
    tests: [],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
