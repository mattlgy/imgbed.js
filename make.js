var browserify = require('browserify')
  , fs         = require('fs')
  , outFile    = fs.createWriteStream('./imgbed.js')
  , b          = browserify('./index.js', {
      standalone : 'Imgbed'
    })
  ;

b.bundle().pipe(outFile);
