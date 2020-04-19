console.log('rankingSystem loaded');

var rankingDataFormat = {
    name : null,
    score : null,
};

var _rankingData = [];

var _updateQueue = [];

function _updateRanking( _name, _score ){
    _rankingData.push({name : _name, score : _score});
    _rankingData.sort(    function(a,b){
        return b.score - a.score;
    });
    if( _rankingData.length > 100)
        _rankingData.pop();
};

function _queueUpdte(name, score){
    if( typeof score !=='number' )
        return;
    var cutName = name.substr(0,3);

    _updateQueue.push( _updateRanking.bind(this, cutName, score));
}

function _runQueue(){
    var nextQueue = _updateQueue.shift();
    nextQueue();
}

function _getRank(){
    return JSON.parse( JSON.stringify(_rankingData ));
}


exports.setScore = _queueUpdte;
exports.getRank = _getRank;
exports.run = _runQueue;