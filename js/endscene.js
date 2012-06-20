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

    // ラベルのリスト
    var UI_DATA = {
        LABELS: {
            children: [
                {
                    type:"Label",name:"levelLabel",
                    x:380,y:215,width:150,fillStyle:"white",
                    text:"dammy",fontSize:48,align:"end"
                },
                {
                    type:"Label",name:"scoreLabel",
                    x:240,y:585,width:480,fillStyle:"white",
                    text:"dammy",fontSize:128,align:"center"
                },
                {
                    type:"Label",name:"touchCountLabel",
                    x:380,y:280,width:150,fillStyle:"white",
                    text:"dammy",fontSize:48,align:"end"
                },
                {
                    type:"Label",name:"timeLabel",
                    x:380,y:350,width:150,fillStyle:"white",
                    text:"dammy",fontSize:48,align:"end"
                },
            ]
        }
    }
    
    ns.EndScene = tm.createClass({
        superClass: tm.app.Scene,
    
        init: function(){
            this.superInit();

            userData.time = Math.floor(userData.time / 30);

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
            
            // ラベル
            this.fromJSON(UI_DATA.LABELS);
            
            this.levelLabel.text = userData.level;
            this.scoreLabel.text = userData.score;
            this.touchCountLabel.text = userData.touchTotalCount;
            this.timeLabel.text = userData.time+"秒";

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
            var tweetMessage = this.getTweetMessage(userData.score);
            var msg = tm.social.Twitter.createURL({
                type: "tweet",
                text: "Reverse Reverse\nScore : {0}\nTime : {1}秒生存\n{2}".format(userData.score, userData.time, tweetMessage),
                hashtags: "RxR,tmlibjs",
                url: "http://bit.ly/MsWyHn",
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
        // ポーズ画面 : 別タブへ切り替わった時 / Tabキーを押した時
        onblur: function() {
            app.pushScene(PauseScene());
        }
    });
})(window);
