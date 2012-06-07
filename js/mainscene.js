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
        ++timeLabel.text;

        if(timeUp != 0){ ++timeUp; }

        if( timeUp == 0 && timer.timer % timer.limit == 0 ){
            timeUp = 1;

            var bg = GeneralSprite(240, 360, 640, 188, nextStageBackground, currentScale);
            this.addChild( bg );

            var sprite = GeneralSprite(240, 360, 640, 188, tm.graphics.TextureManager.get("timeUp"), currentScale);
            this.addChild(sprite);
            sprite.update = function(){
                if(timeUp > 80){
                    gameOver = true;
                    this.remove();
                    bg.remove();
                }
                else if(timeUp > 50){
                    this.alpha -= 0.04;
                    if(this.alpha < 0){ this.alpha = 0; }
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
    }
});