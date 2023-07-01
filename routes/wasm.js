var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('wasmEngine', null);
});




// rank.setScore("aaa", 111);
// rank.setScore("aaa", 112);
// rank.setScore("aaa", 113);
// rank.setScore("aaa", 115);
// rank.run();

// console.log( rank.getRank());
module.exports = router;