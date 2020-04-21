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
    if( _rankingData.length > 6)
        _rankingData.pop();
};

function _queueUpdte(name, score){
    if( typeof score !=='number' )
        return;
    var cutName = name.substr(0,3);

    _updateQueue.push( _updateRanking.bind(this, cutName, score));
}

function _runQueue(){
    if( _updateQueue.length > 0 ){
        var nextQueue = _updateQueue.shift();
        nextQueue();
    }
    else{
        return;
    }
    if( _updateQueue.length > 0 ){
        _runQueue();
    }
    else {
        return;
    }
}

function _getRank(){
    return JSON.parse( JSON.stringify(_rankingData ));
}



module.exports = function(io){
    io.on('connection', function(socket){

       // io.emit('update_rank', _getRank());

        socket.on("set_score", function(data){
            _queueUpdte( data.name, data.score);
            _runQueue();
            io.emit('update_rank', _getRank());
        });
      
        socket.on('disconnect', function(){
          console.log('user disconnected');
        });
      })
}

exports.setScore = _queueUpdte;
exports.getRank = _getRank;
exports.run = _runQueue;