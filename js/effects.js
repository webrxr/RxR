var effetcTime = 90;
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
    this.shadowColor = "white";
    this.shadowBlur = 20;
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
    var particle = tm.app.Shape(256,256);
    particle.canvas = img;
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

  init: function(x,y,w,h,time,img){
    var particle;
    if(typeof img == "string"){
      particle = tm.app.Sprite(w,h, img);
    }
    else{
      particle = tm.app.Shape(w,h);
      particle.canvas = img;
    }
    this.superInit(w, h);
    this.position.set(x, y);
    this.scaleX = this.scaleY = CURRENT_SCALE;
    this.addChild(particle);
    this.fadeOut(time);

    this.life = 0;
  },

  update: function(){
    if(gameData.timeUp != 0){
      this.remove();
    }
    this.life++;
  },

  fadeOut: function(time) {
    this.animation.addTween({
      prop: "alpha",
      begin: 1,
      finish: 0,
      duration: time
    });
  },

  onanimationend: function() {
    this.remove();
  }
});