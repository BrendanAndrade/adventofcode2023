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


var maps = [];
var currentMap = [];

for(var i = 3; i < data.length; i++){
    const row = data[i];
    if(row.trim() === ""){
        maps.push(currentMap);
        currentMap = [];
    }
    if(/\d/.test(row)){
        currentMap.push(row.split(' ').map(n=>parseInt(n)));
    }
}

var seeds = data[0].replace(/(\r\n|\n|\r)/gm, "").split(' ').filter(n => n.match(/\d/g)).map(n=>parseInt(n));

var part1 = seeds.reduce((acc, seed)=>{
    var currentId = seed;
    maps.forEach((map)=>{
        map.some(range => {
            if(currentId >= range[1] && currentId < range[1]+range[2]){
                currentId = currentId - range[1] + range[0];
                return true;
            }
        })
    })
    return Math.min(currentId,acc);
},Number.MAX_SAFE_INTEGER);

console.log("Part 1: " + part1.toString());

var seedRanges = [];
for(var i = 0; i < seeds.length; i+=2){
    seedRanges.push({start: seeds[i], len: seeds[i+1]});
}

console.log(seedRanges.length);

var part2 = seedRanges.reduce((acc, seedRange)=>{
    console.log(seedRange)
    var best = Number.MAX_SAFE_INTEGER;
    for(var seed = seedRange.start; seed < seedRange.start + seedRange.len; seed++){
        var currentId = seed;
        maps.forEach((map)=>{
            map.some(range => {
                if(currentId >= range[1] && currentId < range[1]+range[2]){
                    currentId = currentId - range[1] + range[0];
                    return true;
                }
            })
        })
        best = Math.min(currentId, best);
    }
    return Math.min(best,acc);
},Number.MAX_SAFE_INTEGER);

console.log("Part 2: " + part2.toString());


