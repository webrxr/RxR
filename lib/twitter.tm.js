/**
 * twitter.tm.js
 * 
 * @version     0.1.0
 * @requires    tmlib.js v0.1.2
 * https://github.com/phi1618/twitter.tm.js
 * MIT licensed
 * 
 * Copyright (C) 2012 phi, http://tmlife.net
 */

tm.twitter = tm.twitter || {};


(function() {
    
    tm.preload(function() {
        // tm.graphics.TextureManager.add("twitter", "https://twitter.com/images/three_circles/twitter-bird-light-bgs.png");
        tm.graphics.TextureManager.add("twitter", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYxIDY0LjE0MDk0OSwgMjAxMC8xMi8wNy0xMDo1NzowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpGNzdGMTE3NDA3MjA2ODExOEY2MkVGMkNDRkUzNjI5OCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDozQTI3OTdGMEEzNzUxMUUxQTI2Q0M1MDcxNTQ1QTc1MCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozQTI3OTdFRkEzNzUxMUUxQTI2Q0M1MDcxNTQ1QTc1MCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1LjEgTWFjaW50b3NoIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6Rjc3RjExNzQwNzIwNjgxMThGNjJFRjJDQ0ZFMzYyOTgiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6Rjc3RjExNzQwNzIwNjgxMThGNjJFRjJDQ0ZFMzYyOTgiLz4gPC9yZGY6RGVzY3Jp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");
    });
    
        
    tm.twitter.TweetButton = tm.createClass({
        superClass: tm.app.Sprite,
        
        init: function(msg) {
            this.superInit(170, 50);
            
            this.msg = msg;
            
            this.canvas.fillStyle = "#444";
            this.canvas.setShadow("#aaa", 0, 0, 4);
            this.canvas.fillRoundRect(1, 1, this.width-3, this.height-3, 5);
            this.alpha = 0.75;
            
            var icon = tm.app.Sprite(300, 300);
            icon.setImage( tm.graphics.TextureManager.get("twitter") );
            icon.x = -50;
            icon.width = 50;
            icon.height = 50;
            this.addChild(icon);
            var label = tm.app.Label("Tweet");
            label.x = 20;
            label.align = "center";
            label.baseline = "middle";
            this.addChild(label);
            
            
            var filter = tm.app.Sprite(170, 50);
            this.canvas.roundRect(0, 0, 170, 50);
            this.canvas.clip();
            
            var grad = tm.graphics.LinearGradient(0, 0, 0, 50);
            
            // grad.addColorStop(0.0, "hsl(  0, 75%, 50%)");
            // grad.addColorStop(0.5, "hsl(120, 75%, 50%)");
            // grad.addColorStop(1.0, "hsl(240, 75%, 50%)");
            grad.addColorStop(0.0, "rgba(255,255,255,0.9)");
            grad.addColorStop(0.5, "rgba(255,255,255,0.3)");
            grad.addColorStop(0.51, "rgba(255,255,255,0)");
            grad.addColorStop(1.0, "rgba(255,255,255,0.0)");
            
            this.canvas.setGradient(grad);
            this.canvas.fillRect(0, 0, 170, 50);
            this.addChild(filter);
            
            this.interaction;
        },
        
        onmouseover: function() {
            this.alpha = 1.0;
        },
        
        onmouseout: function() {
            this.alpha = 0.75;
        },
        
        onmousedown: function() {
            var url = "http://twitter.com/?status={status}".format({
                status: encodeURIComponent(this.msg)
            });
            window.open(url, "_self");
        },
    });
    
    
})();

