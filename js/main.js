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

    userData = tm.util.DataManager.get("user-data");
    gameData = tm.util.DataManager.get("game-data");
    gameData.mode = "titleReady";

    // シーンの生成
    titleScene = TitleScene();
    mainScene = MainScene();
    endScene = EndScene();

    app.replaceScene(titleScene);

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