var EndScene = tm.createClass({
    superClass: tm.app.Scene,

    init: function(){
        this.superInit();

        // リザルトのバックグラウンド画像
        var resultBackground = GeneralSprite(240, 360, 640, 960, tm.graphics.TextureManager.get("resultBackground"), currentScale);
        this.addChild(resultBackground);

        var resultText = GeneralSprite(240, 360, 640, 960, tm.graphics.TextureManager.get("resultText"), currentScale);
        this.addChild(resultText);
        
        this.touchCountLabel = StatusLabel(380, 235, 48);
        this.addChild(this.touchCountLabel);
        
        this.timeLabel = StatusLabel(380, 305, 48);
        this.addChild(this.timeLabel);
        
        this.levelLabel = StatusLabel(380, 170, 48);
        this.addChild(this.levelLabel);
                
        this.scoreLabel = StatusLabel(240, 480, 128);
        this.scoreLabel.align = "center";
        this.addChild(this.scoreLabel);
        
        console.log(userData.time);
    },

    update: function(){
        if(gameData.mode == "endReady"){
            gameData.mode = "endScene";
            userData.time = Math.floor(userData.time / 30);
        }
        
        this.touchCountLabel.text = userData.touchTotalCount;
        this.timeLabel.text = userData.time;
        this.levelLabel.text = userData.level;
        this.scoreLabel.text = userData.score;
        
        if(app.pointing.getPointingEnd()){
            gameData.mode = "titleReady";
            app.replaceScene(titleScene);
        }
    }
});