if (process.argv.length < 3) {
    console.log('Usage: node ' + process.argv[1] + ' FILENAME');
    process.exit(1);
}
// Read the file and print its contents.
var fs = require('fs')
    , filename = process.argv[2];


try{
    var rowData = fs.readFileSync(filename, 'utf8').toString().split('\n').map(row=>row.replace(/(\r\n|\n|\r)/gm, "").split(""));
}catch(e){
    console.log("Error: ", e.stack);
}

var data = [];
for(var i = 0; i < rowData[0].length; i++){
    var col = []
    for(var j = 0; j < rowData.length; j++){
        col.push(rowData[j][i]);
    }
    data.push(col);
}

var part1 = data.reduce((acc, col) => {
    var cube = -1;
    var rocks = 0;
    for(var i = 0; i < col.length; i++){
        if(col[i] === '#'){
            //figure score, reset cubes and rocks
            acc += score(cube, rocks, col.length);
            rocks = 0;
            cube = i;
        }else if(col[i] === 'O'){
            rocks++;
        }
    }
    //figure score of remaining rocks
    acc += score(cube, rocks, col.length);

    return acc;
},0)

function score(cubeIndex, rocks, colLength){
    var score = 0;
    for( var i = 1; i <= rocks; i++){
        score += colLength - cubeIndex - i;
    }
    return score;
}

console.log("Part 1: " + part1)

var firstHit = -1;

var N = 8;
var loadPatterns = [];
var lastNloads = Array(N).fill(0);
var iter = 0;
var load;

while(firstHit < 0){
    
    for(var cycle = 1; cycle <= 4; cycle++){
        //Tilt
        for(var i = 0; i < data.length; i++){
            var col = data[i];
            var rocks = 0;
            for(var j = col.length-1; j >= 0; j--){
                var item = col[j];
                if(item === 'O'){
                    rocks++;
                    data[i][j] = '.';
                }
                if(item === '#' || j === 0){
                    var kStart = 1;
                    var kEnd = rocks;
                    if(j === 0 && item !== '#'){
                        kStart = 0;
                        kEnd = rocks - 1;
                    }
                    for(var k = kStart; k <= kEnd; k++){
                        data[i][j+k] = 'O'
                    }
                    rocks = 0;
                }
            }
        }
        //Rotate
        data = data[0].map((_, index) => data.map(row => row[row.length-1-index]));
    }

    // var string = data.reduce((acc, row)=>{
    //     return acc + row.reduce((acc, item)=> acc + " " + item.toString() ) + "\n";
    // },"");
    
    // fs.writeFile("output.txt", string, (e)=>{if(e)console.log(e)})

    load = data.reduce((acc, col)=>{
        return acc + col.reduce((ac, item,i)=>{
            if(item === 'O'){
                ac+= col.length-i;
            }
            return ac;
        },0)
    },0)

    lastNloads[iter % N] = load;

    var loadPattern = '';
    for(var ii = 0; ii < N ; ii++){
        loadPattern = loadPattern.concat(lastNloads[(iter+N-ii) % N].toString());
    }
    firstHit = loadPatterns.indexOf(loadPattern);
    loadPatterns.push(loadPattern);
    iter++;
}

firstHit = firstHit+1; //Account for zero index;

//firstHit - N is the transient. iter-firstHit is the loop length.
var equivalentIndex = (((1000000000 - (firstHit-N)) % (iter-firstHit)) + (firstHit-N) );

var freshData = [];
for(var i = 0; i < rowData[0].length; i++){
    var col = []
    for(var j = 0; j < rowData.length; j++){
        col.push(rowData[j][i]);
    }
    freshData.push(col);
}

for(var loop = 0; loop < equivalentIndex; loop++){
    for(var cycle = 1; cycle <= 4; cycle++){
        //Tilt
        for(var i = 0; i < freshData.length; i++){
            var col = freshData[i];
            var rocks = 0;
            for(var j = col.length-1; j >= 0; j--){
                var item = col[j];
                if(item === 'O'){
                    rocks++;
                    freshData[i][j] = '.';
                }
                if(item === '#' || j === 0){
                    var kStart = 1;
                    var kEnd = rocks;
                    if(j === 0 && item !== '#'){
                        kStart = 0;
                        kEnd = rocks - 1;
                    }
                    for(var k = kStart; k <= kEnd; k++){
                        freshData[i][j+k] = 'O'
                    }
                    rocks = 0;
                }
            }
        }
        //Rotate
        freshData = freshData[0].map((_, index) => freshData.map(row => row[row.length-1-index]));
    
        
    }
}

var part2 = freshData.reduce((acc, col)=>{
    return acc + col.reduce((ac, item,m)=>{
        if(item === 'O'){
            ac+= col.length-m;
        }
        return ac;
    },0)
},0);

console.log("Part 2: " + part2);