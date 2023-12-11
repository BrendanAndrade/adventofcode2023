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

var galaxies = data.reduce((acc, row, i)=>{
    return acc.concat(row.reduce((ac, item, j)=>{
        if(item === '#'){
            ac.push([i,j]);
        }
        return ac;
    },[]))
},[])

var xIndexs = galaxies.map(galaxy=>galaxy[1]).filter((v,i,a)=>a.indexOf(v)===i).sort();
var yIndexs = galaxies.map(galaxy=>galaxy[0]).filter((v,i,a)=>a.indexOf(v)===i).sort();

var emptyX = [];
for(var i = 0; i < data[0].length; i++){
    if(!xIndexs.includes(i)){
        emptyX.push(i);
    }
}
var emptyY = [];
for(var i = 0; i < data.length; i++){
    if(!yIndexs.includes(i)){
        emptyY.push(i);
    }
}

console.log(galaxies[galaxies.length-1]);

emptyX.reverse().forEach(x => {
    galaxies.forEach(galaxy=>{
        if(galaxy[1] > x){
            galaxy[1]+= 999999;
        }
    })
})

emptyY.reverse().forEach(y => {
    galaxies.forEach(galaxy=>{
        if(galaxy[0] > y){
            galaxy[0]+= 999999;
        }
    })
})

var part1 = galaxies.reduce((acc, galaxy, i)=>{
    for(var j = i+1; j < galaxies.length; j++){
        acc = acc + Math.abs(galaxies[j][0] - galaxy[0]) + Math.abs(galaxies[j][1]-galaxy[1]);
    }
    return acc
},0)

console.log("Part 1: " + part1);