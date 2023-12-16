import { examplePuzzle, examplePuzzleTwo, realPuzzle } from './puzzle';

class Point {
  x: number;
  minY: number;
  maxY: number;
  value: String;

  constructor(x: number, minY: number, maxY: number, value: string) {
    this.x = x;
    this.minY = minY;
    this.maxY = maxY;
    this.value = value;
  }

  isSymbol() {
    return this.value !== '.' && isNaN(Number(this.value));
  }
}

const POINT = '.';

enum Options {
  Point,
  Symbol,
  Num,
}

function whichOption(value: String): Options {
  if (value !== POINT && isNaN(Number(value))) {
    return Options.Symbol;
  } else if (value !== POINT && !isNaN(Number(value))) {
    return Options.Num;
  } else if (value === POINT) {
    return Options.Point;
  }
}

function checkAround(center: Point, numList: Point[]): Point[] {
  const topLine = new Point(
    center.x - 1,
    center.minY - 1,
    center.maxY + 1,
    'topLine'
  );
  const bottomLine = new Point(
    center.x + 1,
    center.minY - 1,
    center.maxY + 1,
    'bottomLine'
  );

  let lesTouchants: Point[] = [];

  numList.forEach((num) => {
    if (topLine.x <= num.x && num.x <= bottomLine.x) {
      // console.log('Ligne touchante', num.x);
      if (
        (topLine.minY <= num.minY && num.minY <= topLine.maxY) ||
        (topLine.minY <= num.maxY && num.maxY <= topLine.maxY)
      ) {
        // console.log('Colonne touchante', num.minY, 'value', num.value);
        lesTouchants.push(num);
      }
    }
  });

  return lesTouchants;
}

function makeListFromPuzzle(puzzle: String[]) {
  let numList: Point[] = [];
  let symbolList: Point[] = [];

  for (let x = 0; x < puzzle.length; x++) {
    for (let y = 0; y < puzzle[x].length; y++) {
      if (puzzle[x][y] !== POINT && isNaN(Number(puzzle[x][y]))) {
        symbolList.push(new Point(x, y, y, puzzle[x][y]));
      } else if (puzzle[x][y] !== POINT) {
        let total = puzzle[x][y];
        let ys = { min: y, max: y };

        while (whichOption(puzzle[x][y + 1]) === Options.Num) {
          total += puzzle[x][y + 1];
          y++;
          ys['max'] = y;
        }

        numList.push(new Point(x, ys.min, ys.max, total));
      } else {
        // ICI c'est les point
      }
    }
  }

  // console.log('les num', numList);
  // console.log('les sym', symbolList);

  return { numList, symbolList };
}

function one(useRealPuzzle: boolean = true): String {
  const lines: String[] = useRealPuzzle
    ? realPuzzle.trim().split('\n')
    : examplePuzzle.trim().split('\n');

  let finalResult = '';

  const { numList, symbolList } = makeListFromPuzzle(lines);

  let validPoint: Point[] = [];
  symbolList.forEach((symbol) => {
    validPoint.push(...checkAround(symbol, numList));
  });

  finalResult += validPoint.reduce(
    (res, cur) => (res += Number.parseInt(cur.value.toString())),
    0
  );

  return `Day 03* ${
    useRealPuzzle ? 'realPuzzle' : 'examplePuzzle'
  }: ${finalResult}`;
}

function two(useRealPuzzle: boolean = true): String {
  const lines: String[] = useRealPuzzle
    ? realPuzzle.trim().split('\n')
    : examplePuzzle.trim().split('\n');

  let finalResult = '';

  const { numList, symbolList } = makeListFromPuzzle(lines);

  let validPointWithoutGear: Point[] = [];
  const withoutGear = symbolList
    .filter(
      (symbol) =>
        symbol.value !== '*' && checkAround(symbol, numList).length === 2
    )
    .reduce((res, cur) => {
      const aroundPoints = checkAround(cur, numList);
      res += aroundPoints.reduce(
        (res, cur) => (res += Number.parseInt(cur.value.toString())),
        0
      );
      return res;
    }, 0);

  const gearOnly = symbolList
    .filter(
      (symbol) =>
        symbol.value === '*' && checkAround(symbol, numList).length === 2
    )
    .reduce((res, cur) => {
      const aroundPoints = checkAround(cur, numList);

      res += aroundPoints.reduce(
        (res, cur) => (res *= Number.parseInt(cur.value.toString())),
        1
      );
      return res;
    }, 0);

  // console.log('la:', withoutGear); // goal 16345
  // console.log('la:', gearOnly); // goal 451490

  finalResult += withoutGear + gearOnly;

  // console.log('Goal (467835):', finalResult, '=', finalResult === '467835');

  return `Day 03** ${
    useRealPuzzle ? 'realPuzzle' : 'examplePuzzle'
  }: ${finalResult}`;
}

export default { one, two };
