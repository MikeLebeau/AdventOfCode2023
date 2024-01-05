import algo from './algo';
import cheat from './cheatSolution';

const cheatDebug = cheat().debugLog;
const mineDebug = algo.two().debugLog;

// Check du nombre de 'round' joué
// console.log('Round cheat count:', cheatDebug.length);
// console.log('Round mine count:', mineDebug.length);

// Me permet de check tout les losers pour un winner
// Goal: Check de la fonction isBetterThan
const cheatDebugWinnerLoser: {[winnerName: string]: [loserNames: string[]]} = cheatDebug.reduce((res, cur) => {
    if(res[cur.winnerHandName]){
        res[cur.winnerHandName].push(cur.loserHandName);
    } else {
        res[cur.winnerHandName] = [cur.loserHandName];
    }

    return res;
}, {});

const mineDebugWinnerLoser: {[winnerName: string]: [loserNames: string[]]} = mineDebug.reduce((res, cur) => {
    if(res[cur.winnerHandName]){
        res[cur.winnerHandName].push(cur.loserHandName);
    } else {
        res[cur.winnerHandName] = [cur.loserHandName];
    }

    return res;
}, {});

// console.log(`--------------------------`);

// Je veux compter les five, four etc
const reduceSortedFunc = (res, cur) => {
    if(res[cur.winnerType]){
        if(res[cur.winnerType][cur.winnerHandName]){
            res[cur.winnerType][cur.winnerHandName]++;
        }else{
            res[cur.winnerType][cur.winnerHandName] = 1;
        }
    } else {
        res[cur.winnerType] = [];
    }

    return res;
};

const mineSorted = mineDebug.reduce(reduceSortedFunc, {});
const cheatSorted = cheatDebug.reduce(reduceSortedFunc, {});

// console.log(`FIVE:\n\t Mine: ${Object.keys(mineSorted['IS_FIVE']).length} | Cheat: ${Object.keys(cheatSorted['Five of a kind']).length} => ${Object.keys(mineSorted['IS_FIVE']).length === Object.keys(cheatSorted['Five of a kind']).length}`);
// console.log(`FOUR:\n\t Mine: ${Object.keys(mineSorted['IS_FOUR']).length} | Cheat: ${Object.keys(cheatSorted['Four of a kind']).length} => ${Object.keys(mineSorted['IS_FOUR']).length === Object.keys(cheatSorted['Four of a kind']).length}`);
// console.log(`FULLHOUSE:\n\t Mine: ${Object.keys(mineSorted['IS_FULLHOUSE']).length} | Cheat: ${Object.keys(cheatSorted['Full house']).length} => ${Object.keys(mineSorted['IS_FULLHOUSE']).length === Object.keys(cheatSorted['Full house']).length}`);
// console.log(`THREE:\n\t Mine: ${Object.keys(mineSorted['IS_THREE']).length} | Cheat: ${Object.keys(cheatSorted['Three of a kind']).length} => ${Object.keys(mineSorted['IS_THREE']).length === Object.keys(cheatSorted['Three of a kind']).length}`);
// console.log(`IS_TWO_PAIR:\n\t Mine: ${Object.keys(mineSorted['IS_TWO_PAIR']).length} | Cheat: ${Object.keys(cheatSorted['Two pair']).length} => ${Object.keys(mineSorted['IS_TWO_PAIR']).length === Object.keys(cheatSorted['Two pair']).length}`);
// console.log(`IS_ONE_PAIR:\n\t Mine: ${Object.keys(mineSorted['IS_ONE_PAIR']).length} | Cheat: ${Object.keys(cheatSorted['One pair']).length} => ${Object.keys(mineSorted['IS_ONE_PAIR']).length === Object.keys(cheatSorted['One pair']).length}`);
// console.log(`IS_HIGH_CARD:\n\t Mine: ${Object.keys(mineSorted['IS_HIGH_CARD']).length} | Cheat: ${Object.keys(cheatSorted['High card']).length} => ${Object.keys(mineSorted['IS_HIGH_CARD']).length === Object.keys(cheatSorted['High card']).length}`);

// console.log(`--------------------------`);

// On check les full house car j'ai un 'false'(l.55)
const cheatFullHouse = Object.keys(cheatSorted['Full house']);
const mineFullHouse = Object.keys(mineSorted['IS_FULLHOUSE']);

cheatFullHouse.forEach((cheat) => {
    if(!mineFullHouse.includes(cheat)){
        console.log(`Je n'ai pas celui la (${cheat}) dans les fullHouse`);
    }
});

export default algo;
