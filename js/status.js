var Status = tm.createClass({
    init: function(){


    }
});

tm.util.DataManager.set("user-data", {
    time: 0,
    score: 0,
    level : 1,
    touchCount: 0,
    touchTotalCount:0
});

tm.util.DataManager.set("game-data", {
    whiteStone: 0,
    goalStone:0,
    timeUp: 0,
    gameOver: false
});