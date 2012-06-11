// グローバルな設定
var CURRENT_SCALE = 0.75;

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