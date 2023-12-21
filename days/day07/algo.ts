import { examplePuzzle, examplePuzzleTwo, realPuzzle } from './puzzle';

const Card = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'] as const;

function one(useRealPuzzle: boolean = true): String {
  const lines: String[] = useRealPuzzle
    ? realPuzzle.trim().split('\n')
    : examplePuzzle.trim().split('\n');

  let finalResult = '';

  console.log('TEST:', Card['2'] < Card['4']);

  // example result: 6440
  return `Day 07* ${
    useRealPuzzle ? 'realPuzzle' : 'examplePuzzle'
  }: ${finalResult}`;
}

function two(useRealPuzzle: boolean = true): String {
  const lines: String[] = useRealPuzzle
    ? realPuzzle.trim().split('\n')
    : examplePuzzleTwo.trim().split('\n');

  let finalResult = '';

  return `Day 07** ${
    useRealPuzzle ? 'realPuzzle' : 'examplePuzzle'
  }: ${finalResult}`;
}

export default { one, two };
