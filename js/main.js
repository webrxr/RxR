// グローバルな設定
var MAX_WIDTH = 8;
var MAX_HEIGHT = 8;
var currentSize = {
    "width": 0,
    "height": 0
};
var currentScale = 0.75;

tm.main(function(){
    app = tm.app.CanvasApp("#world");
    app.background = "black";
    app.enableStats();
    app.fitWindow();

    //gameOver = false;
    //timeUp = 0;             // タイムアップ

    gameData = tm.util.DataManager.get("user-data");
    userData = tm.util.DataManager.get("user-data");

    // シーンの生成
    titleScene = TitleScene();
    mainScene = MainScene();
    endScene = EndScene();

    app.replaceScene(titleScene);

    // タイマーの生成
    timer = Timer();
    mainScene.addChild(timer);

    // BGM
    op = tm.sound.SoundManager.get("op");
    op.loop = true;
    op.play();

    bgm = tm.sound.SoundManager.get("bgm");
    bgm.loop = true;


//    touchCount = 0;         // タッチ数

//    levelLabel = StatusLabel(0, 32);
//
//    scoreLabel = StatusLabel(0, 24);

//    whiteStoneLabel = StatusLabel(350, 55, 32);
//    mainScene.addChild(whiteStoneLabel);

//    goalStonesLabel = StatusLabel(440, 55, 32);
//    mainScene.addChild(goalStonesLabel);

//    touchCountLabel = StatusLabel(380, 235, 48);
//    endScene.addChild(touchCountLabel);

//    timeLabel = StatusLabel(380, 305, 48);
//    endScene.addChild(timeLabel);


    // 石の生成
    stone = [];
    for(var i = 0; i < MAX_WIDTH; i++){
        stone[i] = [];
        for(var j = 0; j < MAX_HEIGHT; j++){
            stone[i][j] = Stone(i, j);
            mainScene.addChild(stone[i][j]);
        }
    }

    app.run();
});