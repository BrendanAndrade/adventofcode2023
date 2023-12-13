var Parallel = require('paralleljs');

if (process.argv.length < 3) {
    console.log('Usage: node ' + process.argv[1] + ' FILENAME');
    process.exit(1);
}
// Read the file and print its contents.
var fs = require('fs')
    , filename = process.argv[2];


try{
    var data = fs.readFileSync(filename, 'utf8').toString().split('\n').map(row=>{
        row = row.replace(/(\r\n|\n|\r)/gm, "").split(" ");
        row[0] = row[0].split("");
        row[1] = row[1].split(',').map(x=>parseInt(x));
        return row;
    });
}catch(e){
    console.log("Error: ", e.stack);
}

console.time("part1");

var p = new Parallel(data);
function add(d) {return d[0] + d[1]};
function log() { console.timeEnd("part1"); console.log("Part 1: " + arguments['0']); }

p.map(function(row){
    var acc = 0;
    var unknowns = row[0].filter(x => x==='?').length
    var line = row[0];
    for(var i = 0; i < 2**unknowns; i++){
        var count = 0;
        var testLine = line.map((element,) => {
            if(element === '?'){
                element = (Math.floor(i / 2**count)) % 2 === 0 ? '.' : '#';
                count++;
            }
            return element
        })
        var pattern = testLine.join("").split(/\.+/).filter(x=>x.length>0).map(x=>x.length);
        if(pattern.length === row[1].length && pattern.every((x,i)=>x === row[1][i])){
            acc++
        }
    };
    return acc;
    
}).reduce(add).then(log);

data = data.map(row=>{
    var temp1 = row[0];
    var temp2 = row[1];
    for(var i = 0; i < 4 ; i++){
        row[0] = row[0].concat(['?'],temp1);
        row[1] = row[1].concat(temp2);
    }
    return(row)
})

var p2 = new Parallel(data);
console.time("part2");
function log2() { console.timeEnd("part2"); console.log("Part 2: " + arguments['0']); }


p2.map(function(row){
    var acc = 0;
    var unknowns = row[0].filter(x => x==='?').length
    var line = row[0];
    for(var i = 0; i < 2**unknowns; i++){
        var count = 0;
        var testLine = line.map((element,) => {
            if(element === '?'){
                element = (Math.floor(i / 2**count)) % 2 === 0 ? '.' : '#';
                count++;
            }
            return element
        })
        var pattern = testLine.join("").split(/\.+/).filter(x=>x.length>0).map(x=>x.length);
        if(pattern.length === row[1].length && pattern.every((x,i)=>x === row[1][i])){
            acc++
        }
    };
    return acc;
    
}).reduce(add).then(log2);