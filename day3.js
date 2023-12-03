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

var part1 = data.reduce((sum,row, i) => {
    for(var j = 0; j < row.length; j++){
        if(row[j].match(/\d/g)){
            //Extract full number
            var endSlice = row.slice(j).search(/\D/g) >= 0 ? row.slice(j).search(/\D/g) + j : row.length;
            var numberString = row.slice(j, endSlice);;
            var numberLength = numberString.length;
            var isPartNumber = false;
            
            //Search previous row
            if(i > 0){
                for(var p = Math.max(j-1,0); p < Math.min(j+1+numberLength,row.length); p++){
                    if(data[i-1][p] !== '.' && !data[i-1][p].match(/\d/g)){
                        isPartNumber = true;
                        break;
                    }
                }
            }
            //Search before
            if(!isPartNumber && j !== 0) {
                if(row[j-1] !== '.' && !row[j-1].match(/\d/g)){
                    isPartNumber = true;
                }
            }
            //Search after
            if(!isPartNumber && j+numberLength < row.length){
                if(row[j+numberLength] !== '.' && !row[j+numberLength].match(/\d/g)){
                    isPartNumber = true;
                }
            }
            //Search next row
            if(!isPartNumber && i !== data.length-1){
                for(var p = Math.max(j-1,0); p < Math.min(j+1+numberLength,row.length); p++){
                    if(data[i+1][p] !== '.' && !data[i+1][p].match(/\d/g)){
                        isPartNumber = true;
                        break;
                    }
                }
            }
            if(isPartNumber){
                var partNumber = parseInt(numberString);
                sum+=partNumber;
            }
            j+=numberLength-1;
        }
    }
    return sum;
},0)

console.log("Part 1: " + part1);

function getNumber(data,rowIndex,columnIndex){
    var number = data[rowIndex][columnIndex];
    var row = data[rowIndex];
    for(var i = columnIndex-1; i >=0 ; i--){
        if(row[i].match(/\d/)){
            number = row[i].concat(number);
        }else{
            break;
        }
    }
    for(var i = columnIndex+1; i < row.length; i++){
        if(row[i].match(/\d/)){
            number = number.concat(row[i]);
        }else{
            break;
        }
    }
    return parseInt(number);
}

var part2 = data.reduce((sum,row, i) => {
    let gearIndices = []
    let startIndex = 0;
    while(true) {
        let gearIndex = row.indexOf('*',startIndex);
        if(gearIndex > 0){
            gearIndices.push(gearIndex);
            startIndex=gearIndex+1;
        }else{
            break;
        }
    }
    gearIndices.forEach(gear => {
        var adjacentNumbers = []
        //Above?
        if(i !== 0){
            let digitIndexInSlice = data[i-1].slice(gear-1,gear+2).search(/\d/);
            if(digitIndexInSlice >= 0){
                var digitRowIndex = digitIndexInSlice + gear - 1;
                adjacentNumbers.push(getNumber(data,i-1,digitRowIndex));
                if(digitIndexInSlice === 0 && data[i-1][digitRowIndex+1].match(/\D/) && data[i-1][digitRowIndex+2].match(/\d/)){
                    adjacentNumbers.push(getNumber(data,i-1,digitRowIndex+2));
                }
            }
        }
        //Next to?
        if(gear !== 0){
            if(row[gear-1].match(/\d/)){
                adjacentNumbers.push(getNumber(data,i,gear-1));
            }
        };
        if(gear !== row.length-1){
            if(row[gear+1].match(/\d/)){
                adjacentNumbers.push(getNumber(data,i,gear+1));
            }
        }
        //Below?
        if(i !== data.length-1){
            let digitIndexInSlice = data[i+1].slice(gear-1, gear+2).search(/\d/);
            if(digitIndexInSlice >= 0){
                var digitRowIndex = digitIndexInSlice + gear - 1;
                adjacentNumbers.push(getNumber(data,i+1,digitRowIndex));
                if(digitIndexInSlice === 0 && data[i+1][digitRowIndex+1].match(/\D/) && data[i+1][digitRowIndex+2].match(/\d/)){
                    adjacentNumbers.push(getNumber(data,i+1,digitRowIndex+2));
                }
            }
        }
        if(adjacentNumbers.length === 2){
            console.log("Row: " + i + " Column: " + gear + " Adj Nums: " + adjacentNumbers);
            sum+=adjacentNumbers.reduce((acc, x)=>acc*x, 1);
        }
    })

    return sum;
},0)

console.log("Part 2: " + part2);