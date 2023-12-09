if (process.argv.length < 3) {
    console.log('Usage: node ' + process.argv[1] + ' FILENAME');
    process.exit(1);
}
// Read the file and print its contents.
var fs = require('fs')
    , filename = process.argv[2];


try{
    var data = fs.readFileSync(filename, 'utf8').toString().split('\n').map(row=>(row.split(" ").map(x=>parseInt(x))));
}catch(e){
    console.log("Error: ", e.stack);
}

var part1 = data.reduce((acc,row)=>{
    var lastDiffs = [];
    var line = row;
    while(!line.every(x=> x===0)){
        lastDiffs.push(line[line.length-1]);
        var newline = [];
        for(var i = 1; i<line.length; i++){
            newline.push(line[i] - line[i-1]);
        }
        line = newline;
    }
    var answer = lastDiffs.reduce((a,x)=>a+x,0);

    return acc + answer
},0)

console.log("Part 1: " + part1)

var part2 = data.reduce((acc,row)=>{
    var firstDiffs = [];
    var line = row;
    while(!line.every(x=> x===0)){
        firstDiffs.push(line[0]);
        var newline = [];
        for(var i = 1; i<line.length; i++){
            newline.push(line[i] - line[i-1]);
        }
        line = newline;
    }
    var answer = firstDiffs.reduce((a,x,i)=>a+ x*(-1)**(i),0);

    return acc + answer
},0)

console.log("Part 2: " + part2)
