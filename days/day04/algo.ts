import { examplePuzzle, examplePuzzleTwo, realPuzzle } from './puzzle';


function getCardPoints(ownValue: String[], winningValue: String[]) {
  let winningValuePoint = 0;
  let winningValueCount = 0; // For day 2

  ownValue.forEach((oneValue) => {
    if(winningValue.includes(oneValue)){
      winningValueCount++;

      winningValuePoint === 0 
        ? winningValuePoint++ 
        : winningValuePoint *= 2;
    }
  });

  return {winningValuePoint, winningValueCount};
}

function one(useRealPuzzle: boolean = true): String {
  const lines: String[] = useRealPuzzle
    ? realPuzzle.trim().split('\n')
    : examplePuzzle.trim().split('\n');
  
  let finalResult = 0;

  lines.forEach((card) => {
    const splittedLine = card.split(':');
    const cardName = splittedLine[0].trim();
    const cardOwnValue = splittedLine[1].split('|')[0].trim().split(/\s+/);
    const cardWinningValue = splittedLine[1].split('|')[1].trim().split(/\s+/);

    // console.log('CardName:', cardName);
    // console.log('My values:', cardOwnValue);
    // console.log('Winning values:', cardWinningValue);

    // console.log('Points:', getCardPoints(cardOwnValue, cardWinningValue));
    const { winningValuePoint } = getCardPoints(cardOwnValue, cardWinningValue);
    finalResult += winningValuePoint;
  })

  return `Day 04* ${
    useRealPuzzle ? 'realPuzzle' : 'examplePuzzle'
  }: ${finalResult}`;
}

class Card {
  name: String;
  ownValue: String[];
  winningValue: String[];

  constructor(name: String, ownValue: String[], winningValue: String[]) {
    this.name = name;
    this.ownValue = ownValue;
    this.winningValue = winningValue;
  }
}

function two(useRealPuzzle: boolean = true): String {
  const lines: String[] = useRealPuzzle
    ? realPuzzle.trim().split('\n')
    : examplePuzzle.trim().split('\n');

  let finalResult = 0;
  const cardDeck: {card: Card, copyCount: number}[] = [];

  lines.forEach((card) => {
    const splittedLine = card.split(':');
    const cardName = splittedLine[0].trim();
    const cardOwnValue = splittedLine[1].split('|')[0].trim().split(/\s+/);
    const cardWinningValue = splittedLine[1].split('|')[1].trim().split(/\s+/);

    // Initialize the deck
    cardDeck.push({card: new Card(cardName, cardOwnValue, cardWinningValue), copyCount: 1});
    // finalResult += getCardPoints(cardOwnValue, cardWinningValue);
  })

  for(let i = 0; i < cardDeck.length; i++){
    const { winningValueCount } = getCardPoints(cardDeck[i].card.ownValue, cardDeck[i].card.winningValue);
    for(let j = 1; j <= winningValueCount; j++){
      cardDeck[i+j].copyCount += cardDeck[i].copyCount;
    }
  }

  // console.log(cardDeck);

  finalResult = cardDeck.reduce((res, cur) => res += cur.copyCount, 0);

  return `Day 04** ${
    useRealPuzzle ? 'realPuzzle' : 'examplePuzzle'
  }: ${finalResult}`;
}

export default { one, two };
