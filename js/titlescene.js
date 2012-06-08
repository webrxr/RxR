var TitleScene = tm.createClass({
    superClass: tm.app.Scene,

    init: function(){
        this.superInit();
        this.titleFlashing = 1;  // タイトルロゴの点滅

        // タイトルバックグラウンド画像
        this.titleBackground = GeneralSprite(240, 360, 640, 960, tm.graphics.TextureManager.get("titleBackground"), currentScale);
        this.addChild(this.titleBackground);

        // タイトルロゴ
        this.logoBackground = GeneralSprite(240, 195, 640, 310, tm.graphics.TextureManager.get("logoTile"), currentScale);
        this.addChild(this.logoBackground);

        this.logoCircle2 = GeneralSprite(240, 195, 640, 310, tm.graphics.TextureManager.get("logoCircle2"), currentScale);
        this.addChild(this.logoCircle2);

        this.logoCircle = GeneralSprite(240, 195, 640, 310, tm.graphics.TextureManager.get("logoCircle"), currentScale);
        this.addChild(this.logoCircle);

        this.logoText2 = GeneralSprite(240, 195, 640, 310, tm.graphics.TextureManager.get("logoText2"), currentScale);
        this.addChild(this.logoText2);

        this.logoText = GeneralSprite(240, 195, 640, 310, tm.graphics.TextureManager.get("logoText"), currentScale);
        this.addChild(this.logoText);

        this.logoTextReverse2 = GeneralSprite(240, 195, 640, 310, tm.graphics.TextureManager.get("logoTextReverse2"), currentScale);
        this.addChild(this.logoTextReverse2);

        this.logoTextReverse = GeneralSprite(240, 195, 640, 310, tm.graphics.TextureManager.get("logoTextReverse"), currentScale);
        this.addChild(this.logoTextReverse);

        // ゲームスタートボタン
        this.startButton = GeneralSprite(240, 460, 640, 112, tm.graphics.TextureManager.get("startButton"), currentScale);
        this.addChild(this.startButton);

        // BGM
        this.op = tm.sound.SoundManager.get("op");
        this.op.loop = true;
    },

    update: function(){
        if(gameData.mode == "titleReady"){
            this.op.play();
            gameData.mode = "titleScene";
        }
        
        if(app.frame % 80 == 0 && this.titleFlashing == 0){
            this.titleFlashing = 1;
        }
        else if(app.frame % 120 == 0 && this.titleFlashing == 1){
            this.titleFlashing = 0;
        }
        // ロゴの透過度を変更
        var alphaPlus = 0.04;
        var alphaMinus = 0.02;
        if(this.titleFlashing == 0){
            this.logoCircle2.alpha -= alphaMinus;
            this.logoTextReverse2.alpha -= alphaMinus;
            this.logoText2.alpha -= alphaMinus;
            if(this.logoCircle2.alpha < 0){ this.logoCircle2.alpha = 0; }
            if(this.logoTextReverse2.alpha < 0){ this.logoTextReverse2.alpha = 0; }
            if(this.logoText2.alpha < 0){ this.logoText2.alpha = 0; }
        }
        else if( this.titleFlashing == 1){
            this.logoCircle2.alpha += alphaPlus;
            this.logoTextReverse2.alpha += alphaPlus;
            this.logoText2.alpha += alphaPlus;
            if(this.logoCircle2.alpha > 1){ this.logoCircle2.alpha = 1; }
            if(this.logoTextReverse2.alpha > 1){ this.logoTextReverse2.alpha = 1; }
            if(this.logoText2.alpha > 1){ this.logoText2.alpha = 1; }
        }

        // スタート
        if( app.pointing.getPointingEnd() == true && this.startButton.isHitPoint(app.pointing.x, app.pointing.y) == true ){
            tm.sound.SoundManager.get("decide").play();
            this.op.stop();
            
            gameData.mode = "mainReady";
            app.replaceScene(mainScene);
        }
    }
});