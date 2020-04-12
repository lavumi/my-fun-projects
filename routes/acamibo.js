var express = require('express');
var router = express.Router();
var mysql = require('mysql');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('acamibo', { title: 'Lavumi Animal Crossing Amibo' });
});

module.exports = router;

console.log("testtest");



var connection = mysql.createConnection({
    host  : 'localhost',
    user : 'lavumi',
    password : 'cagesong',
    database : 'ac_amibo'
})


router.get('/get', function(req,res,next){
    connection.query('SELECT * FROM card', function(err, result, fileds){
        if(err)
            console.log(err);
        else{
            res.render('create', {
                results: result
            });
        }
    });
});
// connection.connect();



// connection.end();