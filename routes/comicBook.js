var express = require('express');
var router = express.Router();
var fs = require('fs');



/* GET home page. */
router.get('/', function(req, res, next) {
  fs.readdir('./public/symComic', (err, file_list) => { 
    res.render('comicBook', { title: 'Express' , fileList : file_list});
  });

});

module.exports = router;
