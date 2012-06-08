/**
 * タイマー
 */
var Timer = tm.createClass({
    superClass: tm.app.CanvasElement,

    init: function(){
        this.superInit();
        this.limit = 60*30;
        this.x = 0;
        this.y = 320;
        this.width = app.width;
        this.color = "hsla(200, 75%, 50%, 0.90)";
        this.timerSpeed = this.width / this.limit;
    },

    update: function(){
        this.width -= this.timerSpeed;
    },

    draw: function(canvas) {
        canvas.fillStyle = this.color;
        canvas.fillRect(this.x, this.y, this.width, 30);
    }
});

/**
 * 波紋
 */
var Wave = tm.createClass({
    superClass: tm.app.CanvasElement,

    init: function(x, y, img) {
        this.superInit();
        this.x = x;
        this.y = y;
        this.timer = 20;

        var self = this;
        var particle = tm.app.Sprite(256,256);
        particle.setImage(img);
        particle.update = function(){
            this.scaleX += 0.05;
            this.scaleY += 0.05;
            this.alpha = (self.timer/30.0);
        }
        this.addChild(particle);
    },

    update: function(){
        this.timer -= 1;
        if(this.timer <= 0){ this.remove(); }
    }
});

/**
 * クリアーエフェクト
 */
var ClearEffect = tm.createClass({
    superClass:tm.app.CanvasElement,

    init: function(x,y,w,h,img,reset){
        this.superInit(w, h);
        this.position.set(x, y);
        this.scaleX = this.scaleY = currentScale;

        var particle = tm.app.Sprite(640, 188);
        particle.setImage(img);
        this.addChild(particle);

        this.timer = 100;

        this.reset = reset;
    },

    update: function(){
        this.timer -= 1;
        if(this.timer <= 0){
            if(this.reset){
                userData.level += 1;
                userData.touchCount = 0;
                initBoard();
            }

            this.remove();
        }
        else if(this.timer <= 30){
            this.alpha -= 0.04;
            if(this.alpha < 0){ this.alpha = 0; }
        }

        if(gameData.timeUp != 0){
            userData.touchCount = 0;
            this.remove();
        }
    }
});