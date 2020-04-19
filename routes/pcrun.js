var express = require('express');
var rank = require('./server/rankingSystem');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('pcrun', { title: 'Express' });
});

module.exports = router;