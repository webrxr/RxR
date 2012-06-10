var MainScene = tm.createClass({
    superClass: tm.app.Scene,

    init: function(){
        this.superInit();

        // バックグラウンド画像
        this.gameBackground = GeneralSprite(240, 360, 640, 960, tm.graphics.TextureManager.get("gameBackground"), currentScale);
        this.addChild(this.gameBackground);

        // ステータス
        this.gameStatus = GeneralSprite(240, 60, 640, 120, tm.graphics.TextureManager.get("gameStatus"), currentScale);
        this.addChild(this.gameStatus);

        this.levelLabel = StatusLabel(255, 25, 32);
        this.addChild(this.levelLabel);

        this.scoreLabel = StatusLabel(252, 67, 24);
        this.addChild(this.scoreLabel);

        this.whiteStoneLabel = StatusLabel(350, 55, 32);
        this.addChild(this.whiteStoneLabel);

        this.goalStonesLabel = StatusLabel(440, 55, 32);
        this.addChild(this.goalStonesLabel);

        // タイマーの生成
        this.timer = Timer(gameData.time);
        this.addChild(this.timer);

        // BGM
        this.bgm = tm.sound.SoundManager.get("bgm");
        this.bgm.loop = true;

        // 石の生成
        this.stone = [];
        for(var i = 0; i < MAX_WIDTH; i++){
            this.stone[i] = [];
            for(var j = 0; j < MAX_HEIGHT; j++){
                this.stone[i][j] = Stone(i, j);
                this.addChild(this.stone[i][j]);
                this.stone[i][j].addEventListener("mousedown", function(e) {
                    this.touchStone(e);
                }.bind(this));
            }
        }
    },

    update: function(){
        if(gameData.mode == "mainReady"){
            this.bgm.play();

            // ステータスリセット
            userData.gameOver = false;
            gameData.timeUp = 0;

            userData.touchTotalCount = 0;
            userData.time = 1;
            userData.level = 1;
            userData.score = 0;
            userData.gameOver = false;
            this.alpha = 1.0;
            this.timer.width = app.width;
            gameData.time = gameData.maxTime;

            // 石の初期化
            this.initBoard();

            gameData.mode = "mainScene";
        }

        this.levelLabel.text = userData.level;
        this.scoreLabel.text = userData.score;

        this.whiteStoneLabel.text = gameData.whiteStone;
        this.goalStonesLabel.text = gameData.goalStone;

        if(gameData.timeUp != 0){ ++gameData.timeUp; }

        if( gameData.timeUp == 0 && gameData.time < 0 ){
            gameData.timeUp = 1;

            var bg = GeneralSprite(240, 360, 640, 188, CLEAR_STAGE_BACKGROUND_IMAGE, currentScale);
            this.addChild( bg );

            var sprite = GeneralSprite(240, 360, 640, 188, tm.graphics.TextureManager.get("timeUp"), currentScale);
            this.addChild(sprite);
            sprite.update = function(){
                if(gameData.timeUp > 80){
                    userData.gameOver = true;
                    this.remove();
                    bg.remove();
                }
                else if(gameData.timeUp > 50){
                    this.alpha -= 0.04;
                    if(this.alpha < 0){ this.alpha = 0; }
                }
            }
        }
        else if(userData.gameOver == true){
            this.bgm.stop();
            gameData.mode = "endReady";
            app.replaceScene(endScene);
        }
    },

    /**
     * 石の配置初期化
     */
    initBoard: function(){
        currentSize.width = Math.rand(4, MAX_WIDTH);
        currentSize.height = Math.rand(4, MAX_HEIGHT);

        this.getMargin();

        //gameData.goalStone = Math.rand(0, currentSize.width * currentSize.height);    // 目標の白石数
        gameData.goalStone = 0;

        var margin = this.getMargin();

        // 石の初期化
        for(var i = 0; i < MAX_WIDTH; i++){
            for(var j = 0; j < MAX_HEIGHT; j++){
                if( i < currentSize.width && j < currentSize.height ){
                    this.stone[i][j].color = Math.rand(0,1);
                    this.stone[i][j].wakeUp();
                    this.stone[i][j].visible = true;
                    this.setPosition(i, j, margin);
                    this.stone[i][j].changeColor();
                }
                else{
                    this.stone[i][j].sleep();
                    this.stone[i][j].visible = false;
                }
                this.stone[i][j].alpha = 0;
                this.stone[i][j].fadeIn();
            }
        }

        this.setTotalWhiteStone();
        this.showBoard(0);
    },

    /**
     * 白石の総数をセット
     */
    setTotalWhiteStone: function(){
        gameData.whiteStone = 0;
        for(var i = 0; i < currentSize.width; i++){
            for(var j = 0; j < currentSize.height; j++){
                if(this.stone[i][j].color == 0){ ++gameData.whiteStone; }
            }
        }
    },

    /**
     * コンソールに盤面を表示
     */
    showBoard: function(all){
        var w = 0, h = 0;
        if(all == 0){ w = currentSize.width; h = currentSize.height; }
        else{ w = MAX_WIDTH; h = MAX_HEIGHT; }

        var debugStr = "";
        for(var i = 0; i < h; i++){
            for(var j = 0; j < w; j++){
                if(this.stone[j][i].color == 0){ debugStr += "["+j+"]"+"["+i+"]"+"□ | "; }
                else if(this.stone[j][i].color == 1){ debugStr += "["+j+"]"+"["+i+"]"+"■ | "; }
                else{ debugStr += "["+j+"]"+"["+i+"]"+this.stone[j][i].color+" | "; }
            }
            debugStr += "\n";
        }

        console.log(debugStr, "\n");
    },

    /**
     * 中央揃えのためのマージンを取得
     */
    getMargin: function(){
        var marginW = (app.width - (this.stone[0][0].width / 2) * currentSize.width) / 2;

        return marginW;
    },

    /**
     * 石の位置をリセット
     */
    setPosition: function(x, y, margin){
        this.stone[x][y].x = this.stone[x][y].width/2 * x + margin + this.stone[x][y].width/4;
        this.stone[x][y].y = this.stone[x][y].height/2 * (y+1) + 160;
    },

    /**
     * 石とのタッチ判定
     */
    touchStone: function(e){

        if (gameData.timeUp != 0) return;

        var reverseTotal = this.reverseStoneManager( e.target.iter.i, e.target.iter.j );
        if(reverseTotal){
            tm.sound.SoundManager.get("touch").play();
            this.setTotalWhiteStone();
            this.showBoard(0);

            ++userData.touchCount;
            ++userData.touchTotalCount;

            userData.score += 30 * reverseTotal * this.getScoreFromTouchCount(userData.touchCount);
            if(userData.score < 0){ userData.score = 0; }

            // 波紋
            var wave = Wave(e.target.iter.i, e.target.iter.j, REVERSE_CIRCLE_WAVE_IMAGE);
            app.currentScene.addChild( wave );

            console.log(gameData.whiteStone, gameData.goalStone );

            // クリアー判定
            if( gameData.whiteStone == gameData.goalStone ){
                userData.score += 1000 * (currentSize.width+currentSize.height-userData.touchCount);

                if(userData.score < 0){ userData.score = 0; }

                userData.level += 1;
                this.timer.plusTime( 3 * (currentSize.width+currentSize.height) );

                var bg = ClearEffect(240, 360, 640, 188, CLEAR_STAGE_BACKGROUND_IMAGE, false);
                app.currentScene.addChild( bg );

                var next = ClearEffect(240, 360, 640, 188, tm.graphics.TextureManager.get("nextStage"), true);
                app.currentScene.addChild( next );

                var wave = Wave(240, 360, CLEAR_CIRCLE_WAVE_IMAGE);
                app.currentScene.addChild( wave );
            }
            else if( gameData.whiteStone == (currentSize.width*currentSize.height) ){
                userData.score -= 1000 * (currentSize.width+currentSize.height);
                if(userData.score < 0){ userData.score = 0; }

                var bg = ClearEffect(240, 360, 640, 188, CLEAR_STAGE_BACKGROUND_IMAGE, false);
                app.currentScene.addChild( bg );

                var miss = ClearEffect(240, 360, 640, 188, tm.graphics.TextureManager.get("missTake"), true);
                app.currentScene.addChild( miss );
            }
        }
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
            var color = this.stone[x][y].color;
            var anotherColor = this.stone[x][y].WHITE_COLOR;
            if(color == this.stone[x][y].WHITE_COLOR) { anotherColor = this.stone[x][y].BLACK_COLOR; }

            this.stone[x][y].color = anotherColor;
            this.stone[x][y].changeColor();
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
        var anotherColor = this.stone[x][y].WHITE_COLOR;
        var color = this.stone[x][y].color;
        if(color == this.stone[x][y].WHITE_COLOR) { anotherColor = this.stone[x][y].BLACK_COLOR; }

        var wall = this.getOptimumRange(vx, vy, range[0], range[1]);
        count = this.getReverseCount(x, y, vx, vy, range, wall, color, anotherColor);

        if( count == 0 ){ return 0; }
        else{
            for(var i = 1; i < wall+1; i++){
                if( this.stone[x+(i*vy)][y+(i*vx)].color == anotherColor ){ break; }
                this.stone[x+(i*vy)][y+(i*vx)].color = anotherColor;
                this.stone[x+(i*vy)][y+(i*vx)].changeColor();

                // 波紋
                var wave = Wave(this.stone[x+(i*vy)][y+(i*vx)].x, this.stone[x+(i*vy)][y+(i*vx)].y, REVERSE_CIRCLE_WAVE_IMAGE);
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
            if( this.stone[x+(i*vy)][y+(i*vx)].color == color ){
                ++count;
            }
            else if( this.stone[x+(i*vy)][y+(i*vx)].color == anotherColor ){
                sameColor = true;
                break;
            }
        }

        var col = this.stone[x][y].color;
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