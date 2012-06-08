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
    },

    update: function(){
        ++userData.time;

        if(gameData.timeUp != 0){ ++gameData.timeUp; }

        if( gameData.timeUp == 0 && timer.timer % timer.limit == 0 ){
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
            userData.gameOver = false;
            gameData.timeUp = 0;

//            levelLabel.size = 48;
//            levelLabel.position.set(380, 170);
//            endScene.addChild(levelLabel);

//            scoreLabel.size = 128;
//            scoreLabel.align = "center";
//            scoreLabel.position.set(240, 480);
//            endScene.addChild(scoreLabel);

            userData.time = Math.floor(userData.time / 30);
            app.replaceScene(endScene);
        }
    }
});