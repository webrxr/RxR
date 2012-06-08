// リソースの読み込み
tm.preload(function() {
    // ゲームシーン中
    tm.graphics.TextureManager.add("whiteStone", "img/whiteStone.png");
    tm.graphics.TextureManager.add("blackStone", "img/blackStone.png");
    tm.graphics.TextureManager.add("stoneFrame", "img/stoneFrame.png");
    tm.graphics.TextureManager.add("gameStatus", "img/gameStatus.png");
    tm.graphics.TextureManager.add("gameBackground", "img/gameBackground.png");
    tm.graphics.TextureManager.add("nextStage", "img/nextStage.png");
    tm.graphics.TextureManager.add("missTake", "img/missTake.png");
    tm.graphics.TextureManager.add("timeUp", "img/timeUp.png");

    // タイトル
    tm.graphics.TextureManager.add("titleBackground", "img/titleBackground.png");
    tm.graphics.TextureManager.add("logoCircle", "img/logo/logo_circle.png");
    tm.graphics.TextureManager.add("logoCircle2", "img/logo/logo_circle2.png");
    tm.graphics.TextureManager.add("logoTile", "img/logo/logo_tile.png");
    tm.graphics.TextureManager.add("logoText", "img/logo/logo1.png");
    tm.graphics.TextureManager.add("logoText2", "img/logo/logo1-2.png");
    tm.graphics.TextureManager.add("logoTextReverse", "img/logo/logo2.png");
    tm.graphics.TextureManager.add("logoTextReverse2", "img/logo/logo2-2.png");
    tm.graphics.TextureManager.add("startButton", "img/startButton.png");

    // リザルト
    tm.graphics.TextureManager.add("resultBackground", "img/resultBackground.png");
    tm.graphics.TextureManager.add("resultText", "img/resultText.png");

    // サウンド
    tm.sound.SoundManager.add("bgm", "sound/bgm/bgm", 1);
    tm.sound.SoundManager.add("op", "sound/bgm/op", 1);
    tm.sound.SoundManager.add("decide", "sound/se/decide.wav");
    tm.sound.SoundManager.add("touch", "sound/se/touch.wav");
});

var circleWave = function(rad){
    var c = tm.graphics.Canvas();
    c.width = c.height = 256;
    c.setTransformCenter();
    c.setColorStyle("white", "rgb(255, 255, 255)");
    c.strokeCircle(0, 0, rad);

    return c;
}

var nextStageBackground = (function(){
    var c = tm.graphics.Canvas();
    c.width = 640;
    c.height = 188;
    c.fillStyle = "hsla(210, 10%, 10%, 0.75)";
    c.fillRect(0, 0, c.width, c.height);

    return c;
})();

/**
 * ベタ張り画像
 */
var GeneralSprite = tm.createClass({
    superClass: tm.app.Sprite,

    init: function(x, y, w, h, img, scale){
        this.superInit(w, h);
        this.position.set(x, y);
        this.scaleX = this.scaleY = scale;
        this.setImage(img);
    },

    update: function(){
    }
});