var PauseScene = tm.createClass({
    superClass: tm.app.Scene,
    
    init: function(audio) {
        this.superInit();
        this.interaction;
        
        var filter = tm.app.Sprite(app.width, app.height);
        filter.setPosition(app.width/2, app.height/2);
        filter.canvas.clearColor("rgba(0, 0, 0, 0.75)");
        this.addChild(filter);
        
        app.stop();
        this.audio = audio;
        this.audio.pause();
    },
    
    onfocus: function() {
        app.start();
    },
    
    onblur: function() {
        app.stop();
    },
    
    onmousedown: function() {
        this.audio.play();
        app.popScene();
    },
});