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
    //app.enableStats();
    app.fitWindow();

    userData = tm.util.DataManager.get("user-data");
    gameData = tm.util.DataManager.get("game-data");
    gameData.maxTime = gameData.time;

    app.replaceScene(TitleScene());

    app.run();
});