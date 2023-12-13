if (process.argv.length < 3) {
    console.log('Usage: node ' + process.argv[1] + ' FILENAME');
    process.exit(1);
}
// Read the file and print its contents.
var fs = require('fs')
    , filename = process.argv[2];


try{
    var data = fs.readFileSync(filename, 'utf8').toString().split('\n\n');
}catch(e){
    console.log("Error: ", e.stack);
}

var rowPuzzels = data.map(puzzle=>puzzle.split('\n').map(row=>row.replace(/(\r\n|\n|\r)/gm, "").split("")));

var colPuzzels = [];
rowPuzzels.forEach(puzzle => {
    var columns = [];
    for(var i = 0; i < puzzle[0].length; i++){
        var column = [];
        for(var j = 0; j < puzzle.length; j++){
            column.push(puzzle[j][i]);
        }
        columns.push(column);
    }
    colPuzzels.push(columns);
})

var part1 = rowPuzzels.reduce((acc, rowPuzzel, k)=>{
    for(var i = 0; i < rowPuzzel.length-1; i++){
        if(rowPuzzel[i].every((item,j) => item === rowPuzzel[i+1][j])){
            var reflectionFailed = false;
            var count = 0;
            while(rowPuzzel[i-count] && rowPuzzel[i+1+count]){
                if(!rowPuzzel[i-count].every((item, n)=> item === rowPuzzel[i+1+count][n])){
                    reflectionFailed = true;
                    break;
                }
                count++;
            }
            if(!reflectionFailed){
                return acc + (i+1)*100;
            }
        }
    }
    var colPuzzel = colPuzzels[k];
    for(var i = 0; i < colPuzzel.length-1; i++){
        if(colPuzzel[i].every((item, j)=> item === colPuzzel[i+1][j])){
            var reflectionFailed = false;
            var count = 0;
            while(colPuzzel[i-count] && colPuzzel[i+1+count]){
                if(!colPuzzel[i-count].every((item, n)=> item === colPuzzel[i+1+count][n])){
                    reflectionFailed = true;
                    break;
                }
                count++;
            }
            if(!reflectionFailed){
                return acc + i+1;
            }
        }
    }
    console.log("P1 No reflection found: " + k);
    return acc;
},0)

console.log("Part 1: " + part1);

var part2 = rowPuzzels.reduce((acc, rowPuzzel, k)=>{
    for(var i = 0; i < rowPuzzel.length-1; i++){
        if([0,1].includes(rowPuzzel[i].reduce((acc,item,j) => item === rowPuzzel[i+1][j] ? acc : acc + 1,0))){
            var reflectionFailed = false;
            var count = 0;
            var smudgeCount = 0;
            while(rowPuzzel[i-count] && rowPuzzel[i+1+count]){
                if(rowPuzzel[i-count].reduce((acc,item,j) => item === rowPuzzel[i+1+count][j] ? acc : acc + 1,0) === 1){
                    smudgeCount++;
                    if(smudgeCount > 1){
                        reflectionFailed = true;
                        break;
                    }
                }else if(!rowPuzzel[i-count].every((item, n)=> item === rowPuzzel[i+1+count][n])){
                    reflectionFailed = true;
                    break;
                }
                count++;
            }
            if(!reflectionFailed && smudgeCount === 1){
                return acc + (i+1)*100;
            }
        }
    }
    var colPuzzel = colPuzzels[k];
    for(var i = 0; i < colPuzzel.length-1; i++){
        if([0,1].includes(colPuzzel[i].reduce((acc,item,j) => item === colPuzzel[i+1][j] ? acc : acc + 1,0))){
            var reflectionFailed = false;
            var count = 0;
            var smudgeCount = 0;
            while(colPuzzel[i-count] && colPuzzel[i+1+count]){
                if(colPuzzel[i-count].reduce((acc,item,j) => item === colPuzzel[i+1+count][j] ? acc : acc + 1,0) === 1){
                    smudgeCount++;
                    if(smudgeCount > 1){
                        reflectionFailed = true;
                        break;
                    }
                }else if(!colPuzzel[i-count].every((item, n)=> item === colPuzzel[i+1+count][n])){
                    reflectionFailed = true;
                    break;
                }
                count++;
            }
            if(!reflectionFailed && smudgeCount === 1){
                return acc + i+1;
            }
        }
    }
    console.log("P2 No reflection found: " + k);
    return acc;
},0)

console.log("Part 2: " + part2);