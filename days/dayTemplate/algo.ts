import { examplePuzzle, examplePuzzleTwo, realPuzzle } from './puzzle';

function one(useRealPuzzle: boolean = true): String {
  const lines: String[] = useRealPuzzle
    ? realPuzzle.trim().split('\n')
    : examplePuzzle.trim().split('\n');

  let finalResult = '';

  return `Day 0X* ${
    useRealPuzzle ? 'realPuzzle' : 'examplePuzzle'
  }: ${finalResult}`;
}

function two(useRealPuzzle: boolean = true): String {
  const lines: String[] = useRealPuzzle
    ? realPuzzle.trim().split('\n')
    : examplePuzzleTwo.trim().split('\n');

  let finalResult = '';

  return `Day 0X** ${
    useRealPuzzle ? 'realPuzzle' : 'examplePuzzle'
  }: ${finalResult}`;
}

export default { one, two };
