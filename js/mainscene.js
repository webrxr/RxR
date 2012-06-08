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
        this.timer = Timer();
        this.addChild(this.timer);
        
        // BGM    
        this.bgm = tm.sound.SoundManager.get("bgm");
        this.bgm.loop = true;
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
            this.timer.width = 480;

            // 石の初期化
            initBoard();

            gameData.mode = "mainScene";
        }
        
        ++userData.time;
        
        this.levelLabel.text = userData.level;
        this.scoreLabel.text = userData.score;
        
        this.whiteStoneLabel.text = gameData.whiteStone;
        this.goalStonesLabel.text = gameData.goalStone;

        if(gameData.timeUp != 0){ ++gameData.timeUp; }

        if( gameData.timeUp == 0 && userData.time % this.timer.limit == 0 ){
            gameData.timeUp = 1;

            var bg = GeneralSprite(240, 360, 640, 188, nextStageBackground, currentScale);
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
    }
});