// リソースの読み込み
tm.preload(function() {
    tm.graphics.TextureManager.add("whiteStone", "img/whiteStone.png");
    tm.graphics.TextureManager.add("blackStone", "img/blackStone.png");
});

var MAX_WIDTH = 8;
var MAX_HEIGHT = 8;
var currentSize = {
    "width": 0,
    "height": 0
};

tm.main(function(){
    app = tm.app.CanvasApp("#world");
    app.background = "black";

    // グローバルな値の初期化
    var timer = 0;
    var gameOver = false;

    // シーンの生成
    var startScene = tm.app.StartScene();
    var mainScene = tm.app.Scene();
    var endScene = tm.app.EndScene();
    startScene.onmousedown = null;

    app.replaceScene(startScene);

    // 石
    stone = new Array();
    for(var i = 0; i < MAX_WIDTH; i++){
        stone[i] = new Array();
        for(var j = 0; j < MAX_HEIGHT; j++){
            stone[i][j] = Stone(i, j);
            mainScene.addChild(stone[i][j]);
        }
    }

    // 石の初期化
    initBoard();

    startScene.update = function(){
        app.replaceScene(mainScene);
    };

    mainScene.update = function(app) {
        ++timer;

        if(app.pointing.getPointingStart()){
        }

        if(timer % 60 == 0){
            //gameOver = true;
        }
        else if(gameOver == true){
            gameOver = false;
            app.replaceScene(endScene);
        }
    };

    endScene.update = function(){
        if(app.pointing.getPointingStart()){
            app.replaceScene(startScene);
        }
    };

    app.run();
});

/**
 * 石の配置初期化
 */
function initBoard(){
    currentSize.width = Math.rand(4, MAX_WIDTH);
    currentSize.height = Math.rand(4, MAX_HEIGHT);

    for(var i = 0; i < MAX_WIDTH; i++){
        for(var j = 0; j < MAX_HEIGHT; j++){
            stone[i][j].visible = false;
        }
    }

    for(var i = 0; i < currentSize.width; i++){
        for(var j = 0; j < currentSize.height; j++){
            stone[i][j].color = Math.rand(0,1);
            stone[i][j].visible = true;
        }
    }
}

/**
 * 石
 */
var Stone = tm.createClass({
    superClass: tm.app.CanvasElement,

    init: function(x, y){
        this.superInit();
        this.iter = {
            "i":x,
            "j":y
        };
        this.width = this.height = 94;

        this.x = this.width/2 * (x+1);
        this.y = this.height/2 * (y+1);

        this.color = Math.rand(0,1);

        this.sprite = tm.app.Sprite(this.width, this.height);
        this.sprite.scaleX = this.sprite.scaleY = 0.5;
        this.addChild(this.sprite);

        console.log("aaa W:H{0}:{1}, iter[{2}][{3}]".format(this.width, this.height, this.iter.i, this.iter.j));
    },

    update: function(){
        if( this.color == 0 ){ this.sprite.setImage( tm.graphics.TextureManager.get("whiteStone") ); }
        else if( this.color == 1 ){ this.sprite.setImage( tm.graphics.TextureManager.get("blackStone") ); }

        if(this.sprite.isHitPoint(app.pointing.x, app.pointing.y) == true && app.pointing.getPointingEnd() == true && this.visible == true){
            console.log("Hit! [{0}][{1}]".format(this.iter.i, this.iter.j));
            var anotherColor = 0;
            if( this.color = 0 ){ anotherColor = 1; }
        }
    }
});