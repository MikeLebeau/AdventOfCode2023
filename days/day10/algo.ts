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

        if (getConnectorFromName(lines[i - 1][j])?.allowedMove.includes(Direction.South)) {
          startingPos.connector.allowedMove.push(Direction.North);
          console.log('le premier check:', getConnectorFromName(lines[i - 1][j])?.allowedMove.includes(Direction.South));
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

  const pipeList: MapTile[] = [startingPos];

  // WHEN
  while (currentPos !== getNextTile(currentPos, currentPos.connector.allowedMove, alreadyVisited, map)) {
    pipeList.push(currentPos);
    currentPos = getNextTile(currentPos, currentPos.connector.allowedMove, alreadyVisited, map);
  }

  // Il faut que je retire tout les . qui sont a l'exterieur
  // Genre tu prends le plus petit X des pipe et apres tu enleves tout ce qui a en dessous
  // Pareil pour les Y etc

  // Apres il faut retirer ceux qui restent

  // THEN
  return `Day 10** ${useRealPuzzle ? 'realPuzzle' : 'examplePuzzle'
    }: ${finalResult}`;
};

export default { one, two };