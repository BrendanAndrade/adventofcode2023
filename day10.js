if (process.argv.length < 3) {
    console.log('Usage: node ' + process.argv[1] + ' FILENAME');
    process.exit(1);
}
// Read the file and print its contents.
var fs = require('fs')
    , filename = process.argv[2];


try{
    var data = fs.readFileSync(filename, 'utf8').toString().split('\n').map(row=>(row.split("")));
}catch(e){
    console.log("Error: ", e.stack);
}

var start = [];

for(var i = 0; i < data.length; i++){
    var row = data[i];
    var j = row.indexOf('S');
    if(j >= 0){
        start = [i,j];
        break;
    }
}

var count = 0;
var velocity;
var sShape;
//Find starting direction
if(start[0] !== 0 && ['|','7','F'].includes(data[start[0] - 1][start[1]])){
    //Check up
    velocity = [-1,0];
}
if(start[0] !== data.length - 1 && ['|','L','J'].includes(data[start[0] + 1][start[1]])){
    //Check down
    if(!velocity){
        velocity = [1,0];
    }else{
        sShape = '|';
    }
}
if(start[1] !== 0 && ['-','L','F'].includes(data[start[0]][start[1] -1]) && !sShape){
    //Check left
    if(!velocity){
        velocity = [0, -1];
    }else{
        if(velocity[0] === 1){
            sShape = '7';
        }else{
            sShape- 'J';
        }
    }
}else{
    if (velocity[1] === -1){
        sShape = '-';
    }else if(velocity[0] === 1){
        sShape = 'F';
    }else{
        sShape = 'L';
    }
}

count = 0;
currentPosition = start;
var map = Array(data.length)
for(var i = 0; i < map.length; i++){
    map[i] = Array(data[0].length).fill(0);
}

do{
    var currentPosition = currentPosition.map((x,j)=>x+velocity[j]);
    map[currentPosition[0]][currentPosition[1]] = 1;
    var currentTile = data[currentPosition[0]][currentPosition[1]];
    switch(currentTile){
        case '|':
        case '-':
            break;
        case 'L':
            if(velocity[0] === 1){ //Going down
                velocity = [0,1];
            }else{
                velocity = [-1,0];
            }
            break;
        case 'J':
            if(velocity[0] === 1){ //Going down
                velocity = [0, -1];
            }else{
                velocity = [-1, 0];
            }
            break;
        case '7':
            if(velocity[0] === -1){ //Going up
                velocity = [0, -1];
            }else{
                velocity = [1, 0];
            }
            break;
        case 'F':
            if(velocity[0] === -1){
                velocity = [0, 1];
            }else{
                velocity = [1, 0];
            }
            break;
    }
    count++;
}
while(currentTile !== 'S')

console.log("Part 1: " + count/2)

//Find a point on the edge of the map such that the interior must be to the inside

var outerIndex = start[1];
for(var i = start[1]; i < data[0].length; i++){
    if(map[start[0]][i] === 1){
        outerIndex = i;
    }
}

var fillStart = [start[0],outerIndex];
var fillStartTile = data[fillStart[0]][fillStart[1]];
var interior = "left";
if(['|','7','F'].includes(fillStartTile)){
    velocity = [1, 0];
}else if (['-','J']){
    velocity = [0, -1];
}else{
    velocity = [-1, 0];
}
currentPosition = fillStart;
count = 0;
do{
    var currentPosition = currentPosition.map((x,j)=>x+velocity[j]);
    var currentTile = data[currentPosition[0]][currentPosition[1]];
    var oldInterior = interior;
    if(currentTile === 'S'){
        currentTile = sShape;
    }
    switch(currentTile){
        case '|':
        case '-':
            break;
        case 'L':
            if(velocity[0] === 1){ //Going down
                velocity = [0,1];
                if(interior === 'left'){
                    interior = 'down'
                }else{
                    interior = 'up'
                }
            }else{
                velocity = [-1,0];
                if(interior === 'up'){
                    interior = 'right'
                }else{
                    interior = 'left'
                }
            }
            break;
        case 'J':
            if(velocity[0] === 1){ //Going down
                velocity = [0, -1];
                if(interior === 'left'){
                    interior = 'up';
                }else{
                    interior = 'down';
                }
            }else{
                velocity = [-1, 0];
                if(interior === 'up'){
                    interior = 'left';
                }else{
                    interior = 'right';
                }
            }
            break;
        case '7':
            if(velocity[0] === -1){ //Going up
                velocity = [0, -1];
                if(interior === 'left'){
                    interior = 'down';
                }else{
                    interior = 'up';
                }
            }else{
                velocity = [1, 0];
                if(interior === 'up'){
                    interior = 'right';
                }else{
                    interior = 'left';
                }
            }
            break;
        case 'F':
            if(velocity[0] === -1){
                velocity = [0, 1];
                if(interior === 'right'){
                    interior = 'down';
                }else{
                    interior = 'up'
                }
            }else{
                velocity = [1, 0];
                if(interior === 'right'){
                    interior = 'down';
                }else{
                    interior = 'left';
                }
            }
            break;
    }
    if(oldInterior !== interior){
        fillMap(oldInterior, currentPosition, map);
    }
    fillMap(interior, currentPosition, map);
}
while(!(currentPosition[0] === fillStart[0] && currentPosition[1] === fillStart[1]))

function fillMap(interior, currentPosition, map){
    if(interior === 'left'){
        for(var i = currentPosition[1]-1; i >= 0; i--){
            if(map[currentPosition[0]][i] === 1){
                break;
            }
            map[currentPosition[0]][i] = 2;
        }
    }
    if(interior === 'right'){
        for(var i = currentPosition[1]+1; i < map[0].length; i++){
            if(map[currentPosition[0]][i] === 1){
                break;
            }
            map[currentPosition[0]][i] = 2;
        }
    }
    if(interior === 'up'){
        for(var i = currentPosition[0]-1; i >= 0; i--){
            if(map[i][currentPosition[1]] === 1){
                break;
            }
            map[i][currentPosition[1]] = 2;
        }
    }
    if(interior === 'down'){
        for(var i = currentPosition[0]+1; i < map.length; i++){
            if(map[i][currentPosition[1]] === 1){
                break;
            }
            map[i][currentPosition[1]] = 2;
        }
    }
}

var part2 = map.reduce((acc, row)=>{
    return acc + row.reduce((acc, cell)=>{
        if(cell === 2){
            return acc + 1;
        }else{
            return acc;
        }
    },0) 
},0)

var string = map.reduce((acc, row)=>{
    return acc + row.reduce((acc, item)=> acc + " " + item.toString() ) + "\n";
},"");

//fs.writeFile("output.txt", string, (e)=>{if(e)console.log(e)})

console.log("Part 2: " + part2)
