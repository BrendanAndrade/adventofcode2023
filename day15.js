if (process.argv.length < 3) {
    console.log('Usage: node ' + process.argv[1] + ' FILENAME');
    process.exit(1);
}
// Read the file and print its contents.
var fs = require('fs')
    , filename = process.argv[2];


try{
    var data = fs.readFileSync(filename, 'utf8').toString().replace(/(\r\n|\n|\r)/gm, "").split(",");
}catch(e){
    console.log("Error: ", e.stack);
}

var part1 = data.reduce((acc,step)=>{
    var value = 0;
    for(var i = 0; i < step.length; i++){
        value += step.charCodeAt(i);
        value = (value*17) % 256;
    }
    return acc + value;
},0)

console.log("Part 1: " + part1);

var boxes = [...Array(256)].map(e=>Array());

data.forEach(step => {
    var isDash = step.indexOf('-') !== -1;
    step = step.split(/-|=/);
    var boxId = 0;
    for(var i = 0; i < step[0].length; i++){
        boxId += step[0].charCodeAt(i);
        boxId = (boxId*17) % 256;
    }
    var currentIndex = boxes[boxId].findIndex(item => item.label === step[0]);
    if(isDash && currentIndex >= 0){
        boxes[boxId].splice(currentIndex,1);
    }else if(!isDash && currentIndex < 0){
        boxes[boxId].push({label: step[0], focal: step[1]});
    }else if(!isDash){
        boxes[boxId][currentIndex] = {label: step[0], focal: step[1]};
    }
});

var part2 = boxes.reduce((acc, box, i)=>{
    return acc + box.reduce((ac, step, j)=>{
        return ac + (i+1)*(j+1)*step.focal;
    },0)
},0)

console.log("Part 2: " + part2);
