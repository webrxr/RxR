var EndScene = tm.createClass({
    superClass: tm.app.Scene,

    init: function(){
        this.superInit();

        // リザルトのバックグラウンド画像
        var resultBackground = GeneralSprite(240, 360, 640, 960, tm.graphics.TextureManager.get("resultBackground"), currentScale);
        this.addChild(resultBackground);

        var resultText = GeneralSprite(240, 360, 640, 960, tm.graphics.TextureManager.get("resultText"), currentScale);
        this.addChild(resultText);
    },

    update: function(){
        if(app.pointing.getPointingEnd()){
            op.play();
            bgm.stop();
            app.replaceScene(titleScene);
        }
    }
});