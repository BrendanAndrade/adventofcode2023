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

var part1 = data.reduce((sum, game) => {
    var x = game.split(/: |; /);
    var isImpossible = false;
    for(var i = 1; i < x.length; i++){
        var round = x[i].split(',');
        round.every(y => {
            var count = parseInt(y.match(/\d/g).join(''), 10)
            var color = y.match(/[^\d\W]/g).join('');
            if((color === 'red' && count > 12) || (color === 'green' && count > 13) || (color === 'blue' && count > 14) ){
                isImpossible = true;
                return false;
            }
            return true;
        })
        if(isImpossible){
            break;
        }
    }
    if(!isImpossible){
        var gameNumber = parseInt(x[0].match(/\d/g).join(''), 10)
        return sum + gameNumber;
    } else{
        return sum;
    }
},0);

console.log("Part 1: " + part1);

var part2 = data.reduce((sum, game) => {
    var x = game.split(/: |; /);
    var balls = {red: 0, blue: 0, green: 0};
    for(var i = 1; i < x.length; i++){
        var round = x[i].split(',');
        round.forEach(y => {
            var count = parseInt(y.match(/\d/g).join(''), 10)
            var color = y.match(/[^\d\W]/g).join('');
            if(balls[color] < count){
                balls[color] = count;
            }
        })
    }
    return sum + Object.values(balls).reduce((power, ball)=>power*ball,1);
},0);

console.log("Part 2: " + part2);

return 0;