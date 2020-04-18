var Ranking = function(){
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
        var cutName = name.splice(0,3);

        _updateQueue.push( _updateRanking(cutName, score));
    }

    function _runQueue(){
        var nextQueue = _updateQueue.slice();
        nextQueue();
    }

    function _gerRank(){
        return JSON.parse( JSON.stringify(_rankingData ));
    }


    return {
        setScore : _queueUpdte,
        getRank : _getRank
    }
};