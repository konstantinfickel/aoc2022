import { split, map } from "lodash-es";

export const triple =
  <A, B, C>(
    aParser: (raw: string) => A,
    bParser: (raw: string) => B,
    cParser: (raw: string) => C,
    seperator: string | RegExp = /\s+/g
  ) =>
  (line: string): [A, B, C] => {
    const splitLine = split(line, seperator);
    return [
      aParser(splitLine[0]),
      bParser(splitLine[1]),
      cParser(splitLine[2]),
    ];
  };

export const tuple =
  <A, B>(aParser: (raw: string) => A, bParser: (raw: string) => B, seperator: string | RegExp = /\s+/g) =>
  (line: string): [A, B] => {
    const splitLine = split(line, seperator);
    return [aParser(splitLine[0]), bParser(splitLine[1])];
  };

export const array =
  <A>(parser: (raw: string) => A, seperator: string | RegExp = /\s+/) =>
  (line: string): A[] => {
    const splitLine = split(line, seperator);
    return map(splitLine, parser);
  };

export const sectionsWithPremable =
  <A, B>(aParser: (str: string) => A, bParser: (str: string) => B, seperator: string | RegExp = '\n\n') => (str: string): [A, B[]] => {
    const [firstSection, ...restSections] = split(str, seperator);
    return [aParser(firstSection), map(restSections, section => bParser(section))];
  };

export const sections =
  <A>(aParser: (str: string) => A, seperator: string | RegExp = '\n\n') => (str: string) => {
    const splitInput = split(str, seperator);
    return map(splitInput, section => aParser(section))
  };

export const lines =
  <T>(parser: (str: string) => T) =>
  (str: string) =>
    map(split(str, "\n"), (value: string): T => parser(value));

