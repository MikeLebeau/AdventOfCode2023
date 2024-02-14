import { examplePuzzle, examplePuzzleTwo, realPuzzle } from './puzzle';

type UniversPoint = {
  name: string;
  row: number;
  col: number;
  verticalExpanded: boolean;
  horizontalExpanded: boolean;
}

function initializeTheUnivers(lines: string[]): UniversPoint[] {
  const univers: UniversPoint[] = [];

  for (let rowIndex = 0; rowIndex < lines.length; rowIndex++) {
    const row = lines[rowIndex];

    for (let columnIndex = 0; columnIndex < row.length; columnIndex++) {
      const column = row[columnIndex];

      univers.push({
        name: column,
        row: rowIndex,
        col: columnIndex,
        verticalExpanded: false,
        horizontalExpanded: false
      });
      // console.log(`row: ${rowIndex}; col: ${columnIndex}: ${map[rowIndex][columnIndex]}`);
    }
  }

  return univers;
}

function expandTheUnivers(univers: UniversPoint[]): UniversPoint[] {

  // expand rows
  const rowCount = univers.filter((point: UniversPoint) => point.row === 0).length;

  for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
    const row = univers.filter((point: UniversPoint) => point.row === rowIndex);

    if (row.filter((point: UniversPoint) => point.name === '#').length === 0) {
      univers.filter((point: UniversPoint) => point.row === rowIndex).map((point: UniversPoint) => point.horizontalExpanded = true);
    }
  }

  // expand cols
  const colCount = univers.filter((point: UniversPoint) => point.col === 0).length;

  for (let colIndex = 0; colIndex < colCount; colIndex++) {
    const col = univers.filter((point: UniversPoint) => point.col === colIndex);

    if (col.filter((point: UniversPoint) => point.name === '#').length === 0) {
      univers.filter((point: UniversPoint) => point.col === colIndex).map((point: UniversPoint) => point.verticalExpanded = true);
    }
  }

  return univers;
}

// Comment je vais calculer mon heuristique
function calculateHValue(row: number, col: number, dest: UniversPoint) {
  return (Math.sqrt((row - dest.row) * (row - dest.row) + (col - dest.col) * (col - dest.col)));
}

type AStarCell = {
  f: number;
  g: number;
  h: number;

  parentRow: number;
  parentCol: number;
}

type OpenList = {
  f: number,
  row: number,
  col: number
}

enum Direction {
  NORTH,
  SOUTH,
  EAST,
  WEST
}

function getSuccessor(
  direction: Direction,
  source: OpenList,
  destination: UniversPoint,
  rowCount: number,
  colCount: number,
  cells: AStarCell[][],
  closedList: boolean[][],
  openList: OpenList[]
) {
  let nextRow = source.row;
  let nextCol = source.col;

  switch (direction) {
    case Direction.NORTH:
      nextRow--;
      break;
    case Direction.SOUTH:
      nextRow++;
      break;
    case Direction.EAST:
      nextCol++;
      break;
    case Direction.WEST:
      nextCol--;
      break;
    default:
      console.log('Cette direction est inconnue');
      break;
  }

  let newG: number;
  let newH: number;
  let newF: number;

  if ((nextRow >= 0) && (nextRow < rowCount) && (nextCol >= 0) && (nextCol < colCount)) {

    if (nextRow === destination.row && nextCol === destination.col) {
      cells[nextRow][nextCol].parentRow = source.row;
      cells[nextRow][nextCol].parentCol = source.col;
      console.log('FOUNDED');
      return true;
    } else if (closedList[nextRow][nextCol] === false) {
      newG = cells[source.row][source.col].g++;
      newH = calculateHValue(nextRow, nextCol, destination);
      newF = newG + newH;

      if (cells[nextRow][nextCol].f === Number.MAX_VALUE || cells[nextRow][nextCol].f > newF) {
        openList.push({ f: newF, row: nextRow, col: nextCol });

        cells[nextRow][nextCol].f = newF;
        cells[nextRow][nextCol].g = newG;
        cells[nextRow][nextCol].h = newH;
        cells[nextRow][nextCol].parentRow = source.row;
        cells[nextRow][nextCol].parentCol = source.col;
      }
    }
  }

  return false;
}

function aStarSearch(univers: UniversPoint[], source: UniversPoint, destination: UniversPoint): boolean {
  const rowCount = univers.filter((point: UniversPoint) => point.row === 0).length;
  const colCount = univers.filter((point: UniversPoint) => point.col === 0).length;

  // Flemme de faire les checks genre est-ce que la source est bien dans l'univers
  // est-ce que la destination est dans l'univers etc

  const closedList: boolean[][] = [...new Array(rowCount)].map((u) => u = (new Array(colCount)).map((u) => u = undefined));

  const defaultCell: AStarCell = {
    f: Number.MAX_VALUE,
    g: Number.MAX_VALUE,
    h: Number.MAX_VALUE,
    parentRow: -1,
    parentCol: -1
  };
  const cells: AStarCell[][] = [...new Array(rowCount)].map((u) => u = (new Array(colCount)).map((u) => u = defaultCell));

  // Starting point
  cells[source.row][source.col] = {
    f: 0,
    g: 0,
    h: 0,
    parentRow: source.row,
    parentCol: source.col
  }

  const openList: OpenList[] = [{ f: 0, row: source.row, col: source.col }];

  let foundDest = false;

  let i = 0;
  while (openList.length > 0) {
    let olSource = openList[i];

    openList.splice(i, 1);

    closedList[olSource.row][olSource.col] = true;

    // La faut calculer les successeurs 
    // (normalement les 8 pour toute les directions, mais la dans l'exo c'est north, south, east, west)

    // North
    getSuccessor(
      Direction.NORTH,
      olSource,
      destination,
      rowCount,
      colCount,
      cells,
      closedList,
      openList
    );

    // South
    getSuccessor(
      Direction.SOUTH,
      olSource,
      destination,
      rowCount,
      colCount,
      cells,
      closedList,
      openList
    );

    // East
    getSuccessor(
      Direction.EAST,
      olSource,
      destination,
      rowCount,
      colCount,
      cells,
      closedList,
      openList
    );

    // West
    getSuccessor(
      Direction.WEST,
      olSource,
      destination,
      rowCount,
      colCount,
      cells,
      closedList,
      openList
    );

  }

  // return true quand on aura atteint la destination
  return foundDest;
}

function one(useRealPuzzle: boolean = true): string {
  const lines: string[] = useRealPuzzle
    ? realPuzzle.trim().split('\n')
    : examplePuzzle.trim().split('\n');

  let finalResult = '';

  let univers = initializeTheUnivers(lines);
  univers = expandTheUnivers(univers);

  const allGalaxies: UniversPoint[] = univers.filter((point: UniversPoint) => point.name === '#');

  for (let i = 0; i < allGalaxies.length; i++) {
    const currentGalaxy: UniversPoint = allGalaxies[i];
    const otherGalaxies: UniversPoint[] = allGalaxies.filter((point: UniversPoint) => point.row !== currentGalaxy.row && point.col !== currentGalaxy.col);

    for (let j = 0; j < otherGalaxies.length; j++) {
      const founded = aStarSearch(univers, currentGalaxy, otherGalaxies[j]);
      // console.log(`Pour (${currentGalaxy.row};${currentGalaxy.col}) vers (${otherGalaxies[j].row};${otherGalaxies[j].col}): ${founded}`);
    }
  }

  return `Day 11* ${useRealPuzzle ? 'realPuzzle' : 'examplePuzzle'
    }: ${finalResult}`;
}

function two(useRealPuzzle: boolean = true): string {
  const lines: string[] = useRealPuzzle
    ? realPuzzle.trim().split('\n')
    : examplePuzzleTwo.trim().split('\n');

  let finalResult = '';

  return `Day 11** ${useRealPuzzle ? 'realPuzzle' : 'examplePuzzle'
    }: ${finalResult}`;
}

export default { one, two };
