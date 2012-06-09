
(function(ns) {
        
    // 画像のリスト
    var IMAGES = {
        // タイトルバックグラウンド画像
        "titleBackground": {
            "image": "titleBackground",
            "rect": [240, 360, 640, 960],
        },
        
        // タイトルロゴ
        "logoBackground": {
            "image": "logoTile",
            "rect": [240, 195, 640, 310],
        },
        "logoCircle2": {
            "image": "logoCircle2",
            "rect": [240, 195, 640, 310],
        },
        "logoCircle": {
            "image": "logoCircle",
            "rect": [240, 195, 640, 310],
        },
        "logoText2": {
            "image": "logoText2",
            "rect": [240, 195, 640, 310],
        },
        "logoText": {
            "image": "logoText",
            "rect": [240, 195, 640, 310],
        },
        "logoTextReverse2": {
            "image": "logoTextReverse2",
            "rect": [240, 195, 640, 310],
        },
        "logoTextReverse": {
            "image": "logoTextReverse",
            "rect": [240, 195, 640, 310],
        },
        
        // ゲームスタートボタン
        "startButton": {
            "image": "startButton",
            "rect": [240, 460, 640, 112],
        },
    };
    // ロゴの透過度
    var ALPHA_PLUS  = 0.04;
    var ALPHA_MINUS = 0.02;
    
    
    
    ns.TitleScene = tm.createClass({
        superClass: tm.app.Scene,
    
        init: function(){
            this.superInit();
            this.titleFlashing = 1;  // タイトルロゴの点滅
    
            // タイトルバックグラウンド画像
            for (var key in IMAGES) {
                var value   = IMAGES[key];
                var sprite  = tm.app.Sprite(value.rect[2], value.rect[3]);
                sprite.position.set(value.rect[0], value.rect[1]);
                sprite.scaleX = sprite.scaleY = currentScale;
                sprite.setImage( tm.graphics.TextureManager.get(value.image) );
                this[key] = sprite;
                this.addChild(sprite);
            }
            
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
            if(this.titleFlashing == 0){
                this.logoCircle2.alpha -= ALPHA_MINUS;
                this.logoTextReverse2.alpha -= ALPHA_MINUS;
                this.logoText2.alpha -= ALPHA_MINUS;
                if(this.logoCircle2.alpha < 0){ this.logoCircle2.alpha = 0; }
                if(this.logoTextReverse2.alpha < 0){ this.logoTextReverse2.alpha = 0; }
                if(this.logoText2.alpha < 0){ this.logoText2.alpha = 0; }
            }
            else if( this.titleFlashing == 1){
                this.logoCircle2.alpha += ALPHA_PLUS;
                this.logoTextReverse2.alpha += ALPHA_PLUS;
                this.logoText2.alpha += ALPHA_PLUS;
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
    
})(window);





