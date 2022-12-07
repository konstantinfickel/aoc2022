import run from "aocrunner";
import { copyFileSync } from "fs";
import { filter, isEmpty, isNumber, isUndefined, keys, map, min, set, sum, toNumber, toPairs } from "lodash-es";
import { array, lines } from "../utils/index.js";

const parseInput = lines(array(String));

const buildTree = (cmd: string[][]) => {
  const tree = {};

  let currentPath: string[] = [];

  for(const line of cmd) {
    if (line[0] === '$') {
      if (line[1] === 'cd') {
        if (line[2] === '..') {
          currentPath.pop();
        } else {
          currentPath.push(line[2]);
        }}
    } else if (/[0-9]+/.test(line[0])) {
      const filePath = [...currentPath, line[1]];
      set(tree, filePath, toNumber(line[0]));
    }
  }
  return tree;
}

const getSize = (x): number => {
  if (isNumber(x)) {
    return x;
  }
  let size = 0;
  for(const k of keys(x)) {
    size += getSize(x[k]);
  }
  return size;
}

const recurse = (x) => {
  if(isNumber(x)) {
    return 0;
  }
  const thisSize = getSize(x);
  const childSize = sum(map(toPairs(x), ([k,v]: any) => recurse(v)));
  if (thisSize < 100000) {
    return thisSize + childSize;
  }
  return childSize;
}

let sizes = [];
const recurse2 = (x, s) => {
  if(isNumber(x)) {
    return;
  }
  const thisSize = getSize(x);
  sizes.push(thisSize)
  const childSizes: number[] = filter(map(toPairs(x), ([k,v]: any) => recurse2(v, s)), z => isNumber(z));
  if (thisSize >= s) {
    if ((!isEmpty(childSizes) && thisSize > min(childSizes))) {
      return min(childSizes);
    }
    return thisSize;
  } else if(!isEmpty(childSizes)) {
    return min(childSizes);
  }
  return;
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const tree = buildTree(input);

  const x =recurse(tree);

  return x;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const tree = buildTree(input);

  const x =  recurse2(tree, getSize(tree) - 40000000);

  return x;
};

run({
  part1: {
    tests: [
      {
        input: `$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k
`,
        expected: 95437,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k
`,
        expected: 24933642,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});