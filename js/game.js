/**
 * 石の配置初期化
 */
function initBoard(){
    currentSize.width = Math.rand(4, MAX_WIDTH);
    currentSize.height = Math.rand(4, MAX_HEIGHT);

    getMargin();

    //goalStonesLabel.text = Math.rand(0, currentSize.width * currentSize.height);    // 目標の白石数
    goalStonesLabel.text = 0;

    var margin = getMargin();

    // 石の初期化
    for(var i = 0; i < MAX_WIDTH; i++){
        for(var j = 0; j < MAX_HEIGHT; j++){
            if( i < currentSize.width && j < currentSize.height ){
                stone[i][j].color = Math.rand(0,1);
                stone[i][j].visible = true;
                stone[i][j].setPosition(i, j, margin);
                stone[i][j].changeColor();
            }
            else{
                stone[i][j].visible = false;
            }
            stone[i][j].alpha = 0;
        }
    }

    setTotalWhiteStone();
    showBoard(0);
}

/**
 * 白石の総数をセット
 */
function setTotalWhiteStone(){
    whiteStoneLabel.text = 0;
    for(var i = 0; i < currentSize.width; i++){
        for(var j = 0; j < currentSize.height; j++){
            if(stone[i][j].color == 0){ ++whiteStoneLabel.text; }
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
 * 中央揃えのためのマージンを取得
 */
function getMargin(){
    var marginW = (app.width - (stone[0][0].width / 2) * currentSize.width) / 2;

    return marginW;
}

/**
 * タッチ数からスコアの倍率を取得
 */
function getScoreFromTouchCount(tc){
    var iter = tc-1;
    if(tc-1 > 10){ iter = 10; }

    var magnification = new Array(10,10,9,9,9,8,8,7,7,6,5);

    return magnification[iter];
}