import { testPuzzle, examplePuzzle, examplePuzzleTwo, realPuzzle } from './puzzle';

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
    }
  }

  return univers;
}

function expandTheUnivers(univers: UniversPoint[]): UniversPoint[] {
  // expand rows
  const rowCount = univers.filter((point: UniversPoint) => point.col === 0).length;

  for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
    const row = univers.filter((point: UniversPoint) => point.row === rowIndex);

    if (row.filter((point: UniversPoint) => point.name === '#').length === 0) {
      univers.filter((point: UniversPoint) => point.row === rowIndex).map((point: UniversPoint) => point.horizontalExpanded = true);
    }
  }

  // expand cols
  const colCount = univers.filter((point: UniversPoint) => point.row === 0).length;

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

  // Manhattan Distance: Good quand tu peux te deplacer uniquement dans 4 directions
  return Math.abs(row - dest.row) + Math.abs(col - dest.col);

  // Euclidean Distance: Good quand tu peux te deplacer dans toute les directions
  //return (Math.sqrt((row - dest.row) * (row - dest.row) + (col - dest.col) * (col - dest.col)));
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
  g: number,
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
  univers: UniversPoint[],
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

  if ((nextRow >= 0) && (nextRow < rowCount) && (nextCol >= 0) && (nextCol < colCount)) {

    // ICI LA, Ici c'est quand j'ai trouvé
    if (nextRow === destination.row && nextCol === destination.col) {
      cells[nextRow][nextCol].parentRow = source.row;
      cells[nextRow][nextCol].parentCol = source.col;
      cells[nextRow][nextCol].g = source.g + 1;
      
      return { isFounded: true, cells };
    } else if (closedList[nextRow][nextCol] === false) {

      // Il faut que je check si je dois faire un +2 ou un +1
      // Je check ca comment? Je dois regarder si je suis en train de faire un mouvement vertical ou horizontal 
      // Mais avant je dois retourner le nombre de deplacement 

      let newG: number = cells[source.row][source.col].g;
      const cellPoint = univers.find((point) => point.row === source.row && point.col === source.col);

      if (cellPoint.horizontalExpanded) {
        if (direction === Direction.NORTH || direction === Direction.SOUTH) {
          newG += 2;
        }
      }
      
      if (cellPoint.verticalExpanded) {
        if (direction === Direction.EAST || direction === Direction.WEST) {
          newG += 2;
        }
      }

      if(!(cellPoint.horizontalExpanded && cellPoint.verticalExpanded)){
        newG += 1;
      }

      const newH: number = calculateHValue(nextRow, nextCol, destination);
      const newF: number = newG + newH;

      // console.log(`Les cells:\n\t${JSON.stringify(cells)}`);
      // console.log('------------------------');
      // console.log(`Source: (${source.row};${source.col})`);
      // console.log(`Next: (${nextRow};${nextCol})`);
      // console.log(`Le F: ${cells[nextRow][nextCol].f}, le newF: ${newF}`);
      // console.log(`Les new: \n\tNewG: ${newG}\n\tNewH: ${newH}\n\tNewF: ${newF}`);
      // console.log(`Le newG: ${newG}; old: ${cells[source.row][source.col].g}`);

      if (cells[nextRow][nextCol].f === Number.MAX_VALUE || cells[nextRow][nextCol].f > newF) {
        openList.push({ f: newF, g: newG, row: nextRow, col: nextCol });

        cells[nextRow][nextCol].f = newF;
        cells[nextRow][nextCol].g = newG;
        cells[nextRow][nextCol].h = newH;
        cells[nextRow][nextCol].parentRow = source.row;
        cells[nextRow][nextCol].parentCol = source.col;
      }
    }
  }

  // Il faut que je regarde si les successor sont ok ou pas et voir pourquoi je n'atteint jamais la destination
  return { isFounded: false };
}

function printAStarPath(univers: UniversPoint[], source: UniversPoint, destination: UniversPoint, closedList: boolean[][], openList: OpenList[], cells: AStarCell[][]) {
  console.log('------------- Print AStar Path -------------');
  const rowCount = univers.filter((point) => point.col === 0).length;
  const colCount = univers.filter((point) => point.row === 0).length;

  const universText: string[] = [];

  let galaxyCounter = 1;

  for (let i = 0; i < rowCount; i++) {
    let row = '';
    for (let j = 0; j < colCount; j++) {
      const point = univers.find((point) => point.col === j && point.row === i);

      if (closedList[i][j] === true) {
        if(point.row === source.row && point.col === source.col){
          row += 'S';
          galaxyCounter++;
        }else if(point.row === destination.row && point.col === destination.col){
          row += 'D';
          galaxyCounter++;
        }else{
          if(point.name === '#'){
            row += galaxyCounter;
            galaxyCounter++;
          }else if(point.horizontalExpanded || point.verticalExpanded){
            row += 'X';
          } else {
            row += 'x';
          }
        }
      } else if (openList.find((open) => open.row === i && open.col === j)) {
        row += 'O';
      } else {  
        if(point.name === '#'){
          row += galaxyCounter;
          galaxyCounter++;
        } else {
          row += point.name;
        }
      }
    }
    universText.push(row);
    // console.log('ROW:' + row);
  }

  let current = cells[destination.row][destination.col];

  while (current.f != 0) {
    let tmp1: string[] = universText[current.parentRow].split('');
    tmp1[current.parentCol] = `${tmp1[current.parentCol]}`;
    // tmp1.splice(current.parentCol, 1, `\u001b[1;32m${universText[current.parentRow].charAt(current.parentCol)}\u001b[0m`);

    universText[current.parentRow] = tmp1.join('');
    current = cells[current.parentRow][current.parentCol];
  }

  let tmp2: any = universText[destination.row].split('');
  tmp2.splice(destination.col, 1, '\u001b[1;32mD\u001b[0m');
  tmp2 = tmp2.join('');
  universText[destination.row] = tmp2;

  universText.forEach((row) => console.log(row));

  console.log('-----');

  const thePath: AStarCell[] = [cells[destination.row][destination.col]];
  current = cells[destination.row][destination.col];

  const SHIT = [destination];

  console.log(`Destination: (${destination.row};${destination.col})`);
  while (current.f != 0) {
    console.log(`-> (${current.parentRow};${current.parentCol}), ${current.g}`);
    // console.log(`--> (${})`);

    SHIT.push(univers.find((point) => point.row === current.parentRow && point.col === current.parentCol));

    current = cells[current.parentRow][current.parentCol];
    thePath.push(current);
  }
  console.log(`Source: (${source.row};${source.col})`);

  // console.log(SHIT);
  // console.log(SHIT.length);
  console.log('------------------------------------------------------------------');
}

function aStarSearch(univers: UniversPoint[], source: UniversPoint, destination: UniversPoint): AStarCell[] {
  const rowCount = univers.filter((point: UniversPoint) => point.col === 0).length;
  const colCount = univers.filter((point: UniversPoint) => point.row === 0).length;

  const openList: OpenList[] = [{ f: 0, g: 0, row: source.row, col: source.col }];
  const closedList: boolean[][] = [...new Array(rowCount)].map((row) => row = ([...new Array(colCount)]).map((col) => col = false));

  const cells: AStarCell[][] = [];
  for (let i = 0; i < rowCount; i++) {
    cells.push([]);
    for (let j = 0; j < colCount; j++) {
      cells[i].push({
        f: Number.MAX_VALUE,
        g: Number.MAX_VALUE,
        h: Number.MAX_VALUE,
        parentRow: -1,
        parentCol: -1
      });
    }
  }

  const thePath: AStarCell[] = [cells[destination.row][destination.col]];

  // Starting point
  cells[source.row][source.col] = {
    f: 0,
    g: 0,
    h: 0,
    parentRow: source.row,
    parentCol: source.col
  };

  let foundDest = false;

  let i = 0;
  while (openList.length > 0) {
    const olSource = openList.sort((a, b) => a.f - b.f)[0]; // Je prend celui qui a le plus petit f
    openList.splice(0, 1);

    closedList[olSource.row][olSource.col] = true;

    // La faut calculer les successeurs 
    // (normalement les 8 pour toute les directions, mais la dans l'exo c'est north, south, east, west)

    // North
    const north = getSuccessor(
      univers,
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
    const south = getSuccessor(
      univers,
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
    const east = getSuccessor(
      univers,
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
    const west = getSuccessor(
      univers,
      Direction.WEST,
      olSource,
      destination,
      rowCount,
      colCount,
      cells,
      closedList,
      openList
    );

    const path = [north, south, east, west].find((direction) => direction.isFounded);
    if (path) {
      printAStarPath(univers, source, destination, closedList, openList, cells);

      let current = cells[destination.row][destination.col];
      
      while (current.f != 0) {
        current = cells[current.parentRow][current.parentCol];
        thePath.push(current);
      }
      break;
    }
  }

  console.log(univers.find((point) => point.row === 3 && point.col === 5));

  return thePath;
}

function printTheUnivers(univers: UniversPoint[]) {
  console.log('------------- Print the univers -------------');
  const rowCount = univers.filter((point) => point.col === 0).length;
  const colCount = univers.filter((point) => point.row === 0).length;

  for (let i = 0; i < rowCount; i++) {
    let row = '';
    for (let j = 0; j < colCount; j++) {
      const point = univers.find((point) => point.col === j && point.row === i);

      if (point.horizontalExpanded) {
        row += '=';
      } else if (point.verticalExpanded) {
        row += '||';
      } else {
        row += point.name;
      }
    }

    console.log(row);
  }

  console.log('------------------------------------------------------------------');
  console.log('------------------------------------------------------------------');
}

function one(useRealPuzzle: boolean = true): string {
  const lines: string[] = useRealPuzzle
    ? realPuzzle.trim().split('\n')
    : examplePuzzle.trim().split('\n');

  let finalResult = '';

  let univers = initializeTheUnivers(lines);
  expandTheUnivers(univers);

  printTheUnivers(univers);

  const allGalaxies: UniversPoint[] = univers.filter((point: UniversPoint) => point.name === '#');

  const pathFrom5To9 = aStarSearch(univers, allGalaxies[4], allGalaxies[8]);
  console.log(`Le path de 5 vers 9 doit faire 9: ${pathFrom5To9[0].g+1}`); // GOOD

  // const pathFrom1To7 = aStarSearch(univers, allGalaxies[0], allGalaxies[6]);
  // console.log(`Le path de 1 vers 7 doit faire 15: ${pathFrom1To7[0].g+1}`);

  // const pathFrom3To6 = aStarSearch(univers, allGalaxies[2], allGalaxies[5]);
  // console.log(`Le path de 3 vers 6 doit faire 17: ${pathFrom3To6.length+1}`);

  // const pathFrom8To9 = aStarSearch(univers, allGalaxies[7], allGalaxies[8]);
  // console.log(`Le path de 8 vers 9 doit faire 5: ${pathFrom8To9.length+1}`);

  // for (let i = 0; i < allGalaxies.length; i++) {
  //   const currentGalaxy: UniversPoint = allGalaxies[i];
  //   const otherGalaxies: UniversPoint[] = allGalaxies.filter((point: UniversPoint) => point.row !== currentGalaxy.row && point.col !== currentGalaxy.col);

  //   for (let j = 0; j < otherGalaxies.length; j++) {
  //     const founded = aStarSearch(univers, currentGalaxy, otherGalaxies[j]);
  //     console.log(`Pour (${currentGalaxy.row};${currentGalaxy.col}) vers (${otherGalaxies[j].row};${otherGalaxies[j].col}): ${founded}`);
  //   }
  // }

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
