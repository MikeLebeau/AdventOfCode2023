import { availableParallelism } from 'os';
import { examplePuzzle, examplePuzzleTwo, realPuzzle } from './puzzle';

// De quoi j'ai besoin ??

// Une map
// Des directions
// Des connecteurs
// Un ptit A* ?
// 

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
];

function getConnectorFromName(name: string): Connector {
  return Connectors.find((connector) => connector.name === name);
}

type MapTile = { connector: Connector, pos: { x: number, y: number } };
const map: MapTile[] = [];

function initializeMapAndGetStartingPos(lines: string[]) {
  let startingPos: MapTile;

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

  return startingPos;
}

function getNextTile(currentTile: MapTile, nextDirections: Direction[], alreadyVisited: MapTile[]): MapTile {
  alreadyVisited.push(currentTile);

  const nextPossibleTile: MapTile[] = [];

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

  return nextTile;
}

function one(useRealPuzzle: boolean = true): String {
  // GIVEN
  const lines: string[] = useRealPuzzle
    ? realPuzzle.trim().split('\n')
    : examplePuzzle.trim().split('\n');

  let finalResult = '';
  const startingPos = initializeMapAndGetStartingPos(lines);
  const alreadyVisited: MapTile[] = [];

  // console.log('startingPos:', JSON.stringify(startingPos));

  // Need to do it two times for the firstway to avoid both going on the same direction
  let firstWay = getNextTile(startingPos, startingPos.connector.allowedMove, alreadyVisited);
  firstWay = getNextTile(firstWay, firstWay.connector.allowedMove, alreadyVisited);

  let secondWay = getNextTile(startingPos, startingPos.connector.allowedMove, alreadyVisited);
  let count = 0;

  // WHEN
  while (firstWay.pos !== secondWay.pos) {
    firstWay = getNextTile(firstWay, firstWay.connector.allowedMove, alreadyVisited);
    secondWay = getNextTile(secondWay, secondWay.connector.allowedMove, alreadyVisited);
    count++;

    console.log(`count: ${count} \n| first: ${JSON.stringify(firstWay)} \n| second: ${JSON.stringify(secondWay)}`);
    console.log('---------------------------------------------');
  }

  // THEN
  return `Day 10* ${useRealPuzzle ? 'realPuzzle' : 'examplePuzzle'
    }: ${finalResult}`;
};

function two(useRealPuzzle: boolean = true): String {
  const lines: String[] = useRealPuzzle
    ? realPuzzle.trim().split('\n')
    : examplePuzzleTwo.trim().split('\n');

  let finalResult = '';

  return `Day 10** ${useRealPuzzle ? 'realPuzzle' : 'examplePuzzle'
    }: ${finalResult}`;
};

export default { one, two };