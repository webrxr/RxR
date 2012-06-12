
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
        }
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
            for(var key in IMAGES){
                var value = IMAGES[key];
                var sprite = tm.app.Sprite(value.rect[2], value.rect[3]);
                sprite.position.set(value.rect[0], value.rect[1]);
                sprite.scaleX = sprite.scaleY = CURRENT_SCALE;
                sprite.setImage( tm.graphics.TextureManager.get(value.image) );
                this[key] = sprite;
                this.addChild(sprite);
            }
            
            // github
            this.rxrGithub = IconButton(tm.graphics.TextureManager.get("octodex"));
            this.rxrGithub.setPosition(280, 650).setSize(128, 128);
            this.rxrGithub.scaleX = this.rxrGithub.scaleY = CURRENT_SCALE;
            this.addChild(this.rxrGithub);
            
            // tmlib.js
            this.engineGithub = IconButton(tm.graphics.TextureManager.get("tmlib"));
            this.engineGithub.setPosition(400, 650).setSize(128, 128);
            this.engineGithub.scaleX = this.engineGithub.scaleY = CURRENT_SCALE;
            this.addChild(this.engineGithub);
            
            // BGM
            this.op = tm.sound.SoundManager.get("op");
            this.op.loop = true;
            this.op.play();
        },
    
        update: function(){
            
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
            if( app.pointing.getPointingEnd() == true ){
                if(this.startButton.isHitPoint(app.pointing.x, app.pointing.y) == true){
                    tm.sound.SoundManager.get("decide").play();
                    this.op.stop();
                    
                    this.addChild( tm.fade.FadeOut(
                        app.width, app.height, "#000", 1000, function() {
                            app.replaceScene(MainScene());
                        })
                    );
                }
                else if(this.rxrGithub.isHitPoint(app.pointing.x, app.pointing.y) == true){
                    tm.sound.SoundManager.get("touch").play();
                    window.open("https://github.com/webrxr/RxR", "_self");
                }
                else if(this.engineGithub.isHitPoint(app.pointing.x, app.pointing.y) == true){
                    tm.sound.SoundManager.get("touch").play();
                    window.open("https://github.com/phi1618/tmlib.js", "_self");
                }
            }
        },
    
        // ポーズ画面 : 別タブへ切り替わった時 / Ttbキーを押した時
        onblur: function() {
            app.pushScene(PauseScene(this.op));
        }
    });
    
})(window);





