var fs = require('fs');

var file = 'ranking';

var backupDelay = 1000 * 60 * 60;
var rankingDataFormat = {
    name: null,
    score: null,
};

// console.log("__dirname : " , __dirname);
var _rankingData = JSON.parse(fs.readFileSync(__dirname + "/" + file, 'utf8'));
var _updateQueue = [];

function _updateRanking(_name, _score) {
    _rankingData.push({ name: _name, score: _score });
    _rankingData.sort(function (a, b) {
        return b.score - a.score;
    });
    if (_rankingData.length > 6) {
        _rankingData.pop();

    }
};

function _queueUpdte(name, score) {
    if (typeof score !== 'number')
        return;
    var cutName = name.substr(0, 3);

    _updateQueue.push(_updateRanking.bind(this, cutName, score));
}

function _runQueue() {
    if (_updateQueue.length > 0) {
        var nextQueue = _updateQueue.shift();
        nextQueue();
    }
    else {
        return;
    }
    if (_updateQueue.length > 0) {
        _runQueue();
    }
    else {
        return;
    }
}

function _getRank() {
    return JSON.parse(JSON.stringify(_rankingData));
}

function _backup() {
    fs.writeFileSync(__dirname + "/" + file, JSON.stringify(_rankingData), 'utf8');
    //console.log( "RankingData Backup : " + JSON.stringify(_rankingData) );
    setTimeout(_backup, backupDelay);
}


function _checkRank(_score) {

    for (var i = 0; i < _rankingData.length; i++) {
        if (_rankingData[i].score < _score)
            return i;
    }

    return -1;
}

function _load() {

}

setTimeout(_backup, backupDelay);



module.exports = function (io) {
    io.on('connection', function (socket) {

        socket.emit('update_rank', _getRank());

        socket.on('checkRank', function (score) {
            var checkrank = _checkRank(score);
            socket.emit("returnRank", checkrank);
        });

        socket.on("set_score", function (data) {
            _queueUpdte(data.name, data.score);
            _runQueue();
            io.emit('update_rank', _getRank());
        });

        socket.on('disconnect', function () {
            console.log('user disconnected');
        });
    })
}

exports.setScore = _queueUpdte;
exports.getRank = _getRank;
exports.run = _runQueue;
