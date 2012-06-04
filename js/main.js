// リソースの読み込み
tm.preload(function() {
	// ゲームシーン中
    tm.graphics.TextureManager.add("whiteStone", "img/whiteStone.png");
    tm.graphics.TextureManager.add("blackStone", "img/blackStone.png");
    tm.graphics.TextureManager.add("stoneFrame", "img/stoneFrame.png");
    tm.graphics.TextureManager.add("gameStatus", "img/gameStatus.png");
    tm.graphics.TextureManager.add("gameBackground", "img/gameBackground.png");

    // タイトル
    tm.graphics.TextureManager.add("titleBackground", "img/titleBackground.png");
    tm.graphics.TextureManager.add("logoCircle", "img/logo/logo_circle.png");
    tm.graphics.TextureManager.add("logoCircle2", "img/logo/logo_circle2.png");
    tm.graphics.TextureManager.add("logoTile", "img/logo/logo_tile.png");
    tm.graphics.TextureManager.add("logoText", "img/logo/logo1.png");
    tm.graphics.TextureManager.add("logoText2", "img/logo/logo1-2.png");
    tm.graphics.TextureManager.add("logoTextReverse", "img/logo/logo2.png");
    tm.graphics.TextureManager.add("logoTextReverse2", "img/logo/logo2-2.png");
    tm.graphics.TextureManager.add("startButton", "img/startButton.png");

    // リザルト
    tm.graphics.TextureManager.add("resultBackground", "img/resultBackground.png");
    tm.graphics.TextureManager.add("resultText", "img/resultText.png");
});

var circleWave = (function(){
    var c = tm.graphics.Canvas();
    c.width = c.height = 256;
    c.setTransformCenter();
    c.setColorStyle("white", "rgb(30, 80, 255)");
    c.strokeCircle(0, 0, 32);

    return c;
})();

var circleWave2 = (function(){
    var c = tm.graphics.Canvas();
    c.width = c.height = 256;
    c.setTransformCenter();
    c.setColorStyle("white", "rgb(255, 255, 255)");
    c.strokeCircle(0, 0, 32);

    return c;
})();


var MAX_WIDTH = 8;
var MAX_HEIGHT = 8;
var currentSize = {
    "width": 0,
    "height": 0
};
var currentScale = 0.75;

tm.main(function(){
    app = tm.app.CanvasApp("#world");
    app.background = "black";
    app.enableStats();
    //app.fitWindow();

    var gameOver = false;
    touchCount = 0;
    var titleFlashing = 1;

    // シーンの生成
    var startScene = tm.app.Scene();
    var mainScene = tm.app.Scene();
    var endScene = tm.app.Scene();
    startScene.onmousedown = null;

    app.replaceScene(startScene);

    // タイトルバックグラウンド画像
    var titleBackground = tm.app.Sprite(640, 960);
    titleBackground.scaleX = titleBackground.scaleY = currentScale;
    titleBackground.setImage( tm.graphics.TextureManager.get("titleBackground") );
    titleBackground.position.set(240, 360);
    startScene.addChild(titleBackground);
    
    // タイトルロゴ
    var logoBackground = tm.app.Sprite(640, 310);
    logoBackground.scaleX = logoBackground.scaleY = currentScale;
    logoBackground.setImage( tm.graphics.TextureManager.get("logoTile") );
    logoBackground.position.set(240, 195);
    startScene.addChild(logoBackground);
    
    var logoCircle2 = tm.app.Sprite(640, 310);
    logoCircle2.scaleX = logoCircle2.scaleY = currentScale;
    logoCircle2.setImage( tm.graphics.TextureManager.get("logoCircle2") );
    logoCircle2.position.set(240, 195);
    startScene.addChild(logoCircle2);
    
    var logoCircle = tm.app.Sprite(640, 310);
    logoCircle.scaleX = logoCircle.scaleY = currentScale;
    logoCircle.setImage( tm.graphics.TextureManager.get("logoCircle") );
    logoCircle.position.set(240, 195);
    startScene.addChild(logoCircle);
    
    var logoText2 = tm.app.Sprite(640, 310);
    logoText2.scaleX = logoText2.scaleY = currentScale;
    logoText2.setImage( tm.graphics.TextureManager.get("logoText2") );
    logoText2.position.set(240, 195);
    startScene.addChild(logoText2);
    
    var logoText = tm.app.Sprite(640, 310);
    logoText.scaleX = logoText.scaleY = currentScale;
    logoText.setImage( tm.graphics.TextureManager.get("logoText") );
    logoText.position.set(240, 195);
    startScene.addChild(logoText);
    
    var logoTextReverse2 = tm.app.Sprite(640, 310);
    logoTextReverse2.scaleX = logoTextReverse2.scaleY = currentScale;
    logoTextReverse2.setImage( tm.graphics.TextureManager.get("logoTextReverse2") );
    logoTextReverse2.position.set(240, 195);
    startScene.addChild(logoTextReverse2);
    
    var logoTextReverse = tm.app.Sprite(640, 310);
    logoTextReverse.scaleX = logoTextReverse.scaleY = currentScale;
    logoTextReverse.setImage( tm.graphics.TextureManager.get("logoTextReverse") );
    logoTextReverse.position.set(240, 195);
    startScene.addChild(logoTextReverse);
    
    // ゲームスタートボタン
    var startButton = tm.app.Sprite(640, 112);
    startButton.scaleX = startButton.scaleY = currentScale;
    startButton.setImage( tm.graphics.TextureManager.get("startButton") );
    startButton.position.set(240, 460);
    startScene.addChild(startButton);
    
    // バックグラウンド画像
    var gameBackground = tm.app.Sprite(640, 960);
    gameBackground.scaleX = gameBackground.scaleY = currentScale;
    gameBackground.setImage( tm.graphics.TextureManager.get("gameBackground") );
    gameBackground.position.set(240, 360);
    mainScene.addChild(gameBackground);

    // リザルトのバックグラウンド画像
    var resultBackground = tm.app.Sprite(640, 960);
    resultBackground.scaleX = resultBackground.scaleY = currentScale;
    resultBackground.setImage( tm.graphics.TextureManager.get("resultBackground") );
    resultBackground.position.set(240, 360);
    endScene.addChild(resultBackground);

    var resultText = tm.app.Sprite(640, 960);
    resultText.scaleX = resultText.scaleY = currentScale;
    resultText.setImage( tm.graphics.TextureManager.get("resultText") );
    resultText.position.set(240, 360);
    endScene.addChild(resultText);

    // タイマーの生成
    var timer = Timer();
    mainScene.addChild(timer);

    // ステータス
    var gameStatus = tm.app.Sprite(640, 120);
    gameStatus.scaleX = gameStatus.scaleY = currentScale;
    gameStatus.setImage(tm.graphics.TextureManager.get("gameStatus"));
    gameStatus.position.set(240,60);
    mainScene.addChild(gameStatus);

    // ステータスのラベル
    levelLabel = StatusLabel(0, 32);

    scoreLabel = StatusLabel(0, 24);

    whiteStoneLabel = StatusLabel(340, 60, 32);
    mainScene.addChild(whiteStoneLabel);

    goalStonesLabel = StatusLabel(430, 60, 32);
    mainScene.addChild(goalStonesLabel);

    touchCountLabel = StatusLabel(380, 240, 48);
    endScene.addChild(touchCountLabel);
    
    timeLabel = StatusLabel(380, 310, 48);
    endScene.addChild(timeLabel);

    // 石の生成
    stone = [];
    for(var i = 0; i < MAX_WIDTH; i++){
        stone[i] = [];
        for(var j = 0; j < MAX_HEIGHT; j++){
            stone[i][j] = Stone(i, j);
            mainScene.addChild(stone[i][j]);
        }
    }

    startScene.update = function(app){
    	if(app.frame % 120 == 0 && titleFlashing == 0){
	    	titleFlashing = 1;
	    }
	    else if(app.frame % 240 == 0 && titleFlashing == 1){
    		titleFlashing = 0;
	    }
	    // ロゴの透過度を変更
	    var alphaPlus = 0.04;
	    var alphaMinus = 0.02;
   		if(titleFlashing == 0){ 
			logoCircle2.alpha -= alphaMinus;
			logoTextReverse2.alpha -= alphaMinus;
			logoText2.alpha -= alphaMinus;
			if(logoCircle2.alpha < 0){ logoCircle2.alpha = 0; }
			if(logoTextReverse2.alpha < 0){ logoTextReverse2.alpha = 0; }
			if(logoText2.alpha < 0){ logoText2.alpha = 0; }
		}
		else if( titleFlashing == 1){
			logoCircle2.alpha += alphaPlus;
			logoTextReverse2.alpha += alphaPlus;
			logoText2.alpha += alphaPlus;
			if(logoCircle2.alpha > 1){ logoCircle2.alpha = 1; }
			if(logoTextReverse2.alpha > 1){ logoTextReverse2.alpha = 1; }
			if(logoText2.alpha > 1){ logoText2.alpha = 1; }
		}
		
		// スタート
		
        if(startButton.isHitPoint(app.pointing.x, app.pointing.y) == true && app.pointing.getPointingEnd() == true){
	        // 色々リセット
	        timer.width = 480;
	        touchCountLabel.text = 0;
	        timeLabel.text = 1;
	
	        levelLabel.text = 1;
	        levelLabel.size = 32;
	        levelLabel.position.set(255, 30);
	        mainScene.addChild(levelLabel);
	
	        scoreLabel.text = 0;
	        scoreLabel.size = 24;
            scoreLabel.align = "end";
	        scoreLabel.position.set(260, 72);
	        mainScene.addChild(scoreLabel);
	
	        // 石の初期化
	        initBoard();
	
	        app.replaceScene(mainScene);
	    }
    };

    mainScene.update = function(app) {
	    ++timeLabel.text;
        if(timer.timer % timer.limit == 0){
            gameOver = true;
        }
        else if(gameOver == true){
            gameOver = false;

            levelLabel.size = 48;
            levelLabel.position.set(380, 170);
            endScene.addChild(levelLabel);

            scoreLabel.size = 128;
            scoreLabel.align = "center";
            scoreLabel.position.set(240, 480);
            endScene.addChild(scoreLabel);

 //           timeLabel.text = Math.floor(timeLabel.text/60);
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
    goalStonesLabel.text = 0;

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

    //console.log(debugStr, "\n");
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

        this.frameSprite = tm.app.Sprite(120,120);
        this.frameSprite.scaleX = this.frameSprite.scaleY = 0.5;
        this.frameSprite.setImage( tm.graphics.TextureManager.get("stoneFrame") );
        this.addChild(this.frameSprite);

        this.sprite = tm.app.Sprite(this.width, this.height);
        this.sprite.scaleX = this.sprite.scaleY = 0.5;
        this.addChild(this.sprite);
    },

    update: function(){
        if( this.color == 0 ){ this.sprite.setImage( tm.graphics.TextureManager.get("whiteStone") ); }
        else if( this.color == 1 ){ this.sprite.setImage( tm.graphics.TextureManager.get("blackStone") ); }

        if(this.alpha < 1){ this.alpha += 0.05; }

        if(this.sprite.isHitPoint(app.pointing.x, app.pointing.y) == true && app.pointing.getPointingEnd() == true && this.visible == true){
            var reverseTotal = this.reverseStoneManager( this.iter.i, this.iter.j );
            if(reverseTotal){
                setTotalWhiteStone();
                showBoard(0);

                ++touchCount;
                ++touchCountLabel.text;

                scoreLabel.text += 30*reverseTotal*getScoreFromTouchCount(touchCount);

                // 波紋
                var wave = Wave(this.x, this.y, circleWave);
                app.currentScene.addChild( wave );

                // クリアー判定
                if(goalStonesLabel.text == whiteStoneLabel.text){
                    scoreLabel.text += 1000 * (currentSize.width+currentSize.height-touchCount);
                    levelLabel.text += 1;
                    touchCount = 0;
                    initBoard();
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

                // 波紋
                var wave = Wave(stone[x+(i*vy)][y+(i*vx)].x, stone[x+(i*vy)][y+(i*vx)].y, circleWave2);
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

        for(var i = 1; i < wall+1; i++){
            if( stone[x+(i*vy)][y+(i*vx)].color == color ){
                ++count;
            }
            else if( stone[x+(i*vy)][y+(i*vx)].color == anotherColor ){
                sameColor = true;
                break;
            }
        }

        var col = this.color;
        if( col == 0){ col = "■"; }
        else if( col == 1 ){ col = "□"; }

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
        this.limit = 1000;
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
        this.align     = "center";
        this.baseline  = "top";
        this.width = app.width;
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
        var particle = tm.app.Sprite(256,256);
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