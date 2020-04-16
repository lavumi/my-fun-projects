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


router.get('/test', function (req, res) {
    res.send('test');
});

// connection.connect();
// connection.end();

var selectquery = function (species, gender, personality, res) {

    var querystring = 'SELECT * FROM villager';
    if (species != '-' || gender >= 0 || personality >= 0) {
        querystring += ' where';
    }
    var prefix = false;
    if (species != '-' && species != '') {
        querystring += ' species=\'' + species + '\'';
        prefix = true;
    }

    if (gender >= 0) {
        if (prefix === true)
            querystring += ' and';
        querystring += ' gender=' + gender;
        prefix = true;
    }

    if (personality >= 0) {
        if (prefix === true)
            querystring += ' and';
        querystring += ' personality=' + personality;
    }


    querystring += ';';

    console.log(querystring);

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

    var species = req.body.species;
    var gender;
    if (req.body.gender === "-" || req.body.gender === "") {
        gender = -1;
    }
    else if (req.body.gender === "남") {
        gender = 0;
    }
    else if (req.body.gender === "여") {
        gender = 1;
    }

    var personality;
    if (req.body.personality === "-" || req.body.personality === "") {
        personality = -1;
    }
    else if (req.body.personality === "먹보") {
        personality = 0;
    }
    else if (req.body.personality === "운동광") {
        personality = 1;
    }
    else if (req.body.personality === "무뚝뚝") {
        personality = 2;
    }
    else if (req.body.personality === "느끼함") {
        personality = 3;
    }
    else if (req.body.personality === "친절함") {
        personality = 4;
    }
    else if (req.body.personality === "아이돌") {
        personality = 5;
    }
    else if (req.body.personality === "성숙함") {
        personality = 6;
    }
    else if (req.body.personality === "단순활발") {
        personality = 7;
    }
    selectquery(species, gender,personality, res);
});
module.exports = router;