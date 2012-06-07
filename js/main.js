// リソースの読み込み
tm.preload(function() {
	// ゲームシーン中
    tm.graphics.TextureManager.add("whiteStone", "img/whiteStone.png");
    tm.graphics.TextureManager.add("blackStone", "img/blackStone.png");
    tm.graphics.TextureManager.add("stoneFrame", "img/stoneFrame.png");
    tm.graphics.TextureManager.add("gameStatus", "img/gameStatus.png");
    tm.graphics.TextureManager.add("gameBackground", "img/gameBackground.png");
    tm.graphics.TextureManager.add("nextStage", "img/nextStage.png");
    tm.graphics.TextureManager.add("missTake", "img/missTake.png");
    tm.graphics.TextureManager.add("timeUp", "img/timeUp.png");

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

    // サウンド
    tm.sound.SoundManager.add("bgm", "sound/bgm/bgm", 1);
    tm.sound.SoundManager.add("op", "sound/bgm/op", 1);
    tm.sound.SoundManager.add("decide", "sound/se/decide.wav");
    tm.sound.SoundManager.add("touch", "sound/se/touch.wav");
});

var circleWave = function(rad){
    var c = tm.graphics.Canvas();
    c.width = c.height = 256;
    c.setTransformCenter();
    c.setColorStyle("white", "rgb(255, 255, 255)");
    c.strokeCircle(0, 0, rad);

    return c;
}

var nextStageBackground = (function(){
    var c = tm.graphics.Canvas();
    c.width = 640;
    c.height = 188;
    c.fillStyle = "hsla(210, 10%, 10%, 0.75)";
    c.fillRect(0, 0, c.width, c.height);

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
    app.fitWindow();

    var titleFlashing = 1;  // タイトルロゴの点滅
    gameOver = false;       // ゲームオーバー
    timeUp = 0;             // タイムアップ
    touchCount = 0;         // タッチ数

    // シーンの生成
    var startScene = tm.app.Scene();
    var mainScene = tm.app.Scene();
    var endScene = tm.app.Scene();

    app.replaceScene(startScene);

    // タイトルバックグラウンド画像
    var titleBackground = GeneralSprite(240, 360, 640, 960, tm.graphics.TextureManager.get("titleBackground"), currentScale);
    startScene.addChild(titleBackground);
    
    // タイトルロゴ
    var logoBackground = GeneralSprite(240, 195, 640, 310, tm.graphics.TextureManager.get("logoTile"), currentScale);
    startScene.addChild(logoBackground);

    var logoCircle2 = GeneralSprite(240, 195, 640, 310, tm.graphics.TextureManager.get("logoCircle2"), currentScale);
    startScene.addChild(logoCircle2);

    var logoCircle = GeneralSprite(240, 195, 640, 310, tm.graphics.TextureManager.get("logoCircle"), currentScale);
    startScene.addChild(logoCircle);

    var logoText2 = GeneralSprite(240, 195, 640, 310, tm.graphics.TextureManager.get("logoText2"), currentScale);
    startScene.addChild(logoText2);

    var logoText = GeneralSprite(240, 195, 640, 310, tm.graphics.TextureManager.get("logoText"), currentScale);
    startScene.addChild(logoText);

    var logoTextReverse2 = GeneralSprite(240, 195, 640, 310, tm.graphics.TextureManager.get("logoTextReverse2"), currentScale);
    startScene.addChild(logoTextReverse2);

    var logoTextReverse = GeneralSprite(240, 195, 640, 310, tm.graphics.TextureManager.get("logoTextReverse"), currentScale);
    startScene.addChild(logoTextReverse);

    // ゲームスタートボタン
    var startButton = GeneralSprite(240, 460, 640, 112, tm.graphics.TextureManager.get("startButton"), currentScale);
    startScene.addChild(startButton);
    
    // バックグラウンド画像
    var gameBackground = GeneralSprite(240, 360, 640, 960, tm.graphics.TextureManager.get("gameBackground"), currentScale);
    mainScene.addChild(gameBackground);

    // タイマーの生成
    var timer = Timer();
    mainScene.addChild(timer);

    // ステータス
    var gameStatus = GeneralSprite(240, 60, 640, 120, tm.graphics.TextureManager.get("gameStatus"), currentScale);
    mainScene.addChild(gameStatus);

    // リザルトのバックグラウンド画像
    var resultBackground = GeneralSprite(240, 360, 640, 960, tm.graphics.TextureManager.get("resultBackground"), currentScale);
    endScene.addChild(resultBackground);

    var resultText = GeneralSprite(240, 360, 640, 960, tm.graphics.TextureManager.get("resultText"), currentScale);
    endScene.addChild(resultText);

    // BGM
    var op = tm.sound.SoundManager.get("op");
    op.loop = true;
    op.play();

    var bgm = tm.sound.SoundManager.get("bgm");
    bgm.loop = true;

    // ステータスのラベル
    levelLabel = StatusLabel(0, 32);

    scoreLabel = StatusLabel(0, 24);

    whiteStoneLabel = StatusLabel(350, 55, 32);
    mainScene.addChild(whiteStoneLabel);

    goalStonesLabel = StatusLabel(440, 55, 32);
    mainScene.addChild(goalStonesLabel);

    touchCountLabel = StatusLabel(380, 235, 48);
    endScene.addChild(touchCountLabel);
    
    timeLabel = StatusLabel(380, 305, 48);
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
    	if(app.frame % 80 == 0 && titleFlashing == 0){
	    	titleFlashing = 1;
	    }
	    else if(app.frame % 120 == 0 && titleFlashing == 1){
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
        if( app.pointing.getPointingEnd() == true && startButton.isHitPoint(app.pointing.x, app.pointing.y) == true ){
            tm.sound.SoundManager.get("decide").play();
            op.stop();
            bgm.play();

	        // 色々リセット
	        timer.width = 480;
	        touchCountLabel.text = 0;
	        timeLabel.text = 1;
	
	        levelLabel.text = 1;
	        levelLabel.size = 32;
	        levelLabel.position.set(255, 25);
	        mainScene.addChild(levelLabel);
	
	        scoreLabel.text = 0;
	        scoreLabel.size = 24;
            scoreLabel.align = "end";
	        scoreLabel.position.set(252, 67);
	        mainScene.addChild(scoreLabel);

            gameOver = false;
	
	        // 石の初期化
	        initBoard();

            mainScene.alpha = 1.0;
            timer.timer = 1;
	        app.replaceScene(mainScene);
	    }
    };

    mainScene.update = function(app) {
	    ++timeLabel.text;

        if(timeUp != 0){ ++timeUp; }

        if( timeUp == 0 && timer.timer % timer.limit == 0 ){
            timeUp = 1;

            var bg = GeneralSprite(240, 360, 640, 188, nextStageBackground, currentScale);
            mainScene.addChild( bg );

            var sprite = GeneralSprite(240, 360, 640, 188, tm.graphics.TextureManager.get("timeUp"), currentScale);
            mainScene.addChild(sprite);
            sprite.update = function(){
                if(timeUp > 80){
                    gameOver = true;
                    this.remove();
                    bg.remove();
                }
                else if(timeUp > 50){
                    mainScene.alpha -= 0.04;
                    if(mainScene.alpha < 0){ mainScene.alpha = 0; }
                }
            }
        }
        else if(gameOver == true){
            gameOver = false;
            timeUp = 0;

            levelLabel.size = 48;
            levelLabel.position.set(380, 170);
            endScene.addChild(levelLabel);

            scoreLabel.size = 128;
            scoreLabel.align = "center";
            scoreLabel.position.set(240, 480);
            endScene.addChild(scoreLabel);

            timeLabel.text = Math.floor(timeLabel.text/30);
            app.replaceScene(endScene);
        }
    };

    endScene.update = function(){
        if(app.pointing.getPointingEnd()){
            op.play();
            bgm.stop();
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

    //goalStonesLabel.text = Math.rand(0, currentSize.width * currentSize.height);    // 目標の白石数
    goalStonesLabel.text = 0;

    var margin = getMargin();

    // 石の初期化
    for(var i = 0; i < MAX_WIDTH; i++){
        for(var j = 0; j < MAX_HEIGHT; j++){
            if( i < currentSize.width && j < currentSize.height ){
                stone[i][j].color = Math.rand(0,1);
                stone[i][j].visible = true;
                stone[i][j].setPosition(i, j, margin);
                stone[i][j].changeColor();
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

        //if(!tm.isMobile){
            this.frameSprite = tm.app.Sprite(120,120);
            this.frameSprite.scaleX = this.frameSprite.scaleY = 0.5;
            this.frameSprite.setImage( tm.graphics.TextureManager.get("stoneFrame") );
            this.addChild(this.frameSprite);
        //}

        this.sprite = tm.app.Sprite(this.width, this.height);
        this.sprite.scaleX = this.sprite.scaleY = 0.5;
        this.addChild(this.sprite);
        this.changeColor();
    },

    update: function(){

        if(this.alpha < 1){ this.alpha += 0.05; }

        if (app.pointing.getPointingEnd() == false ) return;
        if (this.visible == false) return;
        if (timeUp != 0) return;

        if(this.sprite.isHitPoint(app.pointing.x, app.pointing.y) == true){
            var reverseTotal = this.reverseStoneManager( this.iter.i, this.iter.j );
            if(reverseTotal){
                tm.sound.SoundManager.get("touch").play();
                setTotalWhiteStone();
                showBoard(0);

                ++touchCount;
                ++touchCountLabel.text;

                scoreLabel.text += 30*reverseTotal*getScoreFromTouchCount(touchCount);
                if(scoreLabel.text < 0){ scoreLabel.text = 0; }

                // 波紋
                var wave = Wave(this.x, this.y, circleWave(32));
                app.currentScene.addChild( wave );

                // クリアー判定
                if( whiteStoneLabel.text == goalStonesLabel.text ){
                    scoreLabel.text += 1000 * (currentSize.width+currentSize.height-touchCount);
                    if(scoreLabel.text < 0){ scoreLabel.text = 0; }

                    var bg = ClearEffect(240, 360, 640, 188, nextStageBackground, false);
                    app.currentScene.addChild( bg );

                    var next = ClearEffect(240, 360, 640, 188, tm.graphics.TextureManager.get("nextStage"), true);
                    app.currentScene.addChild( next );

	                var wave = Wave(240, 360, circleWave(128));
	                app.currentScene.addChild( wave );
                }
                else if( whiteStoneLabel.text == (currentSize.width*currentSize.height) ){
                    scoreLabel.text -= 1000 * (currentSize.width+currentSize.height);
                    if(scoreLabel.text < 0){ scoreLabel.text = 0; }

                    var bg = ClearEffect(240, 360, 640, 188, nextStageBackground, false);
                    app.currentScene.addChild( bg );

                    var miss = ClearEffect(240, 360, 640, 188, tm.graphics.TextureManager.get("missTake"), true);
                    app.currentScene.addChild( miss );
                }
            }
        }
    },

    /**
     * 石の色をリセット
     */
    changeColor: function(){
        if( this.color == 0 ){ this.sprite.setImage( tm.graphics.TextureManager.get("whiteStone") ); }
        else if( this.color == 1 ){ this.sprite.setImage( tm.graphics.TextureManager.get("blackStone") ); }
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
            this.changeColor();
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
                stone[x+(i*vy)][y+(i*vx)].changeColor();

                // 波紋
                var wave = Wave(stone[x+(i*vy)][y+(i*vx)].x, stone[x+(i*vy)][y+(i*vx)].y, circleWave(32));
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
        this.limit = 60*30;
        this.x = 0;
        this.y = 320;
        this.width = app.width;
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


/**
 * ベタ張り画像
 */
var GeneralSprite = tm.createClass({
    superClass: tm.app.Sprite,

    init: function(x, y, w, h, img, scale){
        this.superInit(w, h);
        this.position.set(x, y);
        this.scaleX = this.scaleY = scale;
        this.setImage(img);
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

/**
 * クリアーエフェクト
 */
var ClearEffect = tm.createClass({
    superClass:tm.app.CanvasElement,

    init: function(x,y,w,h,img,reset){
        this.superInit(w, h);
        this.position.set(x, y);
        this.scaleX = this.scaleY = currentScale;

        var particle = tm.app.Sprite(640, 188);
        particle.setImage(img);
        this.addChild(particle);

        this.timer = 100;

        this.reset = reset;
    },

    update: function(){
        this.timer -= 1;
        if(this.timer <= 0){
            if(this.reset){
                levelLabel.text += 1;
                touchCount = 0;
                initBoard();
            }

            this.remove();
        }
        else if(this.timer <= 30){
            this.alpha -= 0.04;
            if(this.alpha < 0){ this.alpha = 0; }
        }

        if(timeUp != 0){
            touchCount = 0;
            this.remove();
        }
    }
});