// リソースの読み込み
tm.preload(function() {
    tm.graphics.TextureManager.add("whiteStone", "img/whiteStone.png");
    tm.graphics.TextureManager.add("blackStone", "img/blackStone.png");
    tm.graphics.TextureManager.add("statusImage", "img/status.png");
    tm.graphics.TextureManager.add("gameBackground", "img/game_bg.png");
    tm.graphics.TextureManager.add("resultBackground", "img/result_bg.png");
    tm.graphics.TextureManager.add("resultText", "img/result_text.png");
});

var waveImage = (function(){
    var c = tm.graphics.Canvas();
    c.width = c.height = 128;
    c.setTransformCenter();
    c.setColorStyle("white", "rgb(30, 80, 150)");
    c.fillCircle(0, 0, 100);

    return c;
})();

var waveImage2 = (function(){
    var c = tm.graphics.Canvas();
    c.width = c.height = 128;
    c.setTransformCenter();
    c.setColorStyle("white", "rgb(30, 30, 30)");
    c.fillCircle(0, 0, 100);

    return c;
})();

var MAX_WIDTH = 8;
var MAX_HEIGHT = 8;
var currentSize = {
    "width": 0,
    "height": 0
};

tm.main(function(){
    app = tm.app.CanvasApp("#world");
    app.background = "black";

    var gameOver = false;
    touchCount = 0;

    // シーンの生成
    var startScene = tm.app.StartScene();
    var mainScene = tm.app.Scene();
    var endScene = tm.app.Scene();
    startScene.onmousedown = null;

    app.replaceScene(startScene);

    // バックグラウンド画像
    var gameBackground = tm.app.Sprite(640, 960);
    gameBackground.scaleX = gameBackground.scaleY = 0.75;
    gameBackground.setImage( tm.graphics.TextureManager.get("gameBackground") );
    gameBackground.position.set(240, 360);
    //mainScene.addChild(gameBackground);

    // リザルトのバックグラウンド画像
    var resultBackground = tm.app.Sprite(640, 960);
    resultBackground.scaleX = resultBackground.scaleY = 0.75;
    resultBackground.setImage( tm.graphics.TextureManager.get("resultBackground") );
    resultBackground.position.set(240, 360);
    //endScene.addChild(resultBackground);

    var resultText = tm.app.Sprite(640, 960);
    resultText.scaleX = resultText.scaleY = 0.75;
    resultText.setImage( tm.graphics.TextureManager.get("resultText") );
    resultText.position.set(240, 360);
    endScene.addChild(resultText);

    // タイマーの生成
    var timer = Timer();
    mainScene.addChild(timer);

    // ステータス
    var statusImage = tm.app.Sprite(640, 120);
    statusImage.scaleX = statusImage.scaleY = 0.75;
    statusImage.setImage(tm.graphics.TextureManager.get("statusImage"));
    statusImage.position.set(240,60);
    mainScene.addChild(statusImage);

    // ステータスのラベル
    levelLabel = StatusLabel(260, 35, 32);

    scoreLabel = StatusLabel(260, 70, 24);

    whiteStoneLabel = StatusLabel(360, 60, 32);
    mainScene.addChild(whiteStoneLabel);

    goalStonesLabel = StatusLabel(450, 60, 32);
    mainScene.addChild(goalStonesLabel);

    touchCountLabel = StatusLabel(380, 240, 48);
    endScene.addChild(touchCountLabel);

    // 石の生成
    stone = [];
    for(var i = 0; i < MAX_WIDTH; i++){
        stone[i] = [];
        for(var j = 0; j < MAX_HEIGHT; j++){
            stone[i][j] = Stone(i, j);
            mainScene.addChild(stone[i][j]);
        }
    }

    startScene.update = function(){
        // 色々リセット
        timer.width = 480;
        touchCountLabel.text = 0;

        levelLabel.text = 1;
        levelLabel.size = 32;
        levelLabel.position.set(260, 30);
        mainScene.addChild(levelLabel);

        scoreLabel.text = 0;
        scoreLabel.size = 24;
        scoreLabel.position.set(260, 70);
        mainScene.addChild(scoreLabel);

        // 石の初期化
        initBoard();

        app.replaceScene(mainScene);
    };

    mainScene.update = function(app) {

        if(timer.timer % timer.limit == 0){
            gameOver = true;
        }
        else if(gameOver == true){
            gameOver = false;

            levelLabel.size = 48;
            levelLabel.position.set(380, 170);
            endScene.addChild(levelLabel);

            scoreLabel.size = 64;
            scoreLabel.position.set(260, 480);
            endScene.addChild(scoreLabel);

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

    getMargin();

    goalStonesLabel.text = Math.rand(0, currentSize.width * currentSize.height);    // 目標の白石数

    var margin = getMargin();

    // 石の初期化
    for(var i = 0; i < MAX_WIDTH; i++){
        for(var j = 0; j < MAX_HEIGHT; j++){
            if( i < currentSize.width && j < currentSize.height ){
                stone[i][j].color = Math.rand(0,1);
                stone[i][j].visible = true;
                stone[i][j].setPosition(i, j, margin);
            }
            else{
                stone[i][j].visible = false;
            }
            stone[i][j].alpha = 0;
        }
    }

    setTotalWhiteStone();
    showBoard(0);
}

/**
 * 白石の総数をセット
 */
function setTotalWhiteStone(){
    whiteStoneLabel.text = 0;
    for(var i = 0; i < currentSize.width; i++){
        for(var j = 0; j < currentSize.height; j++){
            if(stone[i][j].color == 0){ ++whiteStoneLabel.text; }
        }
    }
}

/**
 * コンソールに盤面を表示
 */
function showBoard(all){
    var w = 0, h = 0;
    if(all == 0){ w = currentSize.width; h = currentSize.height; }
    else{ w = MAX_WIDTH; h = MAX_HEIGHT; }

    var debugStr = "";
    for(var i = 0; i < h; i++){
        for(var j = 0; j < w; j++){
            if(stone[j][i].color == 0){ debugStr += "["+j+"]"+"["+i+"]"+"□ | "; }
            else if(stone[j][i].color == 1){ debugStr += "["+j+"]"+"["+i+"]"+"■ | "; }
            else{ debugStr += "["+j+"]"+"["+i+"]"+stone[j][i].color+" | "; }
        }
        debugStr += "\n";
    }

    console.log(debugStr, "\n");
}

/**
 * 中央揃えのためのマージンを取得
 */
function getMargin(){
    var marginW = (app.width - (stone[0][0].width / 2) * currentSize.width) / 2;

    return marginW;
}

/**
 * タッチ数からスコアの倍率を取得
 */
function getScoreFromTouchCount(tc){
    var iter = tc-1;
    if(tc-1 > 10){ iter = 10; }

    var magnification = new Array(10,10,9,9,9,8,8,7,7,6,5);

    return magnification[iter];
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

        this.x = 0;
        this.y = 0;

        this.color = Math.rand(0,1);

        this.sprite = tm.app.Sprite(this.width, this.height);
        this.sprite.scaleX = this.sprite.scaleY = 0.5;
        this.addChild(this.sprite);

        //console.log("W:H{0}:{1}, iter[{2}][{3}]".format(this.width, this.height, this.iter.i, this.iter.j));
    },

    update: function(){
        if( this.color == 0 ){ this.sprite.setImage( tm.graphics.TextureManager.get("whiteStone") ); }
        else if( this.color == 1 ){ this.sprite.setImage( tm.graphics.TextureManager.get("blackStone") ); }

        if(this.alpha < 1){ this.alpha += 0.05; }

        if(this.sprite.isHitPoint(app.pointing.x, app.pointing.y) == true && app.pointing.getPointingEnd() == true && this.visible == true){
            console.log("Hit! [{0}][{1}]".format(this.iter.i, this.iter.j));
            var reverseTotal = this.reverseStoneManager( this.iter.i, this.iter.j );
            if(reverseTotal){
                setTotalWhiteStone();
                console.log("w{0},h{1}, pos{2},{3}:{4}, White{5}, Goal{6}".format(currentSize.width, currentSize.height, this.iter.i, this.iter.j, this.color, whiteStoneLabel.text, goalStonesLabel.text));
                console.log("Total:", reverseTotal);
                showBoard(0);

                ++touchCount;
                ++touchCountLabel.text;

                scoreLabel.text += 30*reverseTotal*getScoreFromTouchCount(touchCount);

                //console.log(30*reverseTotal*getScoreFromTouchCount(touchCount), getScoreFromTouchCount(touchCount));

                // 波紋
                var wave = Wave(this.x, this.y, waveImage);
                wave.timer = 20;
                app.currentScene.addChild(wave);

                // クリアー判定
                if(goalStonesLabel.text == whiteStoneLabel.text){
                    scoreLabel.text += 1000;
                    levelLabel.text += 1;
                    touchCount = 0;
                    initBoard();
                    console.log("Clear! Next Stage{0}".format(levelLabel.text));
                }
            }
        }
    },

    /**
     * 石の位置をリセット
     */
    setPosition: function(x, y, margin){
        this.x = this.width/2 * x + margin + this.width/4;
        this.y = this.height/2 * (y+1) + 160;
    },

    /**
     * 各方向の裏返し処理を呼び出し、裏返した総数を返す
     */
    reverseStoneManager: function(x, y){
        var reverseTotal = 0;
        reverseTotal += this.checkReverseDirection(x, y, -1, 0);    // 上
        reverseTotal += this.checkReverseDirection(x, y, 0, 1);     // 右
        reverseTotal += this.checkReverseDirection(x, y, 1, 0);     // 下
        reverseTotal += this.checkReverseDirection(x, y, 0, -1);    // 左

        reverseTotal += this.checkReverseDirection(x, y, -1, 1);    // 右上
        reverseTotal += this.checkReverseDirection(x, y, 1, 1);     // 右下
        reverseTotal += this.checkReverseDirection(x, y, 1, -1);    // 左下
        reverseTotal += this.checkReverseDirection(x, y, -1, -1);   // 左上

        if( reverseTotal > 0){
            var color = this.color;
            var anotherColor = 0;
            if(color == 0) { anotherColor = 1; }

            this.color = anotherColor;
        }

        return reverseTotal;
    },

    /**
     * 1方向に裏返しチェック
     */
    checkReverseDirection: function(x, y, vx, vy){
        // 壁までの距離
        var range = this.getToRange(x, y, vx, vy);
        //console.log("vec{0},{1}, range{2},{3}".format(vx, vy, range[0], range[1]));

        //!< 裏返す
        if( !(range[1] == 0 && range[0] == 0) ){ return this.reverseStone(x, y, vx, vy, range); }
        return 0;
    },

    /**
     * 壁までの各方向の距離
     */
    getToRange: function(x, y, vx, vy){
        var rangeW = 0;
        var rangeH = 0;

        if(vx == 1) { rangeW = currentSize.height-y-1; }
        else if(vx == -1) { rangeW = y; }
        if(vy == 1) { rangeH = currentSize.width-x-1; }
        else if(vy == -1) { rangeH = x; }

        var range = new Array(rangeW, rangeH);

        return range;
    },

    /**
     * 裏返えし処理
     */
    reverseStone: function(x, y, vx, vy, range){
        var count = 0;
        var anotherColor = 0;
        var color = this.color;
        if(color == 0) { anotherColor = 1; }

        var wall = this.getOptimumRange(vx, vy, range[0], range[1]);
        count = this.getReverseCount(x, y, vx, vy, range, wall, color, anotherColor);

        if( count == 0 ){ return 0; }
        else{
            for(var i = 1; i < wall+1; i++){
                if( stone[x+(i*vy)][y+(i*vx)].color == anotherColor ){ break; }
                stone[x+(i*vy)][y+(i*vx)].color = anotherColor;
                console.log("["+ (x+(i*vy)) + "]" + "[" + (y+(i*vx)) + "], ");

                // 波紋
                var wave = Wave(stone[x+(i*vy)][y+(i*vx)].x, stone[x+(i*vy)][y+(i*vx)].y, waveImage2);
                app.currentScene.addChild(wave);
            }

            return count;
        }
    },

    /**
     * 壁までの距離を方向ごとに調整した値を返す
     */
    getOptimumRange: function(vx, vy, rangeW, rangeH){
        var wall = 0;
        if(rangeH < rangeW) { wall = rangeW; }
        else { wall = rangeH; }
        if( vx != 0 && vy != 0 ){
            if(rangeH < rangeW) { wall = rangeH; }
            else { wall = rangeW; }
        }

        return wall;
    },

    /**
     * 1方向の裏返えした数を返す
     */
    getReverseCount: function(x, y, vx, vy, range, wall, color, anotherColor){
        var count = 0;
        var sameColor = false;

        var debugStr = "";

        for(var i = 1; i < wall+1; i++){
            // 盤面端の場合は離脱
            if( (x+(i*vy)) < 0 ){ break;}
            else if( (y+(i*vx)) < 0 ){ break;}
            else if( (x+(i*vy)) > currentSize.height ){ break;}
            else if( (y+(i*vx)) > currentSize.width ){ break;}

            //debugStr += "["+ (x+(i*vy)) + "]" + "[" + (y+(i*vx)) + "]"/* + ":" + stone[x+(i*vy)][y+(i*vx)].color*/+", ";
            if( stone[x+(i*vy)][y+(i*vx)].color == color ){
                ++count;
            }
            else if( stone[x+(i*vy)][y+(i*vx)].color == anotherColor ){
                sameColor = true;
                break;
            }
            //debugStr += "\n";
        }

        var col = this.color;
        if( col == 0){ col = "■"; }
        else if( col == 1 ){ col = "□"; }
        console.log("v{0},{1}, range{2},{3}, wall:{4}, {5}:{6}, {7}".format(vx, vy, range[0], range[1], wall, col, count, "\n"+debugStr));

        if(sameColor == false || count == 0){ return 0; }
        else{ return count; }
    }
});

/**
 * タイマー
 */
var Timer = tm.createClass({
    superClass: tm.app.CanvasElement,

    init: function(){
        this.superInit();
        this.timer = 1;
        this.limit = 300;
        this.x = 0;
        this.y = 320;
        this.width = 480;
        this.color = "hsla(200, 75%, 50%, 0.90)";
        this.timerSpeed = this.width / this.limit;
    },

    update: function(){
        ++this.timer;
        this.width -= this.timerSpeed;
    },

    draw: function(canvas) {
        canvas.fillStyle = this.color;
        canvas.fillRect(this.x, this.y, this.width, 30);
    }
});

/**
 * ステータス
 */
var StatusLabel = tm.createClass({
    superClass: tm.app.Label,

    init: function(x, y, size){
        this.superInit(128, 128);
        this.x = x;
        this.y = y;
        this.size = size;
        this.text = 0;
        this.align     = "end";
        this.baseline  = "top";
    },

    update: function(){
    }
});

/**
 * 波紋
 */
var Wave = tm.createClass({
    superClass: tm.app.CanvasElement,

    init: function(x, y, img) {
        this.superInit();
        this.x = x;
        this.y = y;
        this.timer = 20;

        var self = this;
        var particle = tm.app.Sprite(64,64);
        particle.setImage(img);
        particle.blendMode = "lighter";
        particle.update = function(){
            this.scaleX += 0.05;
            this.scaleY += 0.05;
            this.alpha = (self.timer/30.0);
        }
        this.addChild(particle);
    },

    update: function(){
        this.timer -= 1;
        if(this.timer <= 0){ this.remove(); }
    }
});