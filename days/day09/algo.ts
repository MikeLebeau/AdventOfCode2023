import { examplePuzzle, examplePuzzleTwo, realPuzzle } from './puzzle';

function initOne(lines: string[]): number[][] {
  const history: number[][] = [];

  lines.forEach((line) => {
    history.push(line.split(/\s+/).map(Number));
  });

  return history;
}

function getSubSequence(sequence: number[]): number[] {
  return sequence
    .slice(0, sequence.length - 1)
    .reduce((res: number[], cur: number, index: number) => {
      res.push(sequence[index + 1] - cur);
      return res;
    }, []);
}

function one(useRealPuzzle: boolean = true): String {
  // GIVEN
  const lines: string[] = useRealPuzzle
    ? realPuzzle.trim().split('\n')
    : examplePuzzle.trim().split('\n');

  let finalResult = 0;

  const history: number[][] = initOne(lines);

  // WHEN
  for (let i = 0; i < history.length; i++) {
    const subSequences: number[][] = [history[i]];
    let sequence: number[] = history[i];

    do {
      sequence = getSubSequence(sequence);
      subSequences.push(sequence);
    } while (sequence.some((val) => val !== 0));

    // console.log(subSequences);

    const predictions = subSequences
      .reverse()
      .reduce((res, cur, index) => {
        if (index === 0) {
          res.push(cur[cur.length - 1]);
        } else {
          res.push(res[res.length - 1] + cur[cur.length - 1]);
        }
        return res;
      }, []);

    // console.log(predictions);

    finalResult += predictions[predictions.length - 1];
  }

  // console.log('---------------------------------');

  // THEN
  return `Day 09* ${useRealPuzzle ? 'realPuzzle' : 'examplePuzzle'
    }: ${finalResult}`;
}

function two(useRealPuzzle: boolean = true): String {
  // GIVEN
  const lines: string[] = useRealPuzzle
    ? realPuzzle.trim().split('\n')
    : examplePuzzleTwo.trim().split('\n');

  let finalResult = 0;

  const history: number[][] = initOne(lines);

  // WHEN
  for (let i = 0; i < history.length; i++) {
    const subSequences: number[][] = [history[i]];
    let sequence: number[] = history[i];

    do {
      sequence = getSubSequence(sequence);
      subSequences.push(sequence);
    } while (sequence.some((val) => val !== 0));

    // console.log(subSequences);

    const backwardPredictions = subSequences
      .reverse()
      .reduce((res, cur, index) => {
        cur = cur.reverse();

        if (index === 0) {
          res.push(cur[cur.length - 1]);
        } else {
          res.push(cur[cur.length - 1] - res[res.length - 1]);
        }
        return res;
      }, []);

    // console.log(backwardPredictions);

    finalResult += backwardPredictions[backwardPredictions.length - 1];
  }

  // console.log('---------------------------------');

  // THEN
  return `Day 09** ${useRealPuzzle ? 'realPuzzle' : 'examplePuzzle'
    }: ${finalResult}`;
}

export default { one, two };
