(function(ns) {
        
    // 画像のリスト
    var IMAGES = {
        // バックグラウンド画像
        "gameBackground": {
            "image": "gameBackground",
            "rect": [240, 360, 640, 960],
        },
        
        "gameStatus": {
            "image": "gameStatus",
            "rect": [240, 60, 640, 120],
        }
    };

    // ラベルのリスト
    var LABELS = {
        "levelLabel": {
            "type": "Label",
            "name": "levelLabel",
            "x": 255,
            "y": 60,
            "width": 150,
            "height": 40,
            "text": 0,
            "align": "end",
            "fontSize": 32,
        },
        "scoreLabel": {
            "type": "Label",
            "name": "scoreLabel",
            "x": 253,
            "y": 90,
            "width": 150,
            "height": 40,
            "text": 0,
            "align": "end",
            "fontSize": 24,
        },
        "whiteStoneLabel": {
            "type": "Label",
            "name": "whiteStoneLabel",
            "x": 350,
            "y": 90,
            "width": 150,
            "height": 40,
            "text": 0,
            "align": "end",
            "fontSize": 32,
        },
        "goalStonesLabel": {
            "type": "Label",
            "name": "goalStonesLabel",
            "x": 440,
            "y": 90,
            "width": 150,
            "height": 40,
            "text": 0,
            "align": "end",
            "fontSize": 32,
        },
    };
    
    ns.MainScene = tm.createClass({
        superClass: tm.app.Scene,
    
        init: function(){
            this.superInit();
            
            // ステータスリセット
            userData.gameOver = false;
            gameData.timeUp = 0;
            userData.touchTotalCount = 0;
            userData.time = 1;
            userData.level = 1;
            userData.score = 0;
            userData.gameOver = false;
            this.alpha = 1.0;
            gameData.time = gameData.maxTime;
    
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
            for(var key in LABELS){
                var value = LABELS[key];
                var label = tm.app.Label(value.width, value.height);
                label.width = value.width;
                label.height = value.height;
                label.position.set(value.x, value.y);
                label.text = value.text;
                label.align = value.align;
                label.fontSize = value.fontSize;
                this[key] = label;
                this.addChild(label);
            }
            
            // クリア時の演出時間
            this.NEXT_TIME = 90;
            this.nextTime = 0;
            
            // 盤面の最大幅
            this.MAX_WIDTH = 8;
            this.MAX_HEIGHT = 8;
            
            this.currentSize = {
                "width": 0,
                "height": 0
            };
            
            // タイマーの生成
            this.timer = Timer(gameData.time);
            this.timer.width = app.width;
            this.addChild(this.timer);
    
            // BGM
            this.bgm = tm.sound.SoundManager.get("bgm");
            this.bgm.loop = true;
    
            // 石の生成
            this.stone = [];
            for(var i = 0; i < this.MAX_WIDTH; i++){
                this.stone[i] = [];
                for(var j = 0; j < this.MAX_HEIGHT; j++){
                    this.stone[i][j] = Stone(i, j);
                    this.addChild(this.stone[i][j]);
                    this.stone[i][j].addEventListener("pointingstart", function(e) {
                        this.touchStone(e);
                    }.bind(this));
                }
            }
            
            // BGM
            this.bgm.play();
    
            // 石の初期化
            this.initBoard();
        },
    
        update: function(){
            // ラベルの更新
            this.levelLabel.text = userData.level;
            this.scoreLabel.text = userData.score;

            this.whiteStoneLabel.text = gameData.whiteStone;
            this.goalStonesLabel.text = gameData.goalStone;
            
            // ステージクリア時の演出
            if(this.nextTime > 0){
                --this.nextTime;
                if(this.nextTime == 1){ this.initBoard(); }
            }
            
            // タイムアップ時の演出
            if(gameData.timeUp != 0){ ++gameData.timeUp; }
    
            if( gameData.timeUp == 0 && gameData.time < 0 ){
                gameData.timeUp = 1;
    
                var bg = GeneralSprite(240, 360, 640, 188, CLEAR_STAGE_BACKGROUND_IMAGE, CURRENT_SCALE);
                this.addChild( bg );
    
                var sprite = GeneralSprite(240, 360, 640, 188, tm.graphics.TextureManager.get("timeUp"), CURRENT_SCALE);
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
                var self = this;
                this.addChild( tm.fade.FadeOut(
                    app.width, app.height, "#000", 1000, function() {
                        self.bgm.stop();
                        userData.time -= self.NEXT_TIME;
                        app.replaceScene(EndScene());
                    })
                );
            }
        },
    
        /**
         * 石の配置初期化
         */
        initBoard: function(){
            this.currentSize.width = Math.rand(4, this.MAX_WIDTH);
            this.currentSize.height = Math.rand(4, this.MAX_HEIGHT);
    
            this.getMargin();
    
            //gameData.goalStone = Math.rand(0, this.currentSize.width * this.currentSize.height);    // 目標の白石数
            gameData.goalStone = 0;
    
            var margin = this.getMargin();
    
            // 石の初期化
            for(var i = 0; i < this.MAX_WIDTH; i++){
                for(var j = 0; j < this.MAX_HEIGHT; j++){
                    if( i < this.currentSize.width && j < this.currentSize.height ){
                        this.stone[i][j].changeColor(Math.rand(0,1));
                        this.stone[i][j].wakeUp();
                        this.stone[i][j].visible = true;
                        this.setPosition(i, j, margin);
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
            for(var i = 0; i < this.currentSize.width; i++){
                for(var j = 0; j < this.currentSize.height; j++){
                    if(this.stone[i][j].color == 0){ ++gameData.whiteStone; }
                }
            }
        },
    
        /**
         * コンソールに盤面を表示
         */
        showBoard: function(all){
            var w = 0, h = 0;
            if(all == 0){ w = this.currentSize.width; h = this.currentSize.height; }
            else{ w = this.MAX_WIDTH; h = this.MAX_HEIGHT; }
    
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
            var marginW = (app.width - (this.stone[0][0].width / 2) * this.currentSize.width) / 2;
    
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
         * 各方向の裏返し処理を呼び出し、裏返した総数を返す
         */
        nextStage: function(score, label){
        
            userData.score += score;
            if(userData.score < 0){ userData.score = 0; }
            
            var bg = ClearEffect(240, 360, 640, 188, 3000, CLEAR_STAGE_BACKGROUND_IMAGE);
            app.currentScene.addChild( bg );
            
            var label = ClearEffect(240, 360, 640, 188, 3000, tm.graphics.TextureManager.get(label));
            app.currentScene.addChild( label );
            
            this.nextTime = this.NEXT_TIME;
            userData.touchCount = 0;
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
                var wave = Wave(this.stone[e.target.iter.i][e.target.iter.j].x, this.stone[e.target.iter.i][e.target.iter.j].y, REVERSE_WAVE_IMAGE);
                app.currentScene.addChild( wave );
    
                // クリアー判定
                if( gameData.whiteStone == gameData.goalStone ){
                    tm.sound.SoundManager.get("clear").play();
                    userData.level += 1;
                    this.timer.plusTime( 5 * (this.currentSize.width+this.currentSize.height) );
                    
                    this.nextStage( (1000*(this.currentSize.width+this.currentSize.height-userData.touchCount)), "nextStage");
    
                    var wave = Wave(240, 360, CLEAR_WAVE_IMAGE);
                    app.currentScene.addChild( wave );
                }
                else if( gameData.whiteStone == (this.currentSize.width*this.currentSize.height) ){
                    this.nextStage( (-1000*(this.currentSize.width+this.currentSize.height)), "missTake");
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
    
                this.stone[x][y].changeColor(anotherColor);
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
    
            if(vx == 1) { rangeW = this.currentSize.height-y-1; }
            else if(vx == -1) { rangeW = y; }
            if(vy == 1) { rangeH = this.currentSize.width-x-1; }
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
                    this.stone[x+(i*vy)][y+(i*vx)].changeColor(anotherColor);
    
                    // 波紋
                    var wave = Wave(this.stone[x+(i*vy)][y+(i*vx)].x, this.stone[x+(i*vy)][y+(i*vx)].y, REVERSE_WAVE_IMAGE);
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
        },
        
        // ポーズ画面 : 別タブへ切り替わった時 / Ttbキーを押した時
        onblur: function() {
            app.pushScene(PauseScene(this.bgm));
        }
    });
})(window);