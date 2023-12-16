import { examplePuzzle, realPuzzle } from './puzzle';

class Game {
  id: number;
  red: number;
  green: number;
  blue: number;

  constructor(
    id: number = 0,
    red: number = 0,
    green: number = 0,
    blue: number = 0
  ) {
    this.id = id;
    this.red = red;
    this.green = green;
    this.blue = blue;
  }

  isPossible(target: Game) {
    if (
      this.red <= target.red &&
      this.green <= target.green &&
      this.blue <= target.blue
    ) {
      return true;
    }

    return false;
  }
}

function getAllGames(lines: String[]): Game[] {
  const allGames: Game[] = [];

  lines.forEach((line) => {
    const infoSplitted = line.split(':');
    const id = Number.parseInt(infoSplitted[0].split(/\s+/)[1]);
    const sets = infoSplitted[1].split(';');

    let newGame = new Game(id);

    sets.forEach((set) => {
      const cubes = set.split(',');
      cubes.forEach((cube) => {
        const color = cube.trim().split(/\s+/)[1];
        const count = cube.trim().split(/\s+/)[0];

        if (newGame[color] < Number.parseInt(count)) {
          newGame[color] = Number.parseInt(count);
        }
      });
    });

    allGames.push(newGame);
  });

  return allGames;
}

function one(useRealPuzzle: boolean = true): String {
  const lines: String[] = useRealPuzzle
    ? realPuzzle.trim().split('\n')
    : examplePuzzle.trim().split('\n');

  const target = new Game(0, 12, 13, 14);
  const allGames: Game[] = getAllGames(lines);
  let finalResult = 0;

  // Use all game to get the result
  allGames.forEach((game: Game) => {
    if (game.isPossible(target)) {
      finalResult += game.id;
    }
  });

  return `Day 02* ${
    useRealPuzzle ? 'realPuzzle' : 'examplePuzzle'
  }: ${finalResult}`;
}

function two(useRealPuzzle: boolean = true): String {
  const lines: String[] = useRealPuzzle
    ? realPuzzle.trim().split('\n')
    : examplePuzzle.trim().split('\n');

  const allGames: Game[] = getAllGames(lines);
  let finalResult = 0;

  // Use all game to get the result
  allGames.forEach((game: Game) => {
    finalResult += game.red * game.green * game.blue;
  });

  return `Day 02** ${
    useRealPuzzle ? 'realPuzzle' : 'examplePuzzle'
  }: ${finalResult}`;
}

export default { one, two };
