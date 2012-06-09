tm.util.DataManager.set("user-data", {
    time: 0,
    score: 0,
    level : 1,
    touchCount: 0,
    touchTotalCount:0
});

tm.util.DataManager.set("game-data", {
    time: 30*30,
    maxTime: 0,
    whiteStone: 0,
    goalStone:0,
    timeUp: 0,
    gameOver: false,
    mode: "titleReady"
});

/**
 * ステータスのラベル
 */
var StatusLabel = tm.createClass({
    superClass: tm.app.Label,
 
    init: function(x, y, size){
        this.superInit(128, 128);
        this.x = x;
        this.y = y;
        this.size = size;
        this.text = 0;
        this.align = "end";
        this.baseline = "top";
        this.width = app.width;
    },
 
    update: function(){
    }
});