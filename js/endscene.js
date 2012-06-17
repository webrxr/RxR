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
            for(var key in IMAGES){
                var value = IMAGES[key];
                var sprite = tm.app.Sprite(value.rect[2], value.rect[3]);
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
                    
            this.scoreLabel = StatusLabel(240, 460, 128);
            this.scoreLabel.align = "center";
            this.addChild(this.scoreLabel);

            // タイトルボタン
            var iphoneButton = tm.app.iPhoneButton(120, 60, "black");
            iphoneButton.setPosition(120,640);
            iphoneButton.label.text = "Title";
            this.addChild(iphoneButton);
            iphoneButton.onpointingstart = function() {
                tm.sound.SoundManager.get("decide").play();

                this.addChild( tm.fade.FadeOut(
                    app.width, app.height, "#000", 1000, function() {
                        app.replaceScene(TitleScene());
                    })
                );
            };

            // ツイートボタン
            userData.time = Math.floor(userData.time / 30);

            var tweetMessage = this.getTweetMessage(userData.score);
            var msg = tm.social.Twitter.createURL({
                type: "tweet",
                text: "Score : {0}\nTime : {1}秒生存\n{2}".format(userData.score, userData.time, tweetMessage),
                hashtags: "RxR,tmlibjs",
                url: "https://github.com/webrxr/RxR",
            });
            var tweetButton = tm.app.iPhoneButton(120, 60, "black");
            tweetButton.setPosition(360, 640);
            tweetButton.label.text = "Tweet";
            this.addChild(tweetButton);
            tweetButton.onpointingstart = function() {
                tm.sound.SoundManager.get("decide").play();

                window.open(msg, "_self");
            };
        },
    
        update: function(){
            this.touchCountLabel.text = userData.touchTotalCount;
            this.timeLabel.text = userData.time;
            this.levelLabel.text = userData.level;
            this.scoreLabel.text = userData.score;
        },

        /*
         * ツイートのメッセージ
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
