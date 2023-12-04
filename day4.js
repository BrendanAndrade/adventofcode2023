if (process.argv.length < 3) {
    console.log('Usage: node ' + process.argv[1] + ' FILENAME');
    process.exit(1);
}
// Read the file and print its contents.
var fs = require('fs')
    , filename = process.argv[2];


try{
    var data = fs.readFileSync(filename, 'utf8').toString().split('\n');
}catch(e){
    console.log("Error: ", e.stack);
}

var part1 = data.reduce((sum, row) => {
    var card = row.split(":")[1].split("|").map((section)=>section.replace(/(\r\n|\n|\r)/gm, "").split(" ").filter(x=>x));
    var score = card[1].reduce((score, number)=>{
        if(card[0].includes(number)){
            score = score * 2 ? score * 2 : 1;
        }
        return score;
    },0)

    return sum + score;
}, 0)

console.log("Part 1: " + part1);

var cardCount = Array(data.length).fill(1);
data.forEach((row,i) => {
    var card = row.split(":")[1].split("|").map((section)=>section.replace(/(\r\n|\n|\r)/gm, "").split(" ").filter(x=>x));
    var score = card[1].reduce((score, number)=>{
        if(card[0].includes(number)){
            score++;
        }
        return score;
    },0)
    for(var j = i+1; j <= i+score; j++){
        cardCount[j] += cardCount[i];
    }
})

console.log("Part 2: " + cardCount.reduce((sum, score)=>sum+score));