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

var times = data[0].replace(/(\r\n|\n|\r)/gm, "").split(' ').filter(n => n.match(/\d/g)).map(n=>parseInt(n));
var distances = data[1].replace(/(\r\n|\n|\r)/gm, "").split(' ').filter(n => n.match(/\d/g)).map(n=>parseInt(n));

function getWinCount(time, distance){
    var t_min = (time - Math.sqrt(time*time - 4*distance))/2;
    var t_max = (time + Math.sqrt(time*time - 4*distance))/2;
    
    //Handle ties
    if(Number.isInteger(t_min)){
        t_min + 1;
    }
    if(Number.isInteger(t_max)){
        t_max-1;
    }

    //Convert to integer space
    var t_min_int = Math.ceil(t_min);
    var t_max_int = Math.floor(t_max);
    return t_max_int - t_min_int + 1
}

var part1 = times.reduce((acc, time, i) =>{
    var distance = distances[i];
    
    var winCount = getWinCount(time, distance);
    return acc*winCount
},1);

console.log("Part 1: " + part1);

var time2 = parseInt(data[0].replace(/(\r\n|\n|\r| )/gm, "").split(':').filter(n => n.match(/\d/g))[0]);
var distance2 = parseInt(data[1].replace(/(\r\n|\n|\r| )/gm, "").split(':').filter(n => n.match(/\d/g))[0]);

console.log("Part 2: " + getWinCount(time2,distance2));