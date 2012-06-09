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

        this.x = 0;
        this.y = 0;

        this.color = Math.rand(0,1);

        this.frameSprite = tm.app.Sprite(120,120);
        this.frameSprite.scaleX = this.frameSprite.scaleY = 0.5;
        this.frameSprite.setImage( tm.graphics.TextureManager.get("stoneFrame") );
        this.addChild(this.frameSprite);

        this.sprite = tm.app.Sprite(this.width, this.height);
        this.sprite.scaleX = this.sprite.scaleY = 0.5;
        this.addChild(this.sprite);
        this.changeColor();
    },

    update: function(){

        if(this.alpha < 1){ this.alpha += 0.05; }

        if (app.pointing.getPointingEnd() == false ) return;
        if (this.visible == false) return;
        if (gameData.timeUp != 0) return;

        if(this.sprite.isHitPoint(app.pointing.x, app.pointing.y) == true){
            var reverseTotal = this.reverseStoneManager( this.iter.i, this.iter.j );
            if(reverseTotal){
                tm.sound.SoundManager.get("touch").play();
                mainScene.setTotalWhiteStone()
                mainScene.showBoard(0);

                ++userData.touchCount;
                ++userData.touchTotalCount;

                userData.score += 30 * reverseTotal * this.getScoreFromTouchCount(userData.touchCount);
                if(userData.score < 0){ userData.score = 0; }

                // 波紋
                var wave = Wave(this.x, this.y, circleWave(32));
                app.currentScene.addChild( wave );

                // クリアー判定
                if( gameData.whiteStone == gameData.goalStone ){
                    userData.score += 1000 * (currentSize.width+currentSize.height-userData.touchCount);
                    if(userData.score < 0){ userData.score = 0; }

                    userData.level += 1;
                    mainScene.timer.plusTime( 3 * (currentSize.width+currentSize.height) );

                    var bg = ClearEffect(240, 360, 640, 188, nextStageBackground, false);
                    app.currentScene.addChild( bg );

                    var next = ClearEffect(240, 360, 640, 188, tm.graphics.TextureManager.get("nextStage"), true);
                    app.currentScene.addChild( next );

                    var wave = Wave(240, 360, circleWave(128));
                    app.currentScene.addChild( wave );
                }
                else if( gameData.whiteStone == (currentSize.width*currentSize.height) ){
                    userData.score -= 1000 * (currentSize.width+currentSize.height);
                    if(userData.score < 0){ userData.score = 0; }

                    userData.level -= 1;
                    if(userData.level < 1){ userData.level = 1; }

                    var bg = ClearEffect(240, 360, 640, 188, nextStageBackground, false);
                    app.currentScene.addChild( bg );

                    var miss = ClearEffect(240, 360, 640, 188, tm.graphics.TextureManager.get("missTake"), true);
                    app.currentScene.addChild( miss );
                }
            }
        }
    },

    /**
     * 石の色をリセット
     */
    changeColor: function(){
        if( this.color == 0 ){ this.sprite.setImage( tm.graphics.TextureManager.get("whiteStone") ); }
        else if( this.color == 1 ){ this.sprite.setImage( tm.graphics.TextureManager.get("blackStone") ); }
    },

    /**
     * 石の位置をリセット
     */
    setPosition: function(x, y, margin){
        this.x = this.width/2 * x + margin + this.width/4;
        this.y = this.height/2 * (y+1) + 160;
    },

    /**
     * 各方向の裏返し処理を呼び出し、裏返した総数を返す
     */
    reverseStoneManager: function(x, y){
        var reverseTotal = 0;
        reverseTotal += this.checkReverseDirection(x, y, -1, 0);    // 上
        reverseTotal += this.checkReverseDirection(x, y, 0, 1);     // 右
        reverseTotal += this.checkReverseDirection(x, y, 1, 0);     // 下
        reverseTotal += this.checkReverseDirection(x, y, 0, -1);    // 左

        reverseTotal += this.checkReverseDirection(x, y, -1, 1);    // 右上
        reverseTotal += this.checkReverseDirection(x, y, 1, 1);     // 右下
        reverseTotal += this.checkReverseDirection(x, y, 1, -1);    // 左下
        reverseTotal += this.checkReverseDirection(x, y, -1, -1);   // 左上

        if( reverseTotal > 0){
            var color = this.color;
            var anotherColor = 0;
            if(color == 0) { anotherColor = 1; }

            this.color = anotherColor;
            this.changeColor();
        }

        return reverseTotal;
    },

    /**
     * 1方向に裏返しチェック
     */
    checkReverseDirection: function(x, y, vx, vy){
        // 壁までの距離
        var range = this.getToRange(x, y, vx, vy);

        //!< 裏返す
        if( !(range[1] == 0 && range[0] == 0) ){ return this.reverseStone(x, y, vx, vy, range); }
        return 0;
    },

    /**
     * 壁までの各方向の距離
     */
    getToRange: function(x, y, vx, vy){
        var rangeW = 0;
        var rangeH = 0;

        if(vx == 1) { rangeW = currentSize.height-y-1; }
        else if(vx == -1) { rangeW = y; }
        if(vy == 1) { rangeH = currentSize.width-x-1; }
        else if(vy == -1) { rangeH = x; }

        var range = new Array(rangeW, rangeH);

        return range;
    },

    /**
     * 裏返えし処理
     */
    reverseStone: function(x, y, vx, vy, range){
        var count = 0;
        var anotherColor = 0;
        var color = this.color;
        if(color == 0) { anotherColor = 1; }

        var wall = this.getOptimumRange(vx, vy, range[0], range[1]);
        count = this.getReverseCount(x, y, vx, vy, range, wall, color, anotherColor);

        if( count == 0 ){ return 0; }
        else{
            for(var i = 1; i < wall+1; i++){
                if( mainScene.stone[x+(i*vy)][y+(i*vx)].color == anotherColor ){ break; }
                mainScene.stone[x+(i*vy)][y+(i*vx)].color = anotherColor;
                mainScene.stone[x+(i*vy)][y+(i*vx)].changeColor();

                // 波紋
                var wave = Wave(mainScene.stone[x+(i*vy)][y+(i*vx)].x, mainScene.stone[x+(i*vy)][y+(i*vx)].y, circleWave(32));
                app.currentScene.addChild(wave);
            }

            return count;
        }
    },

    /**
     * 壁までの距離を方向ごとに調整した値を返す
     */
    getOptimumRange: function(vx, vy, rangeW, rangeH){
        var wall = 0;
        if(rangeH < rangeW) { wall = rangeW; }
        else { wall = rangeH; }
        if( vx != 0 && vy != 0 ){
            if(rangeH < rangeW) { wall = rangeH; }
            else { wall = rangeW; }
        }

        return wall;
    },

    /**
     * 1方向の裏返えした数を返す
     */
    getReverseCount: function(x, y, vx, vy, range, wall, color, anotherColor){
        var count = 0;
        var sameColor = false;

        for(var i = 1; i < wall+1; i++){
            if( mainScene.stone[x+(i*vy)][y+(i*vx)].color == color ){
                ++count;
            }
            else if( mainScene.stone[x+(i*vy)][y+(i*vx)].color == anotherColor ){
                sameColor = true;
                break;
            }
        }

        var col = this.color;
        if( col == 0){ col = "■"; }
        else if( col == 1 ){ col = "□"; }

        if(sameColor == false || count == 0){ return 0; }
        else{ return count; }
    },

    /**
     * タッチ数からスコアの倍率を取得
     */
    getScoreFromTouchCount: function(tc){
        var iter = tc-1;
        if(tc-1 > 10){ iter = 10; }

        var magnification = new Array(10,10,9,9,9,8,8,7,7,6,5);

        return magnification[iter];
    }
});
/**
 * ステータスのラベル
 */
var StatusLabel = tm.createClass({
    superClass: tm.app.Label,

    init: function(x, y, size){
        this.superInit(128, 128);
        this.x = x;
        this.y = y;
        this.size = size;
        this.text = 0;
        this.align = "end";
        this.baseline = "top";
        this.width = app.width;
    },

    update: function(){
    }
});