import run from "aocrunner";
import { lines } from "../utils/index.js";

import {
  cloneDeep,
  difference,
  fromPairs,
  isEmpty,
  map,
  max,
  memoize,
  toNumber,
  toPairs,
  uniq,
} from "lodash-es";

const parseInput = lines((x) => {
  const r =
    /^Valve (\w+) has flow rate=(\d+); tunnels? leads? to valves? (.*)$/;
  const m = r.exec(x) as RegExpExecArray;
  return [m[1], { flowRate: toNumber(m[2]), n: m[3].split(", ") }];
});

const findNextOption = (
  mapX: Record<string, { flowRate: number; n: string[] }>,
  currentPosition: string
): [string, number][] => {
  let visited: string[] = [];
  let queue: [string, number][] = [[currentPosition, 0]];
  let o: [string, number][] = [];
  while (!isEmpty(queue)) {
    const [cp, cd] = queue.pop() as [string, number];
    if(mapX[cp].flowRate > 0 && cp!==currentPosition) {
      o.push([cp, cd])
      continue;     
    }
    for (const x of mapX[cp].n) {
      if(!visited.includes(x)) {
        queue.push([x, cd + 1]);
        visited.push(x);
      }
    }
  }

  return o;
};

const solve = memoize(
  (
    mapX: Record<string, { flowRate: number; n: [string, number][] }>,
    openValves: string[],
    currentPosition: string,
    timeLeft: number,
  ): number => {
    if (timeLeft < 0) {
      return 0;
    }
    const options: number[] = [];
    const canOpen = !openValves.includes(currentPosition);
    if (canOpen) {
      options.push(
        solve(
          mapX,
          uniq([...openValves, currentPosition]).sort(),
          currentPosition,
          timeLeft - 1,
        ) +
          (canOpen
            ? Math.max(timeLeft - 1, 0) * mapX[currentPosition].flowRate
            : 0),
      );
    }

    for (let [next, time] of mapX[currentPosition].n) {
      if (time === 0) {
        continue;
      }
      options.push(solve(mapX, openValves, next, timeLeft - time));
    }

    return max(options) ?? 0;
  },
  (
    mapX: Record<string, { flowRate: number; n: [string, number][] }>,
    openValves: string[],
    currentPosition: string,
    timeLeft: number,
  ) => `${openValves.join(",")}|${currentPosition}|${timeLeft}`,
);

const getAllSubsets = (theArray) =>
  theArray.reduce(
    (subsets, value) => subsets.concat(subsets.map((set) => [...set, value])),
    [[]],
  );

const part1 = (rawInput: string) => {
  const input = simplifyMap(fromPairs(parseInput(rawInput)));
  if (solve.cache) {
    solve.cache.clear();
  }
  return solve(input, ["AA"], "AA", 30);
};

const setZero = <T>(
  input: Record<string, { flowRate: number; n: T[] }>,
  x: string[],
) => {
  const i2 = cloneDeep(input);
  for (const y of x) {
    i2[y].flowRate = 0;
  }
  return i2;
};

const simplifyMap = (
  input: Record<string, { flowRate: number; n: string[] }>,
): Record<string, { flowRate: number; n: [string, number][] }> => {
  return fromPairs(
    toPairs(input).map(([name, info]) => {
      const info2 = {
        ...info,
        n: findNextOption(input, name),
      };
      return [name, info2];
    }),
  );
};

const part2 = (rawInput: string) => {
  const preliminary = fromPairs(parseInput(rawInput));

  const withFlow = toPairs(preliminary)
    .filter(([_, r]) => r.flowRate > 0)
    .map(([l]) => l);

  const subsets = getAllSubsets(withFlow);
  let x = 0;
  return max(
    map(subsets, (elephanSubset: string[]) => {
      const mySubset = difference(withFlow, elephanSubset);
      let res = 0;

      const myInput = simplifyMap(setZero(preliminary, elephanSubset));
      solve.cache.clear();

      // me
      res += solve(myInput, ["AA"], "AA", 26);

      const elephantInput = simplifyMap(setZero(preliminary, mySubset));
      solve.cache.clear();

      res += solve(elephantInput, ["AA"], "AA", 26);

      return res;
    }),
  );
};

run({
  part1: {
    tests: [
      {
        input: `Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
Valve BB has flow rate=13; tunnels lead to valves CC, AA
Valve CC has flow rate=2; tunnels lead to valves DD, BB
Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
Valve EE has flow rate=3; tunnels lead to valves FF, DD
Valve FF has flow rate=0; tunnels lead to valves EE, GG
Valve GG has flow rate=0; tunnels lead to valves FF, HH
Valve HH has flow rate=22; tunnel leads to valve GG
Valve II has flow rate=0; tunnels lead to valves AA, JJ
Valve JJ has flow rate=21; tunnel leads to valve II`,
        expected: 1651,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
Valve BB has flow rate=13; tunnels lead to valves CC, AA
Valve CC has flow rate=2; tunnels lead to valves DD, BB
Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
Valve EE has flow rate=3; tunnels lead to valves FF, DD
Valve FF has flow rate=0; tunnels lead to valves EE, GG
Valve GG has flow rate=0; tunnels lead to valves FF, HH
Valve HH has flow rate=22; tunnel leads to valve GG
Valve II has flow rate=0; tunnels lead to valves AA, JJ
Valve JJ has flow rate=21; tunnel leads to valve II`,
        expected: 1707,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
