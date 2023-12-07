if (process.argv.length < 3) {
    console.log('Usage: node ' + process.argv[1] + ' FILENAME');
    process.exit(1);
}
// Read the file and print its contents.
var fs = require('fs')
    , filename = process.argv[2];


try{
    var data = fs.readFileSync(filename, 'utf8').toString().split('\n').map((row)=> row.split(" ")).map((row)=>[row[0].split(""), parseInt(row[1])]);
}catch(e){
    console.log("Error: ", e.stack);
}

function handStrength(cards){
    var counts = Object.values(cards.reduce((acc,card)=>{
        acc[card] = acc[card] ? acc[card] + 1 : 1;
        return acc;
    },{}))
    if(counts.includes(5)){
        return 7;
    }else if(counts.includes(4)){
        return 6;
    }else if(counts.includes(3) && counts.includes(2)){
        return 5;
    }else if(counts.includes(3)){
        return 4;
    }else if(counts.filter(n=>n===2).length === 2){
        return 3;
    }else if(counts.includes(2)){
        return 2;
    }else{
        return 1;
    }
}

var cardStrengths = {'A':14, 'K':13, 'Q':12, 'J':11, 'T':10, '9':9, '8': 8, '7': 7, '6':6, '5': 5, '4': 4, '3': 3, '2':2};

var part1 = data.sort((a, b) => {
    var aCards = a[0];
    var bCards = b[0];
    var aStrength = handStrength(aCards);
    var bStrenth = handStrength(bCards);
    if(aStrength !== bStrenth){
        return aStrength - bStrenth;
    }else{
        for(var i = 0; i < 5; i++){
            if(cardStrengths[aCards[i]] !== cardStrengths[bCards[i]]){
                return cardStrengths[aCards[i]] - cardStrengths[bCards[i]];
            }
        }
        return 0;
    }
}).reduce((acc, hand, i)=>{return acc + hand[1]*(i+1)},0);

console.log("Part 1: " + part1.toString())

function arrayMax(array){
    return array.reduce((a,b) => Math.max(a,b), -Infinity);
}

function handStrength2(cards){
    var cardCounts = cards.reduce((acc,card)=>{
        acc[card] = acc[card] ? acc[card] + 1 : 1;
        return acc;
    },{});
    var jacks = cardCounts['J'] ? cardCounts['J'] : 0;
    if(jacks === 5){
        return 7;
    }
    delete cardCounts.J;
    var counts = Object.values(cardCounts);
    if(arrayMax(counts) + jacks === 5){
        return 7;
    }else if(arrayMax(counts) + jacks === 4){
        return 6;
    }else if((counts.includes(3) && counts.includes(2)) || (counts.filter(n=>n===2).length === 2 && jacks === 1)){
        return 5;
    }else if(arrayMax(counts) + jacks === 3){
        return 4;
    }else if(counts.filter(n=>n===2).length === 2){
        return 3;
    }else if(arrayMax(counts) + jacks === 2){
        return 2;
    }else{
        return 1;
    }
}

cardStrengths['J'] = 1;

var part2 = data.sort((a, b) => {
    var aCards = a[0];
    var bCards = b[0];
    var aStrength = handStrength2(aCards);
    var bStrenth = handStrength2(bCards);
    if(aStrength !== bStrenth){
        return aStrength - bStrenth;
    }else{
        for(var i = 0; i < 5; i++){
            if(cardStrengths[aCards[i]] !== cardStrengths[bCards[i]]){
                return cardStrengths[aCards[i]] - cardStrengths[bCards[i]];
            }
        }
        return 0;
    }
}).reduce((acc, hand, i)=>{return acc + hand[1]*(i+1)},0);

console.log("Part 2: " + part2.toString());