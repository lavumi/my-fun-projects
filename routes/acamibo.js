var express = require('express');
var router = express.Router();
var mysql = require('mysql');

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('acamibo', { title: 'Lavumi Animal Crossing Amibo' });
// });



var connection = mysql.createConnection({
    host: 'lavumi.iptime.org',
    user: 'development',
    password: '1q2w3e',
    database: 'ac_amibo_dev',
    port: '13306'
})


router.get('/', function (req, res) {
    res.render('acamibo', {
        title: 'Lavumi Animal Crossing Amibo',
        results: []
    });
    // connection.query('SELECT * FROM villager;'
    //     , function (err, result, fileds) {
    //         if (err)
    //             console.log(err);
    //         else {
    //             res.render('acamibo', {
    //                 title: 'Lavumi Animal Crossing Amibo',
    //                 results: []
    //             });
    //         }
    //     });
});

var selectquery = function (species, gender, personality, res) {

    var querystring = 'SELECT * FROM villager';
    if (species != -1 || gender >= 0 || personality >= 0) {
        querystring += ' where';
    }
    var prefix = false;
    if (species != -1) {
        querystring += ' species=\'' + species + '\'';
        prefix = true;
    }

    if (gender != -1 ) {
        if (prefix === true)
            querystring += ' and';
        querystring += ' gender=' + gender;
        prefix = true;
    }

    if (personality != -1 ) {
        if (prefix === true)
            querystring += ' and';
        querystring += ' personality=' + personality;
    }


    querystring += ';';

    connection.query(querystring, function(err, result, fileds){
        if(err)
            console.log(err);
        else{
            res.render('acamibo', {
                title : 'Lavumi Animal Crossing Amibo' ,
                results: result
            });
        }
    });
};

router.post('/', function (req, res) {
    console.log(req.body);

    selectquery(req.body.species, req.body.gender, req.body.personality, res);
});
module.exports = router;