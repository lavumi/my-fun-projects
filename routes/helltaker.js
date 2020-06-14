var express = require('express');
var router = express.Router();
var fs = require('fs');
var mysql = require('mysql');



var connection = mysql.createConnection({
  host: 'lavumi.iptime.org',
  user: 'mangaManager',
  password: '1q2w3e4r',
  database: 'manga',
  port: '13306'
})


var baseFolder = './public/symComicData/'

function requestByTag(res, female, tag) {
  querystring = "SELECT _index FROM tag WHERE _desc = '" + tag + "'"
  connection.query(querystring, function (err, result, fileds) {
    var returnValue = JSON.parse(JSON.stringify(result))[0]._index
    querystring = "SELECT comicIdx FROM tagBridge WHERE tagIdx = '" + returnValue + "'";
    if (female === true) {
      querystring += " and female = 1"
    }
    else {
      querystring += " and female = 0"
    }

    connection.query(querystring, function (err, result, fileds) {
      returnValue = JSON.parse(JSON.stringify(result))
      querystring = "SELECT * FROM comicData WHERE "
      returnValue.forEach(element => {
        querystring += " _index = " + element.comicIdx
        querystring += " OR"
      });

      querystring += " true = true"

      console.log(querystring);
      connection.query(querystring, function (err, result, fileds) {
        res.render('bookshelf', {
          title: 'Helltaker',
          results: result
        });
      });
    });
  });
}

function requestByAuthor(author) {

}


function requestNew(res) {
  querystring = 'SELECT * FROM comicData ORDER BY _index DESC LIMIT 10'

  connection.query(querystring, function (err, result, fileds) {
    var returnValue = JSON.parse(JSON.stringify(result))
    console.log(returnValue);
    if (err)
      console.log(err);
    else {
      res.render('bookshelf', {
        title: 'Helltaker',
        results: result
      });
    }
  })
}

/* GET home page. */
router.get('/', function (req, res, next) {
  if (req.query._index !== undefined) {
    fs.readdir(baseFolder + req.query._index + '/', (err, file_list) => {
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
  if( req.body.input === "cagesong1"){
    requestNew( res );
    //requestByTag(res , 1 , 'ahegao');
  }
  else {
   // res.send( { come : 'json'});
    res.render('helltaker', {
      title: 'Helltaker'
    });
  }

});





module.exports = router;
