import { examplePuzzle, examplePuzzleTwo, realPuzzle, realPuzzleTwo } from './puzzle';

class Run {
  time: number;
  distanceRecord: number;

  constructor(time: number, distanceMax: number) {
    this.time = time;
    this.distanceRecord = distanceMax;
  }
}

function one(useRealPuzzle: boolean = true): String {
  const lines: String[] = useRealPuzzle
    ? realPuzzle.trim().split('\n')
    : examplePuzzle.trim().split('\n');

  const times = lines[0].split(/\s+/).slice(1);
  const distances = lines[1].split(/\s+/).slice(1);

  let runs: Run[] = [];

  for(let i = 0; i < times.length; i++) {
    runs.push(new Run(Number(times[i]), Number(distances[i])));
  }

  const betterRunCount = [];

  runs.forEach((run) => {
    let betterWayCount = 0;

    for(let power = 0; power < run.time; power++){
      const timeLeft = run.time-power;
      if(power*timeLeft > run.distanceRecord) {
        betterWayCount++;
      }
    }

    betterRunCount.push(betterWayCount);
  })

  return `Day 06* ${
    useRealPuzzle ? 'realPuzzle' : 'examplePuzzle'
  }: ${betterRunCount.reduce((res, cur) => res = res*cur, 1)}`;
}

function two(useRealPuzzle: boolean = true): String {
  const lines: String[] = useRealPuzzle
    ? realPuzzleTwo.trim().split('\n')
    : examplePuzzleTwo.trim().split('\n');

  const time = lines[0].split(/\s+/).slice(1);
  const distance = lines[1].split(/\s+/).slice(1);
  
  let runs: Run[] = [];

  runs.push(new Run(Number(time), Number(distance)));

  let min;
  let max;

  // min
  for(let power = 0; power < runs[0].time; power++){
    const timeLeft = runs[0].time-power;
    if(power*timeLeft > runs[0].distanceRecord) {
      min = power;
      break;
    }
  }

  // max
  for(let power = runs[0].time; power > 0; power--){
    const timeLeft = runs[0].time-power;
    if(power*timeLeft > runs[0].distanceRecord) {
      max = power;
      break;
    }
  }

  return `Day 06** ${
    useRealPuzzle ? 'realPuzzle' : 'examplePuzzle'
  }: ${(max - min) + 1}`;
}

export default { one, two };
