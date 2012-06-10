var MainScene = tm.createClass({
    superClass: tm.app.Scene,

    init: function(){
        this.superInit();

        // バックグラウンド画像
        this.gameBackground = GeneralSprite(240, 360, 640, 960, tm.graphics.TextureManager.get("gameBackground"), currentScale);
        this.addChild(this.gameBackground);

        // ステータス
        this.gameStatus = GeneralSprite(240, 60, 640, 120, tm.graphics.TextureManager.get("gameStatus"), currentScale);
        this.addChild(this.gameStatus);

        this.levelLabel = StatusLabel(255, 25, 32);
        this.addChild(this.levelLabel);

        this.scoreLabel = StatusLabel(252, 67, 24);
        this.addChild(this.scoreLabel);

        this.whiteStoneLabel = StatusLabel(350, 55, 32);
        this.addChild(this.whiteStoneLabel);

        this.goalStonesLabel = StatusLabel(440, 55, 32);
        this.addChild(this.goalStonesLabel);

        // タイマーの生成
        this.timer = Timer(gameData.time);
        this.addChild(this.timer);

        // BGM
        this.bgm = tm.sound.SoundManager.get("bgm");
        this.bgm.loop = true;

        // 石の生成
        this.stone = [];
        for(var i = 0; i < MAX_WIDTH; i++){
            this.stone[i] = [];
            for(var j = 0; j < MAX_HEIGHT; j++){
                this.stone[i][j] = Stone(i, j);
                this.addChild(this.stone[i][j]);
            }
        }
    },

    update: function(){
        if(gameData.mode == "mainReady"){
            this.bgm.play();

            // ステータスリセット
            userData.gameOver = false;
            gameData.timeUp = 0;

            userData.touchTotalCount = 0;
            userData.time = 1;
            userData.level = 1;
            userData.score = 0;
            userData.gameOver = false;
            mainScene.alpha = 1.0;
            this.timer.width = app.width;
            gameData.time = gameData.maxTime;

            // 石の初期化
            this.initBoard();

            gameData.mode = "mainScene";
        }

        this.levelLabel.text = userData.level;
        this.scoreLabel.text = userData.score;

        this.whiteStoneLabel.text = gameData.whiteStone;
        this.goalStonesLabel.text = gameData.goalStone;

        if(gameData.timeUp != 0){ ++gameData.timeUp; }

        if( gameData.timeUp == 0 && gameData.time < 0 ){
            gameData.timeUp = 1;

            var bg = GeneralSprite(240, 360, 640, 188, CLEAR_STAGE_BACKGROUND_IMAGE, currentScale);
            this.addChild( bg );

            var sprite = GeneralSprite(240, 360, 640, 188, tm.graphics.TextureManager.get("timeUp"), currentScale);
            this.addChild(sprite);
            sprite.update = function(){
                if(gameData.timeUp > 80){
                    userData.gameOver = true;
                    this.remove();
                    bg.remove();
                }
                else if(gameData.timeUp > 50){
                    this.alpha -= 0.04;
                    if(this.alpha < 0){ this.alpha = 0; }
                }
            }
        }
        else if(userData.gameOver == true){
            this.bgm.stop();
            gameData.mode = "endReady";
            app.replaceScene(endScene);
        }
    },

    /**
     * 石の配置初期化
     */
    initBoard: function(){
        currentSize.width = Math.rand(4, MAX_WIDTH);
        currentSize.height = Math.rand(4, MAX_HEIGHT);

        this.getMargin();

        //gameData.goalStone = Math.rand(0, currentSize.width * currentSize.height);    // 目標の白石数
        gameData.goalStone = 0;

        var margin = this.getMargin();

        // 石の初期化
        for(var i = 0; i < MAX_WIDTH; i++){
            for(var j = 0; j < MAX_HEIGHT; j++){
                if( i < currentSize.width && j < currentSize.height ){
                    this.stone[i][j].color = Math.rand(0,1);
                    this.stone[i][j].wakeUp();
                    this.stone[i][j].visible = true;
                    this.stone[i][j].setPosition(i, j, margin);
                    this.stone[i][j].changeColor();
                }
                else{
                    this.stone[i][j].sleep();
                    this.stone[i][j].visible = false;
                }
                this.stone[i][j].alpha = 0;
                this.stone[i][j].fadeIn();
            }
        }

        this.setTotalWhiteStone();
        this.showBoard(0);
    },

    /**
     * 白石の総数をセット
     */
    setTotalWhiteStone: function(){
        gameData.whiteStone = 0;
        for(var i = 0; i < currentSize.width; i++){
            for(var j = 0; j < currentSize.height; j++){
                if(this.stone[i][j].color == 0){ ++gameData.whiteStone; }
            }
        }
    },

    /**
     * コンソールに盤面を表示
     */
    showBoard: function(all){
        var w = 0, h = 0;
        if(all == 0){ w = currentSize.width; h = currentSize.height; }
        else{ w = MAX_WIDTH; h = MAX_HEIGHT; }

        var debugStr = "";
        for(var i = 0; i < h; i++){
            for(var j = 0; j < w; j++){
                if(this.stone[j][i].color == 0){ debugStr += "["+j+"]"+"["+i+"]"+"□ | "; }
                else if(this.stone[j][i].color == 1){ debugStr += "["+j+"]"+"["+i+"]"+"■ | "; }
                else{ debugStr += "["+j+"]"+"["+i+"]"+this.stone[j][i].color+" | "; }
            }
            debugStr += "\n";
        }

        console.log(debugStr, "\n");
    },

    /**
     * 中央揃えのためのマージンを取得
     */
    getMargin: function(){
        var marginW = (app.width - (this.stone[0][0].width / 2) * currentSize.width) / 2;

        return marginW;
    }
});