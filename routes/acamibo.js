var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('acamibo', { title: 'Lavumi Animal Crossing Amibo' });
});

module.exports = router;


var mysql = require('mysql');

var connection = mysql.createConnection({
    host  : 'localhost',
    user : 'lavumi',
    password : 'cagesong',
    database : 'ac_amibo'
})

connection.connect();

connection.query('SELECT * FROM card', function(err, result, fileds){
    if(err)
        console.log(err);
    else
        console.log( result , fileds );
})

connection.end();