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

var part1 = data.reduce((acc, row)=>{
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
    
},0);
console.timeEnd("part1")
console.log("Part 1: " + part1);