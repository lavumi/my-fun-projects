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

      console.log( querystring );
      connection.query(querystring, function (err, result, fileds) {
        returnValue = JSON.parse(JSON.stringify(result))
        console.log( returnValue );
      });
    });
  });
}

function requestByAuthor(author) {

}


function requestNew(res) {
  querystring = 'SELECT * FROM comicData ORDER BY _index DESC LIMIT 0'

  connection.query(querystring, function (err, result, fileds) {
    var returnValue = JSON.parse(JSON.stringify(result))
    console.log( returnValue);
    if (err)
      console.log(err);
    else {
      res.render('comicEro', {
        title: 'Helltaker',
        results: result
      });
    }
  })
}

/* GET home page. */
router.get('/', function (req, res, next) {
  // fs.readdir('./public/symComicData', (err, file_list) => { 
  //   res.render('comicBook', { title: 'Express' , fileList : file_list});
  // });

  requestNew(res);
//  requestByTag(res, true, "blowjob");
});

module.exports = router;
