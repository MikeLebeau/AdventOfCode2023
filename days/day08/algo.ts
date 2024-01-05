import { examplePuzzle, examplePuzzleTwo, realPuzzle } from './puzzle';

type MapPos = {
  name: string;
  left: string;
  right: string;
}

// https://www.geeksforgeeks.org/program-to-find-lcm-of-two-numbers/
// https://www.geeksforgeeks.org/program-to-find-gcd-or-hcf-of-two-numbers/
function lcm(nums: number[]): number {
  return nums.reduce((res, cur) => (res * cur) / gcd(res, cur), 1);
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

function one(useRealPuzzle: boolean = true): String {
  const lines: string[] = useRealPuzzle
    ? realPuzzle.trim().split('\n')
    : examplePuzzle.trim().split('\n');

  let finalResult = 0;

  const moveInstruction = lines[0];

  const maps: MapPos[] = [];
  for(let i = 2; i < lines.length; i++){
    const line = lines[i];
    const regex = new RegExp(/([A-Z]{3}) = \(([A-Z]{3}), ([A-Z]{3})\)/);

    const match = line.match(regex); 
    const name = match[1];
    const left = match[2];
    const right = match[3];

    maps.push({name, left, right});
  }

  let moveCount = 0;
  const startPosName = 'AAA';
  const targetPosName = 'ZZZ'; 
  let currentPos: MapPos = maps.find((map) => map.name === startPosName);

  while(currentPos.name !== targetPosName){
    const nextMove: string = moveInstruction[moveCount%moveInstruction.length];
    const nextPosName: string = (nextMove === 'L') ? currentPos.left : currentPos.right;
    
    currentPos = maps.find((map) => map.name === nextPosName);
    moveCount++;
  }

  finalResult = moveCount;

  return `Day 08* ${
    useRealPuzzle ? 'realPuzzle' : 'examplePuzzle'
  }: ${finalResult}`;
}

function two(useRealPuzzle: boolean = true): String {
  const lines: string[] = useRealPuzzle
    ? realPuzzle.trim().split('\n')
    : examplePuzzleTwo.trim().split('\n');

  let finalResult = 0;

  // GIVEN
  const moveInstruction = lines[0];

  const maps: MapPos[] = [];
  for(let i = 2; i < lines.length; i++){
    const line = lines[i];
    const regex = new RegExp(/([A-Z0-9]{3}) = \(([A-Z0-9]{3}), ([A-Z0-9]{3})\)/);

    const match = line.match(regex); 
    const name = match[1];
    const left = match[2];
    const right = match[3];

    maps.push({name, left, right});
  }
  
  const allMoveCount: number[] = [];
  
  // Need all starting poses
  const currentPoses: MapPos[] = maps.filter((map) => map.name.charAt(2) === 'A');
  // console.log('Il y a', currentPoses.length, 'pos avec un A', currentPoses);

  // WHEN
  currentPoses.forEach((pos) => {
    let moveCount = 0;
    
    while(pos.name.charAt(2) !== 'Z'){
      const nextMove: string = moveInstruction[moveCount%moveInstruction.length];
      const nextPosName: string = (nextMove === 'L') ? pos.left : pos.right;
      
      pos = maps.find((map) => map.name === nextPosName);
      moveCount++;
    }

    allMoveCount.push(moveCount);
  });

  // THEN
  finalResult = lcm(allMoveCount);

  return `Day 08** ${
    useRealPuzzle ? 'realPuzzle' : 'examplePuzzle'
  }: ${finalResult}`;
}

export default { one, two };
