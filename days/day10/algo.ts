import { examplePuzzle, examplePuzzleTwo, realPuzzle } from './puzzle';

enum Direction {
  North,
  South,
  East,
  West
};

type Connector = {
  name: string,
  allowedMove: Direction[],
};

const Connectors: Connector[] = [
  { name: '|', allowedMove: [Direction.North, Direction.South] },
  { name: '-', allowedMove: [Direction.East, Direction.West] },
  { name: 'L', allowedMove: [Direction.North, Direction.East] },
  { name: 'J', allowedMove: [Direction.North, Direction.West] },
  { name: '7', allowedMove: [Direction.South, Direction.West] },
  { name: 'F', allowedMove: [Direction.South, Direction.East] },
  { name: 'S', allowedMove: [] },
  { name: '.', allowedMove: [] }
];

function getConnectorFromName(name: string): Connector {
  return Connectors.find((connector) => connector.name === name);
}

type MapTile = { connector: Connector, pos: { x: number, y: number } };

function initializeMapAndGetStartingPos(lines: string[]) {
  let startingPos: MapTile;
  const map: MapTile[] = [];

  for (let i = 0; i < lines.length; i++) {
    const curLine = lines[i];
    for (let j = 0; j < curLine.length; j++) {

      if (curLine[j] !== '.') {
        const curTile: MapTile = {
          connector: getConnectorFromName(curLine[j]),
          pos: { x: i, y: j }
        };

        if (curLine[j] === 'S') {
          startingPos = curTile;

          if (getConnectorFromName(lines[i - 1][j])?.allowedMove.includes(Direction.South)) {
            startingPos.connector.allowedMove.push(Direction.North);
          }
          if (getConnectorFromName(lines[i + 1][j])?.allowedMove.includes(Direction.North)) {
            startingPos.connector.allowedMove.push(Direction.South);
          }
          if (getConnectorFromName(lines[i][j - 1])?.allowedMove.includes(Direction.East)) {
            startingPos.connector.allowedMove.push(Direction.West);
          }
          if (getConnectorFromName(lines[i][j + 1])?.allowedMove.includes(Direction.West)) {
            startingPos.connector.allowedMove.push(Direction.East);
          }
        }

        map.push(curTile);
      }
    }
  }

  return { map, startingPos };
}

function initializeMapAndGetStartingPosSecondStar(lines: string[]) {
  let startingPos: MapTile;
  const map: MapTile[] = [];

  for (let i = 0; i < lines.length; i++) {
    const curLine = lines[i];
    for (let j = 0; j < curLine.length; j++) {

      const curTile: MapTile = {
        connector: getConnectorFromName(curLine[j]),
        pos: { x: i, y: j }
      };

      // if (curLine[j] !== '.') {}
      if (curLine[j] === 'S') {
        startingPos = curTile;

        if ((i-1 >= 0) && getConnectorFromName(lines[i - 1][j])?.allowedMove.includes(Direction.South)) {
          startingPos.connector.allowedMove.push(Direction.North);
          console.log('le premier check:', getConnectorFromName(lines[i - 1][j])?.allowedMove.includes(Direction.South));
        }
        if ((i+1 <= lines.length) && getConnectorFromName(lines[i + 1][j])?.allowedMove.includes(Direction.North)) {
          startingPos.connector.allowedMove.push(Direction.South);
        }
        if ((j-1 >= 0) && getConnectorFromName(lines[i][j - 1])?.allowedMove.includes(Direction.East)) {
          startingPos.connector.allowedMove.push(Direction.West);
        }
        if ((j+1 <= curLine.length) && getConnectorFromName(lines[i][j + 1])?.allowedMove.includes(Direction.West)) {
          startingPos.connector.allowedMove.push(Direction.East);
        }
      }

      map.push(curTile);
    }
  }

  return { map, startingPos };
}

function getNextTile(currentTile: MapTile, nextDirections: Direction[], alreadyVisited: MapTile[], map: MapTile[]): MapTile {

  const nextPossibleTile: MapTile[] = [];
  alreadyVisited.push(currentTile);

  nextDirections.forEach((nextDirection) => {
    switch (nextDirection) {
      case Direction.North:
        nextPossibleTile.push(map.find((tile) => tile.pos.x === currentTile.pos.x - 1 && tile.pos.y === currentTile.pos.y));
        break;
      case Direction.South:
        nextPossibleTile.push(map.find((tile) => tile.pos.x === currentTile.pos.x + 1 && tile.pos.y === currentTile.pos.y));
        break;
      case Direction.East:
        nextPossibleTile.push(map.find((tile) => tile.pos.x === currentTile.pos.x && tile.pos.y === currentTile.pos.y + 1));
        break;
      case Direction.West:
        nextPossibleTile.push(map.find((tile) => tile.pos.x === currentTile.pos.x && tile.pos.y === currentTile.pos.y - 1));
        break;
      default:
        console.log("Je n'ai pas de next move!!!");
        break;
    }
  });

  const nextTile: MapTile = nextPossibleTile.find((tile) => !alreadyVisited.includes(tile));
  // alreadyVisited.push(nextTile);
  // console.log('nextTile:', nextTile);
  // console.log('-------------------------------------------------------------------');

  return nextTile ?? currentTile;
}

function one(useRealPuzzle: boolean = true): String {
  // GIVEN
  const lines: string[] = useRealPuzzle
    ? realPuzzle.trim().split('\n')
    : examplePuzzle.trim().split('\n');

  let finalResult = 0;
  const { map, startingPos } = initializeMapAndGetStartingPos(lines);
  const alreadyVisited: MapTile[] = [startingPos];

  // console.log('startingPos:', JSON.stringify(startingPos));

  // Need to do it two times for the firstway to avoid both going on the same direction
  let firstWay = getNextTile(startingPos, startingPos.connector.allowedMove, alreadyVisited, map);
  firstWay = getNextTile(firstWay, firstWay.connector.allowedMove, alreadyVisited, map);

  let secondWay = getNextTile(startingPos, startingPos.connector.allowedMove, alreadyVisited, map);
  let count = 1;

  // WHEN
  while (firstWay.pos !== secondWay.pos) {
    firstWay = getNextTile(firstWay, firstWay.connector.allowedMove, alreadyVisited, map);
    secondWay = getNextTile(secondWay, secondWay.connector.allowedMove, alreadyVisited, map);
    count++;

    // console.log(`count: ${count} \n| first: ${JSON.stringify(firstWay)} \n| second: ${JSON.stringify(secondWay)}`);
    // console.log('---------------------------------------------');
  }

  finalResult = count;

  // THEN
  return `Day 10* ${useRealPuzzle ? 'realPuzzle' : 'examplePuzzle'
    }: ${finalResult}`;
};

function two(useRealPuzzle: boolean = true): String {
  // GIVEN
  const lines: string[] = useRealPuzzle
    ? realPuzzle.trim().split('\n')
    : examplePuzzleTwo.trim().split('\n');

  let finalResult = 0;
  const { map, startingPos } = initializeMapAndGetStartingPosSecondStar(lines);
  const alreadyVisited: MapTile[] = [startingPos];
  let currentPos: MapTile = getNextTile(startingPos, startingPos.connector.allowedMove, alreadyVisited, map);

  const pipeList: MapTile[] = [{
    ...startingPos, 
    connector: {
      ...startingPos.connector, 
      name: Connectors.find((connector) => JSON.stringify(connector.allowedMove) === JSON.stringify(startingPos.connector.allowedMove)).name
    }
  }];

  let myResponse = '';

  // WHEN
  while (currentPos !== getNextTile(currentPos, currentPos.connector.allowedMove, alreadyVisited, map)) {
    pipeList.push(currentPos);
    currentPos = getNextTile(currentPos, currentPos.connector.allowedMove, alreadyVisited, map);
  }
  pipeList.push(currentPos); // To get the last pos too

  let linesTest: string[] = lines;
  let totalHitCount = 0;
  for(let row = 0; row < linesTest.length; row++){
    let lineText = '';

    const allPipeOnMyRow = pipeList.filter((pipe) => pipe.pos.x === row);
    
    for(let col = 0; col < linesTest[row].length; col++){
      const allPipeOnMyCol = pipeList.filter((pipe) => pipe.pos.y === col);
      const tile = linesTest[row][col];
      let hitCount = 0;
      let allWall;

      if(pipeList.find((pipe) => pipe.pos.x === row && pipe.pos.y === col)){
        lineText += `\u001b[1;45m${pipeList.find((pipe) => pipe.pos.x === row && pipe.pos.y === col).connector.name}\u001b[0m`;
        continue;
      }

      if(allPipeOnMyRow.some((pipe) => pipe.pos.y < col) && allPipeOnMyRow.some((pipe) => pipe.pos.y > col) && 
      allPipeOnMyCol.some((pipe) => pipe.pos.x < row) && allPipeOnMyCol.some((pipe) => pipe.pos.x > row)){
        
        allWall = allPipeOnMyRow
          .filter((pipe) => col < pipe.pos.y)
          .sort((a, b) => a.pos.y - b.pos.y)
          .reduce((res, cur) => {

            switch (cur.connector.name) {
              case '|':
                res.wallCount++;
                break;
              case 'F':
                res.wall['F'] ? res.wall['F']++ : res.wall['F'] = 1;
                res.lastOne = 'F';
                break;
              case 'L':
                res.wall['L'] ? res.wall['L']++ : res.wall['L'] = 1;
                res.lastOne = 'L';
                break;
              case 'J':
                if(res.wall['F'] && res.lastOne === 'F'){
                  res.wall['F']--
                  res.wallCount++;
                } else {
                  res.wall['J'] = 1
                }
                break;
              case '7':
                if(res.wall['L'] && res.lastOne === 'L'){
                  res.wall['L']--
                  res.wallCount++;
                } else {
                  res.wall['7'] = 1
                }
                break;
              default:
                break;
            }

            return res;
          }, { lastOne: '', wallCount: 0, wall: {} });

          hitCount = allWall.wallCount;
      }

      if(hitCount%2 !== 0){
        totalHitCount++;
        lineText += '\u001b[1;42mI\u001b[0m';
      } else {
        if(linesTest[row][col] === '.'){
          lineText += '\u001b[1;41mO\u001b[0m';
        }
      }
    }
    // console.log(row, lineText);
    myResponse = lineText;
  }

  finalResult = totalHitCount;

  // THEN
  return `Day 10** ${useRealPuzzle ? 'realPuzzle' : 'examplePuzzle'
    }: ${finalResult}`;
};

export default { one, two };