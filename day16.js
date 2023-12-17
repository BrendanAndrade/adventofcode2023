if (process.argv.length < 3) {
    console.log('Usage: node ' + process.argv[1] + ' FILENAME');
    process.exit(1);
}
// Read the file and print its contents.
var fs = require('fs')
    , filename = process.argv[2];


try{
    var data = fs.readFileSync(filename, 'utf8').toString().split('\n').map(row=>row.replace(/(\r\n|\n|\r)/gm, "").split(""));
}catch(e){
    console.log("Error: ", e.stack);
}

var lights = Array(1).fill({position:[0,-1], velocity:[0,1]});

var part1 = solve(lights, data);

console.log("Part 1: " + part1);

var starts = [];
for(var i = 0; i < data.length; i++){
    starts.push([{position:[i,-1], velocity:[0,1]}])
    starts.push([{position:[i,data.length], velocity:[0,-1]}])
}
for(var i = 0; i < data[0].length; i++){
    starts.push([{position:[-1,i], velocity:[1,0]}])
    starts.push([{position:[data[0].length,i], velocity:[-1,0]}])
}

var part2 = starts.reduce((acc, lights)=>{
    var x = solve(lights, data);
    if(x > acc){
        return x
    }else{
        return acc;
    }
},0)

console.log("Part 2: " + part2)

function solve(lights, data){
    var energizedMap = [...Array(data.length)].map(e=>Array(data[0].length).fill(0));
    while(lights.length > 0){
        var light = lights.pop();
        var newPosition = [light.position[0] + light.velocity[0], light.position[1] + light.velocity[1]];
        if(newPosition[0] < 0 || newPosition[0] >= data.length || newPosition[1] < 0 || newPosition[1] >= data[0].length){
            //Out of bounds
            continue;
        }
        //Loop handling
        var encodeVal = 2**(Math.atan2(light.velocity[0],light.velocity[1])*2/Math.PI+1);
        if(encodeVal & energizedMap[newPosition[0]][newPosition[1]]){
            //In a loop
            continue;
        }
        energizedMap[newPosition[0]][newPosition[1]] += encodeVal;
        var newVelocities = [];
        switch(data[newPosition[0]][newPosition[1]]){
            case "\\":
                newVelocities = [[light.velocity[1],light.velocity[0]]];
                break;
            case "/":
                newVelocities = [[-light.velocity[1],-light.velocity[0]]];
                break;
            case "-":
                if(light.velocity[1] === 0){
                    newVelocities = [[0,1],[0,-1]];
                    break;
                }else{
                    newVelocities = [light.velocity];
                }
                break;
            case "|":
                if(light.velocity[0] === 0){
                    newVelocities = [[1,0], [-1,0]];
                }else{
                    newVelocities = [light.velocity];
                }
                break;
            default:
                newVelocities = [light.velocity];
        }
        newVelocities.forEach(newVel => lights.push({position: newPosition, velocity: newVel}));       
    }

    return energizedMap.reduce((acc, row)=>acc+row.reduce((ac,cell)=>(cell > 0) ? ac+1 : ac,0),0);
}

