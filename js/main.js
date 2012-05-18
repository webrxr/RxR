// リソースの読み込み
tm.preload(function() {
    tm.graphics.TextureManager.add("whiteStone", "img/whiteStone.png");
    tm.graphics.TextureManager.add("blackStone", "img/blackStone.png");
});

var MAX_WIDTH = 8;
var MAX_HEIGHT = 8;
var currentSize = {
    "width": 0,
    "height": 0
};
var whiteStones = 0;
var goalStones = 0;

tm.main(function(){
    app = tm.app.CanvasApp("#world");
    app.background = "black";

    // グローバルな値の初期化
    var timer = 0;
    var gameOver = false;

    // シーンの生成
    var startScene = tm.app.StartScene();
    var mainScene = tm.app.Scene();
    var endScene = tm.app.EndScene();
    startScene.onmousedown = null;

    app.replaceScene(startScene);

    // 石
    stone = new Array();
    for(var i = 0; i < MAX_WIDTH; i++){
        stone[i] = new Array();
        for(var j = 0; j < MAX_HEIGHT; j++){
            stone[i][j] = Stone(i, j);
            mainScene.addChild(stone[i][j]);
        }
    }

    // 石の初期化
    initBoard();
    setTotalWhiteStone();
    showBoard(0);

    startScene.update = function(){
        app.replaceScene(mainScene);
    };

    mainScene.update = function(app) {
        ++timer;

        if(goalStones == whiteStones){
            console.log("Clear!");
            initBoard();
            setTotalWhiteStone();
            showBoard(0);
        }

        if(timer % 60 == 0){
            //gameOver = true;
        }
        else if(gameOver == true){
            gameOver = false;
            app.replaceScene(endScene);
        }
    };

    endScene.update = function(){
        if(app.pointing.getPointingStart()){
            app.replaceScene(startScene);
        }
    };

    app.run();
});

/**
 * 石の配置初期化
 */
function initBoard(){
    currentSize.width = Math.rand(4, MAX_WIDTH);
    currentSize.height = Math.rand(4, MAX_HEIGHT);

    goalStones = Math.rand(0, currentSize.width * currentSize.height);    // 目標の白石数

    for(var i = 0; i < MAX_WIDTH; i++){
        for(var j = 0; j < MAX_HEIGHT; j++){
            if( i < currentSize.width && j < currentSize.height ){
                stone[i][j].color = Math.rand(0,1);
                stone[i][j].visible = true;
            }
            else{
                stone[i][j].visible = false;
            }
        }
    }
}

/**
 * 白石の総数をセット
 */
function setTotalWhiteStone(){
    whiteStones = 0;
    for(var i = 0; i < currentSize.width; i++){
        for(var j = 0; j < currentSize.height; j++){
            if(stone[i][j].color == 0){ ++whiteStones; }
        }
    }
}

/**
 * コンソールに盤面を表示
 */
function showBoard(all){
    var w = 0, h = 0;
    if(all == 0){ w = currentSize.width; h = currentSize.height; }
    else{ w = MAX_WIDTH; h = MAX_HEIGHT; }

    var debugStr = "";
    for(var i = 0; i < h; i++){
        for(var j = 0; j < w; j++){
            if(stone[j][i].color == 0){ debugStr += "["+j+"]"+"["+i+"]"+"□ | "; }
            else if(stone[j][i].color == 1){ debugStr += "["+j+"]"+"["+i+"]"+"■ | "; }
            else{ debugStr += "["+j+"]"+"["+i+"]"+stone[j][i].color+" | "; }
        }
        debugStr += "\n";
    }

    console.log(debugStr, "\n");
}

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

        this.x = this.width/2 * (x+1);
        this.y = this.height/2 * (y+1);

        this.color = Math.rand(0,1);

        this.sprite = tm.app.Sprite(this.width, this.height);
        this.sprite.scaleX = this.sprite.scaleY = 0.5;
        this.addChild(this.sprite);

        //console.log("W:H{0}:{1}, iter[{2}][{3}]".format(this.width, this.height, this.iter.i, this.iter.j));
    },

    update: function(){
        if( this.color == 0 ){ this.sprite.setImage( tm.graphics.TextureManager.get("whiteStone") ); }
        else if( this.color == 1 ){ this.sprite.setImage( tm.graphics.TextureManager.get("blackStone") ); }

        if(this.sprite.isHitPoint(app.pointing.x, app.pointing.y) == true && app.pointing.getPointingEnd() == true && this.visible == true){
            console.log("Hit! [{0}][{1}]".format(this.iter.i, this.iter.j));
            var reverseTotal = this.reverseStoneManager( this.iter.i, this.iter.j );
            setTotalWhiteStone();
            console.log("w{0},h{1}, pos{2},{3}:{4}, [0][1]{5}, [1][0]{6}, White{7}, Goal{8}".format(currentSize.width, currentSize.height, this.iter.i, this.iter.j, this.color, stone[0][1], stone[1][0], whiteStones, goalStones));
            console.log("Total:", reverseTotal);
            showBoard(0);
        }
    },

    /**
     * 各方向の裏返し処理を呼び出し、裏返した総数を返す
     */
    reverseStoneManager: function(x, y){
        var reverseTotal = 0;
        reverseTotal += this.checkReverseDirection(x, y, 1, 0);  // 右
        reverseTotal += this.checkReverseDirection(x, y, -1, 0); // 左

        reverseTotal += this.checkReverseDirection(x, y, 0, 1);  // 下
        reverseTotal += this.checkReverseDirection(x, y, 0, -1); // 上

        reverseTotal += this.checkReverseDirection(x, y, 1, -1); // 右上
        reverseTotal += this.checkReverseDirection(x, y, 1, 1);  // 右下

        reverseTotal += this.checkReverseDirection(x, y, -1, 1); // 左下
        reverseTotal += this.checkReverseDirection(x, y, -1, -1);    // 左上

        if( reverseTotal > 0){
            var color = this.color;
            var anotherColor = 0;
            if(color == 0) { anotherColor = 1; }

            this.color = anotherColor;
        }

        return reverseTotal;
    },

    /**
     * 1方向に裏返しチェック
     */
    checkReverseDirection: function(x, y, vx, vy){
        // 壁までの距離
        var range = this.getToRange(x, y, vx, vy);
        //console.log("vec{0},{1}, range{2},{3}".format(vx, vy, range[0], range[1]));

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

        if(vx == 1) { rangeW = currentSize.width-y-1; }
        else if(vx == -1) { rangeW = y; }
        if(vy == 1) { rangeH = currentSize.height-x-1; }
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
                if( stone[x+(i*vy)][y+(i*vx)].color == anotherColor ){ break; }
                stone[x+(i*vy)][y+(i*vx)].color = anotherColor;
                console.log("["+ (x+(i*vy)) + "]" + "[" + (y+(i*vx)) + "], ");
            }

            return count;
        }
    },

    /**
     * 壁までの距離を方向ごとに調整
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
     * 1方向の裏返えした数
     */
    getReverseCount: function(x, y, vx, vy, range, wall, color, anotherColor){
        var count = 0;
        var sameColor = false;

        var debugStr = "";

        for(var i = 1; i < wall+1; i++){
            // 盤面端の場合は離脱
            if( (x+(i*vy)) < 0 ){ break;}
            else if( (y+(i*vx)) < 0 ){ break;}
            else if( (x+(i*vy)) > this.height ){ break;}
            else if( (y+(i*vx)) > this.width ){ break;}

            debugStr += "["+ (x+(i*vy)) + "]" + "[" + (y+(i*vx)) + "]"/* + ":" + stone[x+(i*vy)][y+(i*vx)].color*/+", ";
            if( stone[x+(i*vy)][y+(i*vx)].color == color ){
                ++count;
            }
            else if( stone[x+(i*vy)][y+(i*vx)].color == anotherColor ){
                sameColor = true;
                break;
            }
            debugStr += "\n";
        }

        var col = this.color;
        if( col == 0){ col = "■"; }
        else if( col == 1 ){ col = "□"; }
        console.log("v{0},{1}, range{2},{3}, wall:{4}, {5}:{6}, {7}".format(vx, vy, range[0], range[1], wall, col, count, "\n"+debugStr));

        if(sameColor == false || count == 0){ return 0; }
        else{ return count; }
    }
});