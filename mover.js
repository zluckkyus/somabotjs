var fs = require('fs')

var oldPath = 'pal'
var newPath = 'commands/pal'

fs.rename(oldPath, newPath, function (err) {
  if (err) throw err
  console.log('Successfully renamed - AKA moved!')
})