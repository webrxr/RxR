// グローバルな設定
var CURRENT_SCALE = 0.75;

tm.preload(function() {
  app = tm.app.CanvasApp("#world");
  app.background = "black";
  //app.enableStats();
  app.fitWindow();

  app.replaceScene(tm.app.LoadingScene({width:app.width, height:app.height}));

  app.run();

  userData = tm.util.DataManager.get("user-data");
  gameData = tm.util.DataManager.get("game-data");
  gameData.maxTime = gameData.time;
});

tm.main(function(){

  app.replaceScene(TitleScene());

});