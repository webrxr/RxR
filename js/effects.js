var effetcTime = 100;
/**
 * タイマー
 */
var Timer = tm.createClass({
    superClass: tm.app.CanvasElement,

    init: function(limit){
        this.superInit();
        this.x = 0;
        this.y = 320;
        this.plus = 0;
        this.plusTmp = 0;
        this.width = app.width;
        this.color = "hsla(200, 75%, 50%, 0.90)";
        this.timerSpeed = this.width / limit;
    },

    update: function(){
        if(this.plus > 0){
            this.plus -= this.plusTmp;
            this.width += this.plusTmp;
            if(this.width >= app.width){ this.width = app.width; }
        }
        else{
            this.width -= this.timerSpeed;
            ++userData.time;
            --gameData.time;
        }
    },

    draw: function(canvas) {
        canvas.fillStyle = this.color;
        canvas.fillRect(this.x, this.y, this.width, 30);
    },

    plusTime: function(plus){
        this.plus = plus * this.timerSpeed;
        this.plusTmp = this.plus / effetcTime;
        gameData.time += plus;
        if(gameData.time >= gameData.maxTime){ gameData.time = gameData.maxTime; }
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

        this.timer = effetcTime;

        this.reset = reset;
    },

    update: function(){
        this.timer -= 1;
        if(this.timer <= 0){
            if(this.reset){
                userData.touchCount = 0;
                mainScene.initBoard();
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