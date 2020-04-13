var express = require('express');
var router = express.Router();
var mysql = require('mysql');

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('acamibo', { title: 'Lavumi Animal Crossing Amibo' });
// });

module.exports = router;

//console.log("testtest");



var connection = mysql.createConnection({
    host  : 'lavumi.iptime.org',
    user : 'development',
    password : '1q2w3e',
    database : 'ac_amibo_dev',
    port : '13306'
})


router.get('/', function(req,res,next){
    connection.query('SELECT * FROM card', function(err, result, fileds){
        if(err)
            console.log(err);
        else{
            res.render('acamibo', {
                title : 'Lavumi Animal Crossing Amibo' ,
                results: result
            });
        }
    });
});
// connection.connect();



// connection.end();