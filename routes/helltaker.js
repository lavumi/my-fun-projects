//todo list
//1. 제목 변경 기능 꼭 넣어야겠다
//2. 페이지 삭제 기능
//3. 다른 포트로 넘기자


var express = require('express');
var router = express.Router();
var fs = require('fs');
var mysql = require('mysql');
var path = require('path');



var connection = mysql.createConnection({
  host: 'lavumi.iptime.org',
  user: 'mangaManager',
  password: '1q2w3e4r',
  database: 'manga',
  port: '13306'
})


var tagList;
connection.query("SELECT _desc FROM tag ORDER BY _desc" , function(err, tagResult){
  tagList = tagResult;
})

var baseFolder = '../public/symComicData/'

function requestByTag(res, tag) {
  querystring = "SELECT _index FROM tag WHERE _desc = '" + tag + "'"
  connection.query(querystring, function (err, result, fileds) {
    var returnValue = JSON.parse(JSON.stringify(result))[0]._index
    querystring = "SELECT comicIdx FROM tagBridge WHERE tagIdx = '" + returnValue + "'";


    connection.query(querystring, function (err, result, fileds) {
      returnValue = JSON.parse(JSON.stringify(result))
      querystring = "SELECT * FROM comicData WHERE "
      returnValue.forEach(element => {
        querystring += " _index = " + element.comicIdx
        querystring += " OR"
      });

      querystring += " false = true"
      connection.query(querystring, function (err, result, fileds) {
        res.render('bookshelf', {
          title: 'Helltaker',
          results: result,
          tagResult : tagList
        });
      });
    });
  });
}

function getTagList( cb ){
  querystring = "SELECT _desc FROM tag";
  connection.query(querystring , function(err, result){
    cb(result);
  })
}

function requestByAuthor(author) {

}


function requestNew(res) {
  querystring = 'SELECT * FROM comicData ORDER BY _index DESC LIMIT 30'
  var newList;
  connection.query(querystring, function (err, newResult, fileds) {
    newList = newResult;
    res.render('bookshelf', {
      title: 'Helltaker',
      results: newList,
      tagResult : tagList
    });
  })
}

/* GET home page. */
router.get('/', function (req, res, next) {
  if (req.query._index !== undefined) {
    console.log("get comicbook querry : ", __dirname, baseFolder , req.query._index );

    fs.readdir(path.join(__dirname,baseFolder , req.query._index ), (err, file_list) => {
      console.log(err, file_list);
      if (err) {
        res.render('error');
      }
      else {
        res.render('comicBook', {
          title: 'Helltaker',
          _index: req.query._index,
          _fileList: file_list
        });
      }
    });
  }
  else {
    //requestNew(res);
    res.render('helltaker', {
      title: 'Helltaker',
    });
  }
});


router.post('/', function (req, res) {
  console.log( JSON.stringify(req.body));

  if( !!req.body.tag === true ){

    requestByTag(res,req.body.tag );
  }
  else if( req.body.input === "cagesong"){
    requestNew( res );
  }
  else {
   // res.send( { come : 'json'});
    res.render('helltaker', {
      title: 'Helltaker'
    });
  }

});





module.exports = router;
