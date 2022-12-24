import run from "aocrunner";
import { cloneDeep, curry, times, values, xor } from "lodash-es";
import { array, lines } from "../utils/index.js";

const parseInput = lines(array(String, ''));


const Direction = {
  UP: 0,
  DOWN: 1,
  LEFT: 2,
  RIGHT: 3,
} as const;
type Direction = typeof Direction[keyof typeof Direction];

const DirectionToNext: Record<Direction, (pos: Position) => Position> = {
  [Direction.UP]: ([x, y]) => [x, y - 1],
  [Direction.DOWN]: ([x, y]) => [x, y + 1],
  [Direction.LEFT]: ([x, y]) => [x - 1, y],
  [Direction.RIGHT]: ([x, y]) => [x + 1, y],
}

const DirectionToFlip: Record<Direction, Direction> = {
  [Direction.UP]: Direction.DOWN,
  [Direction.DOWN]: Direction.UP,
  [Direction.LEFT]: Direction.RIGHT,
  [Direction.RIGHT]: Direction.LEFT,
}

type Tiles = '#' | '.';
type BaseMap = Tiles[][];
type Position = [number, number];
type BlizzardList = Map<string, { direction: Direction, pos: Position }[]>;

const pos2str = ([x, y]: [number, number]): string => `${x}|${y}`;

const parseMap = (input: string[][]): { map: BaseMap, blizzards: BlizzardList } => {
  const map: BaseMap = times(input.length, (y) => times(input[0].length, (x) => input[y][x] === '#' ? '#' : '.'));

  const blizzards: BlizzardList = new Map();

  input.forEach((row, y) => {
    row.forEach((tile, x) => {
      const pos: Position = [x, y];
      const key = pos2str(pos);
      switch (tile) {
        case '<': blizzards.set(key, [{ direction: Direction.LEFT, pos }]);
          break;
        case '>': blizzards.set(key, [{ direction: Direction.RIGHT, pos }]);
          break;
        case '^': blizzards.set(key, [{ direction: Direction.UP, pos }]);
          break;
        case 'v': blizzards.set(key, [{ direction: Direction.DOWN, pos }]);
          break;
      }
    });
  });

  return { map, blizzards };
}

const moveBlizzards = (map: BaseMap, blizzards: BlizzardList): BlizzardList => {
  const ret = new Map();

  for (const blizzardSpot of blizzards.values()) {
    for (const { direction, pos } of blizzardSpot) {
      let newPos = DirectionToNext[direction](pos);
      if (map[newPos[1]][newPos[0]] == '#') {
        if (newPos[0] < 1) {
          newPos[0] = map[0].length - 2;
        }
        if (newPos[1] < 1) {
          newPos[1] = map.length - 2;
        }
        if (newPos[0] > map[0].length - 2) {
          newPos[0] = 1;
        }
        if (newPos[1] > map.length - 2) {
          newPos[1] = 1;
        }
      }
      const key = pos2str(newPos);
      const currentList = ret.has(key) ? ret.get(key) : [];
      ret.set(key, [...currentList, { direction, pos: newPos }]);
    }
  }

  return ret;
}


const printMap = (map: string[][]): string => {
  return map.map(x => x.join('')).join('\n');
}

const drawMap = (map: BaseMap, blizzards: BlizzardList, layerQueue: Map<string, Position>) => {
  const mapX: string[][] = cloneDeep(map);
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      const pos = [x, y] as Position;
      const key = pos2str(pos);
      if (blizzards.has(key) && layerQueue.has(key)) {
        throw 'nonono';
      }
      if (blizzards.has(key)) {
        mapX[y][x] = String(blizzards.get(key)?.length);
      }
      if (layerQueue.has(key)) {
        mapX[y][x] = '@';
      }
    }
  }
  return mapX;
}

const getDuration = (map: BaseMap, blizzardsInit: BlizzardList, startPos: Position, targetFn: (pos: Position) => boolean): { time: number, blizzards: BlizzardList } => {
  let blizzards = blizzardsInit;
  let layerQueue: Map<string, Position> = new Map();
  layerQueue.set(pos2str(startPos), startPos)

  for (let i = 0; true; i++) {
    // console.log(printMap(drawMap(map, blizzards, layerQueue)));
    blizzards = moveBlizzards(map, blizzards);
    const newLayerQueue: Map<string, Position> = new Map();

    for (const pos of layerQueue.values()) {
      if (targetFn(pos)) {
        return { time: i, blizzards };
      }

      const curKey = pos2str(pos);
      if (!blizzards.has(curKey) && !newLayerQueue.has(curKey)) {
        newLayerQueue.set(curKey, pos);
      }

      for (const newDir of values(Direction)) {
        const newPos = DirectionToNext[newDir](pos);
        const newKey = pos2str(newPos);
        if (newPos[1] < 0 || newPos[1] >= map.length || map[newPos[1]][newPos[0]] !== '.') {
          continue;
        }
        if (blizzards.has(newKey)) {
          continue;
        }
        if (newLayerQueue.has(newKey)) {
          continue;
        }
        newLayerQueue.set(newKey, newPos)
      }
    }

    layerQueue = newLayerQueue;
  }
};

const isThereBottom = (map: BaseMap) => (pos: Position) => pos[1] === map.length - 1;
const isThereTop = (pos: Position) => pos[1] === 0;

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let { map, blizzards } = parseMap(input);

  const { time } = getDuration(map, blizzards, [0, 1], isThereBottom(map));

  return time;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let { map, blizzards } = parseMap(input);

  const { time: timeThere, blizzards: blizzardsThere } = getDuration(map, blizzards, [0, 1], isThereBottom(map));
  const { time: timeBack, blizzards: blizzardsBack } = getDuration(map, blizzardsThere, [map[0].length - 2, map.length - 1], isThereTop);
  const { time: timeThereAgain } = getDuration(map, blizzardsBack, [0, 1], isThereBottom(map));

  return timeThere + timeBack + timeThereAgain + 2;
};

const testInput = `#.######
#>>.<^<#
#.<..<<#
#>v.><>#
#<^v^^>#
######.#`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 18,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 54,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});