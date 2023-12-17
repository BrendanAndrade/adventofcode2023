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

var energizedMap = [...Array(data.length)].map(e=>Array(data[0].length).fill(0));

var lights = Array(1).fill({position:[0,-1], velocity:[0,1]});

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

var part1 = energizedMap.reduce((acc, row)=>acc+row.reduce((ac,cell)=>{
    var x = (cell > 0) ? ac+1 : ac
    return x;
},0),0);

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

