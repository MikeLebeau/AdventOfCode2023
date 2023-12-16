import { examplePuzzle, examplePuzzleTwo, realPuzzle } from './puzzle';

function one(useRealPuzzle: boolean = true): String {
  const lines: String[] = useRealPuzzle
    ? realPuzzle.trim().split('\n')
    : examplePuzzle.trim().split('\n');

  let finalValue: number = 0;

  lines.forEach((line: String) => {
    const digits = line.match(/[0-9]/g);
    const combinedDigits = digits[0] + digits[digits.length - 1];
    finalValue += Number.parseInt(combinedDigits);
  });

  return `Day 01* (${
    useRealPuzzle ? 'realPuzzle' : 'examplePuzzle'
  }): ${finalValue}`;
}

enum Filoutage {
  'oneight' = 18,
  'twone' = 21,
  'threeight' = 38,
  'fiveight' = 58,
  'sevenine' = 79,
  'eightwo' = 82,
  'eighthree' = 83,
  'nineight' = 98,
}

enum DigitName {
  'one' = 1,
  'two' = 2,
  'three' = 3,
  'four' = 4,
  'five' = 5,
  'six' = 6,
  'seven' = 7,
  'eight' = 8,
  'nine' = 9,
}

function two(useRealPuzzle: boolean = true): String {
  const lines: String[] = useRealPuzzle
    ? realPuzzle.trim().split('\n')
    : examplePuzzleTwo.trim().split('\n');

  let finalValue: number = 0;

  lines.forEach((line: String) => {
    var newLine = line;
    const filoutageReg = new RegExp(
      '(' +
        Object.keys(Filoutage)
          .filter((x) => !(parseInt(x) >= 0))
          .join('|') +
        ')',
      'gi'
    );
    newLine = newLine.replace(filoutageReg, (group) => Filoutage[group]);

    const reg = new RegExp(Object.keys(DigitName).join('|'), 'gi');
    const digits = newLine
      .match(reg)
      .map((digit: string) =>
        Number.parseInt(digit) ? digit : DigitName[digit].toString()
      );

    const combinedDigits = digits[0] + digits[digits.length - 1];

    finalValue += Number.parseInt(combinedDigits);
  });

  return `Day 01** (${
    useRealPuzzle ? 'realPuzzle' : 'examplePuzzle'
  }): ${finalValue}`;
}

export default { one, two };
