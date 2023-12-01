// Make sure we got a filename on the command line.
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

var answer = data.map((x) => {
    if(x.length < 1){
        return 0;
    }
    let firstDigit = null;
    let lastDigit = null;
    for ( var i = 0; i < x.length; i++){
        const char = x[i];
        if(char >= '0' && char <= '9'){
            if(!firstDigit){
                firstDigit = char;
            }
            lastDigit = char;
        }
    }
    if(!firstDigit || !lastDigit){
        console.log("Fail: " + x);
        return 0;
    }
    return parseInt(firstDigit.concat(lastDigit));
}).reduce((sum, x) => sum + x);

console.log(answer);
return 0;