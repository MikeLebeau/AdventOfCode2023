import { DebugHand } from './debugTools';
import { examplePuzzle, realPuzzle } from './puzzle';

type Card = {
  name: string;
  value: number;
}

enum Types {
  IS_FIVE = 6,
  IS_FOUR = 5,
  IS_FULLHOUSE = 4,
  IS_THREE = 3,
  IS_TWO_PAIR = 2,
  IS_ONE_PAIR = 1,
  IS_HIGH_CARD = 0
}
class Hand {
  cards: [Card, Card, Card, Card, Card];
  bid: number;

  cardCount: { [name: string]: number };

  constructor(cards: string, bid: number, isPartTwo: boolean = false) {
    if(isPartTwo){
      this.cards = [
        CardsPartTwo[cards[0]],
        CardsPartTwo[cards[1]],
        CardsPartTwo[cards[2]],
        CardsPartTwo[cards[3]],
        CardsPartTwo[cards[4]]
      ];
    } else {
      this.cards = [
        Cards[cards[0]],
        Cards[cards[1]],
        Cards[cards[2]],
        Cards[cards[3]],
        Cards[cards[4]]
      ];
    }
      
    this.bid = bid;

    this.cardCount = this.cards.reduce((res, cur) => {
      if(!res[cur.name]) {
        res[cur.name] = 1;
      } else {
        res[cur.name]++;
      }

      return res;
    }, {});
  }

  isBetterThan(otherHand: Hand): boolean {
    if(this.getType() > otherHand.getType()){
      return true;
    }

    if(this.getType() < otherHand.getType()){
      return false;
    }

    for(let i = 0; i < this.cards.length; i++){
      if(this.cards[i].value > otherHand.cards[i].value) {
        return true;
      } else if(this.cards[i].value < otherHand.cards[i].value) {
        return false;
      }
    }

    return false;
  }

  // FOR TEST
  getTypeName(): string {
    return Object.entries(Types)[this.getType()][1].toString();
  }
  // END FOR TEST

  getType(): Types {
    if(this.isFive()){
      return Types.IS_FIVE;
    }

    if(this.isFour()) {
      return Types.IS_FOUR;
    }

    if(this.isHouse()) {
      return Types.IS_FULLHOUSE;
    }

    if(this.isThree()){
      return Types.IS_THREE;
    }

    if(this.isTwoPair()){
      return Types.IS_TWO_PAIR;
    }

    if(this.isOnePair()){
      return Types.IS_ONE_PAIR;
    }

    if(this.isHighCard()){
      return Types.IS_HIGH_CARD;
    }
  }

  getJokerCount(): number {
    return (Number(Object.entries(this.cardCount).filter((card) => card[0] === Cards.J.name).flat()[1])) || 0;
  }

  isFive() {
    return Object.keys(this.cardCount).length === 1 // 5 cards, AAAAA
      || 
      // 4 cards 1 joker, AAAAJ
      (Object.values(this.cardCount).filter((count) => count === 4).length === 1 && 
      this.getJokerCount() === 1)
      || 
      // 4 jokers 1 card, AJJJJ
      (Object.values(this.cardCount).filter((count) => count === 1).length === 1 && 
      this.getJokerCount() === 4)
      ||
      // 1 Full house with 2 jokers (AAAJJ)
      ((Object.values(this.cardCount).filter((count) => count === 3).length === 1 &&
      Object.values(this.cardCount).filter((count) => count === 2).length === 1) && 
      this.getJokerCount() === 2)
      ||
      // 1 Full house with jokers (AAJJJ)
      ((Object.values(this.cardCount).filter((count) => count === 3).length === 1 &&
      Object.values(this.cardCount).filter((count) => count === 2).length === 1) && 
      this.getJokerCount() === 3);
  }

  isFour() {
    return Object.values(this.cardCount).filter((count) => count === 4).length === 1 // 4 cards, AAAAK
    ||
    // 1 Three 1 joker, AAAJK
    ((Object.values(this.cardCount).filter((count) => count === 3).length === 1 && // 3 cards, AAAKQ
    Object.values(this.cardCount).filter((count) => count === 1).length === 2) && 
    this.getJokerCount() === 1) 
    ||
    // 1 Three joker, AJJJK
    ((Object.values(this.cardCount).filter((count) => count === 3).length === 1 && // 3 cards, AAAKQ
    Object.values(this.cardCount).filter((count) => count === 1).length === 2) && 
    this.getJokerCount() === 3) 
    ||
    // 1 Pairs 2 jokers, AAJJK
    (Object.values(this.cardCount).filter((count) => count === 2).length === 2 &&
    Object.values(this.cardCount).filter((count) => count === 1).length === 1 && 
    this.getJokerCount() === 2);
  }

  isHouse() {
    // Need 1 triple and 1 pair
    const tripleCount = 1;
    const pairCount = 1;
    
    return (Object.values(this.cardCount).filter((count) => count === 3).length === tripleCount && // 3 cards 2 cards, AAAKK
      Object.values(this.cardCount).filter((count) => count === 2).length === pairCount)
      ||
      // AAAKJ
      (Object.values(this.cardCount).filter((count) => count === 3).length === 1 &&
      Object.values(this.cardCount).filter((count) => count === 1).length === 2 && 
      this.getJokerCount() === 1)
      ||
      // AAKKJ
      (Object.values(this.cardCount).filter((count) => count === 2).length === 2 &&
      Object.values(this.cardCount).filter((count) => count === 1).length === 1 &&
      this.getJokerCount() === 1);
  }

  isThree() {
    // Need 1 triple and 2 others
    const tripleCount = 1;
    const otherCount = 2;
    
    return (Object.values(this.cardCount).filter((count) => count === 3).length === tripleCount && // 3 cards, AAAKQ
      Object.values(this.cardCount).filter((count) => count === 1).length === otherCount) 
      || 
      // 1 Pair 1 joker, AAJKQ
      (Object.values(this.cardCount).filter((count) => count === 2).length === 1 &&
      Object.values(this.cardCount).filter((count) => count === 1).length === 3 && 
      this.getJokerCount() === 1)
      || 
      // 1 card 2 joker, AJJKQ
      (Object.values(this.cardCount).filter((count) => count === 2).length === 1 &&
      Object.values(this.cardCount).filter((count) => count === 1).length === 3 && 
      this.getJokerCount() === 2)
  }

  isTwoPair() {
    // Need 2 pairs and 1 other
    const pairCount = 2;
    const otherCount = 1;
    
    return Object.values(this.cardCount).filter((count) => count === 2).length === pairCount &&
      Object.values(this.cardCount).filter((count) => count === 1).length === otherCount
      ||
      // AAKJQ
      (Object.values(this.cardCount).filter((count) => count === 2).length === 1 &&
      Object.values(this.cardCount).filter((count) => count === 1).length === 3) &&
      this.getJokerCount() === 1;
  }

  isOnePair() {
    // Need 1 pair and 3 others
    const pairCount = 1;
    const otherCount = 3;
    
    return (Object.values(this.cardCount).filter((count) => count === 2).length === pairCount &&
      Object.values(this.cardCount).filter((count) => count === 1).length === otherCount) 
      || 
      // At least 1 joker, AKQTJ
      this.getJokerCount() === 1;
  }

  isHighCard() {
    // Need 5 others
    const otherCount = 5;

    return Object.values(this.cardCount).filter((count) => count === 1).length === otherCount && this.getJokerCount() === 0;
  }
}

const Cards = {
  2: { name: '2', value: 2 },
  3: { name: '3', value: 3 },
  4: { name: '4', value: 4 },
  5: { name: '5', value: 5 },
  6: { name: '6', value: 6 },
  7: { name: '7', value: 7 },
  8: { name: '8', value: 8 },
  9: { name: '9', value: 9 },
  J: { name: 'J', value: 11 },
  T: { name: 'T', value: 10 },
  Q: { name: 'Q', value: 12 },
  K: { name: 'K', value: 13 },
  A: { name: 'A', value: 14 },
};

const CardsPartTwo = {
  ...Cards,
  J: { name: 'J', value: 1 },
};

function one(useRealPuzzle: boolean = true): String {
  const lines: String[] = useRealPuzzle
    ? realPuzzle.trim().split('\n')
    : examplePuzzle.trim().split('\n');

  let finalResult = 0;

  const hands: Hand[] = [];

  lines.forEach((line) => {
    const hand: string[] = line.split(/\s+/);
    hands.push(new Hand(hand[0], Number(hand[1])));
  });

  hands.sort((a, b) => {
    if(a.isBetterThan(b)){
      return 1;
    } else if(b.isBetterThan(a)) {
      return -1;
    } else {
      return 0;
    }
  });

  finalResult = hands.reduce((res, cur, index) => {
    res += cur.bid * (index+1);
    return res;
  }, 0);

  return `Day 07* ${
    useRealPuzzle ? 'realPuzzle' : 'examplePuzzle'
  }: ${finalResult}`;
}

const debugLog: DebugHand[] = [];

function two(useRealPuzzle: boolean = true) {
  const lines: String[] = useRealPuzzle
    ? realPuzzle.trim().split('\n')
    : examplePuzzle.trim().split('\n');

    let finalResult = 0;

    const hands: Hand[] = [];
  
    lines.forEach((line) => {
      const hand: string[] = line.split(/\s+/);
      hands.push(new Hand(hand[0], Number(hand[1]), true));
    });

    hands.sort((a, b) => {
      const aName = a.cards.reduce((r,c) => r += c.name, '');
      const bName = b.cards.reduce((r,c) => r += c.name, '');

      if(a.isBetterThan(b)){
        // console.log(`${aName}(${a.getTypeName()}) > ${bName}(${b.getTypeName()})`);
        debugLog.push({winnerHandName: aName, winnerType: a.getTypeName(), loserHandName: bName, loserType: b.getTypeName()});
        return 1;
      } else if(b.isBetterThan(a)) {
        // console.log(`${aName}(${a.getTypeName()}) < ${bName}(${b.getTypeName()})`);
        debugLog.push({winnerHandName: bName, winnerType: b.getTypeName(), loserHandName: aName, loserType: a.getTypeName()});
        return -1;
      } else {
        return 0;
      }
    });
  
  finalResult = hands.reduce((res, cur, index) => {
    res += cur.bid * (index+1);
    return res;
  }, 0);

  const finalResultString = `Day 07** ${
    useRealPuzzle ? 'realPuzzle' : 'examplePuzzle'
  }: ${finalResult}`;

  return { finalResultString, debugLog};
}

export default { one, two, debugLog };
