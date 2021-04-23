var fs = require('fs')
var unzipper = require('unzipper')
fs.createReadStream('pal.zip').pipe(unzipper.Extract({ path: './' }));