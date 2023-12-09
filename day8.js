if (process.argv.length < 3) {
    console.log('Usage: node ' + process.argv[1] + ' FILENAME');
    process.exit(1);
}
// Read the file and print its contents.
var fs = require('fs')
    , filename = process.argv[2];


try{
    var data = fs.readFileSync(filename, 'utf8').toString().split('\n')
}catch(e){
    console.log("Error: ", e.stack);
}

var steps = data[0].split("").filter(dir=> ['R','L'].includes(dir)).map(dir=> dir === 'R' ? 1 : 0);

var map = {};
for(var i = 2; i < data.length; i++){
    var row = data[i].replace(/[^a-zA-Z0-9\s]/g, '').split(/\s+/);
    map[row[0]] = [row[1], row[2]];
}

var position = 'AAA';
var count = 0;
while(position !== 'ZZZ'){
    position = map[position][steps[count % steps.length ]];
    count++;
}

console.log("Part 1: " + count.toString());

var positions = Object.keys(map).filter(pos => pos.endsWith('A'));

var pathLengths = positions.map(start=>{
    var x = 0;
    var cur = start;
    while(!cur.endsWith('Z')){
        cur = map[cur][steps[x % steps.length ]];
        x++;
    }
    console.log(start + " " + map[start] + " " + cur + " " + map[cur]);
    return x;
})

const gcd = (a, b) => a ? gcd(b % a, a) : b;

const lcm = (a, b) => a * b / gcd(a, b);

var LCM = pathLengths.reduce(lcm);

console.log("Part 2: " + LCM);

//All of the paths loop starting at step 1. They have no path before the loop. They all reach a different end and do not traverse multiple ends. This is a special case where they all sync at the least common multiple of the loop lengths.
//This solution fails outside of inputs with this condition. 