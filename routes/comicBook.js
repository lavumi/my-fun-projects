var express = require('express');
var router = express.Router();
var fs = require('fs');
var mysql = require('mysql');



var connection = mysql.createConnection({
  host: 'localhost',
  user: 'mangaManager',
  password: '1q2w3e4r',
  database: 'manga',
  port: '13306'
})



function requestByTag( res, tag ){
  querystring = "SELECT _index FROM tag WHERE _desc = " + tag

  connection.query(querystring, function(err, result, fileds){
    if(err)
        console.log(err);
    else{
        res.render('comicEro', {
            title : 'Eroero' ,
            results: result
        });
    }
  });

}

function requestByAuthor( author ){

}


function requestNew(res){
  querystring = 'SELECT * FROM comicData ORDER BY _index DESC LIMIT 10'

  connection.query(querystring, function(err, result, fileds){
    if(err)
        console.log(err);
    else{
        res.render('comicEro', {
            title : 'Eroero' ,
            results: result
        });
    }
  })
}

/* GET home page. */
router.get('/', function(req, res, next) {
  // fs.readdir('./public/symComicData', (err, file_list) => { 
  //   res.render('comicBook', { title: 'Express' , fileList : file_list});
  // });

  requestNew(res);
});

module.exports = router;
