(function(ns) {
        
    // 画像のリスト
    var IMAGES = {
        // リザルトのバックグラウンド画像
        "resultBackground": {
            "image": "resultBackground",
            "rect": [240, 360, 640, 960],
        },
        
        // リザルトのテキスト
        "resultText": {
            "image": "resultText",
            "rect": [240, 360, 640, 960],
        }
    };
    
    ns.EndScene = tm.createClass({
        superClass: tm.app.Scene,
    
        init: function(){
            this.superInit();
    
            // 画像
            for (var key in IMAGES) {
                var value   = IMAGES[key];
                var sprite  = tm.app.Sprite(value.rect[2], value.rect[3]);
                sprite.position.set(value.rect[0], value.rect[1]);
                sprite.scaleX = sprite.scaleY = CURRENT_SCALE;
                sprite.setImage( tm.graphics.TextureManager.get(value.image) );
                this[key] = sprite;
                this.addChild(sprite);
            }
            
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
    
            userData.time = Math.floor(userData.time / 30);

            var tweetMessage = this.getTweetMessage(userData.score);
            var tweetButton = tm.twitter.TweetButton(
                "Score : {0}\nTime : {1}秒生存\n{2}\nhttps://github.com/webrxr/RxR #RxR #tmlibjs".format(userData.score, userData.time, tweetMessage)
            );
            tweetButton.x = 360;
            tweetButton.y = 650;
            this.addChild(tweetButton);
            
            // タイトルボタン
            this.returnTitle = IconButton(tm.graphics.TextureManager.get("returnTitle"));
            this.returnTitle.setPosition(160, 647).setSize(237, 50);
            this.returnTitle.scaleX = this.returnTitle.scaleY = CURRENT_SCALE;
            this.addChild(this.returnTitle);
        },
    
        update: function(){
            this.touchCountLabel.text = userData.touchTotalCount;
            this.timeLabel.text = userData.time;
            this.levelLabel.text = userData.level;
            this.scoreLabel.text = userData.score;

            if( app.pointing.getPointingEnd() == true ){
                if(this.returnTitle.isHitPoint(app.pointing.x, app.pointing.y) == true){
                    tm.sound.SoundManager.get("decide").play();
                    app.replaceScene(TitleScene());
                }
            }
        },

        /*
         **
         */
        getTweetMessage: function(score){
            if(score > 200000){ return "ヤムチャしやがって…"; }
            if(score > 150000){ return "お前がナンバー1だ"; }
            else if(score > 100000){ return "神現る！"; }
            else if(score > 80000){ return "マスタークラス！"; }
            else if(score > 60000){ return "やりこみ名人！"; }
            else if(score > 40000){ return "立派なゲーマー！"; }
            else if(score > 20000){ return "まだまだ伸びるよ！頑張れ！"; }
            else if(score > 10000){ return "生まれたてのひよこレベル :-) "; }
            else if(score >= 0){ return "卵の中のひよこ"; }

        },
        // ポーズ画面 : 別タブへ切り替わった時 / Ttbキーを押した時
        onblur: function() {
            app.pushScene(PauseScene());
        }
    });
})(window);
