/**
 * 石
 */
var Stone = tm.createClass({
    superClass: tm.app.CanvasElement,

    init: function(x, y){
        this.superInit();
        this.iter = {
            "i":x,
            "j":y
        };
        this.width = this.height = 94;
        this.interaction.enabled = false;   // 自身では判定しない

        this.x = 0;
        this.y = 0;

        this.color = Math.rand(0,1);
        this.WHITE_COLOR = 0;
        this.BLACK_COLOR = 1;

        this.frameSprite = tm.app.Sprite(120,120);
        this.frameSprite.scaleX = this.frameSprite.scaleY = 0.5;
        this.frameSprite.setImage( tm.graphics.TextureManager.get("stoneFrame") );
        this.addChild(this.frameSprite);

        this.sprite = tm.app.Sprite(this.width, this.height);
        this.sprite.scaleX = this.sprite.scaleY = 0.5;
        this.addChild(this.sprite);
        this.changeColor();
        this.sprite.interaction.setBoundingType("rect");
        this.sprite.onmousedown = function(e) { this.parent.dispatchEvent(e); };
        // this.sprite.draw = function(canvas) { this.drawBoundingRect(canvas); }
    },

    fadeIn: function() {
        // アルファアニメ
        this.animation.addTween({
            prop: "alpha",
            begin: 0,
            finish: 1,
            duration: 1000
        });
    },

    /**
     * 石の色をリセット
     */
    changeColor: function(){
        if( this.color == this.WHITE_COLOR ){ this.sprite.setImage( tm.graphics.TextureManager.get("whiteStone") ); }
        else if( this.color == this.BLACK_COLOR ){ this.sprite.setImage( tm.graphics.TextureManager.get("blackStone") ); }
    }
});