/**
 * Created by Administrator on 2018/10/26.
 */
var canvas;
(function clock() {
    canvas = document.createElement('canvas');
    canvas.width=200;
    canvas.height=200;

    var stage = new createjs.Stage(canvas);

    var hour,minute,second;

    var bg = new createjs.Shape();
    bg.graphics.f("orange").dr(0,0,200,200);
    stage.addChild(bg);
    

    //时钟的外圆
    function circleOut() {
        var circle = new createjs.Shape();
        circle.graphics.ss(4).s("black").f("white").dc(0,0,90);
        circle.x = 100;
        circle.y = 100;
        stage.addChild(circle);
    }

    //时针
    function hourLine() {
        hour = new createjs.Shape();
        hour.graphics.ss(10).s("black").mt(0,20).lt(0,-50);
        hour.x = 100;
        hour.y = 100;
        hour.rotation = 0;
        stage.addChild(hour);
    }

    //分针
    function minuteLine() {
        minute = new createjs.Shape();
        minute.graphics.ss(7).s("black").mt(0,20).lt(0,-70);
        minute.x = 100;
        minute.y = 100;
        minute.rotation = 0;
        stage.addChild(minute);
    }

    //秒针
    function secondLine() {
        second = new createjs.Shape();
        second.graphics.ss(4).s("red").mt(0,20).lt(0,-80);
        second.x = 100;
        second.y = 100;
        second.rotation = 0;
        stage.addChild(second);
    }

    //时钟最中心的小圆
    function circleMin() {
        var circleM = new createjs.Shape();
        circleM.graphics.ss(2).s("orange").f("red").dc(0,0,5);
        circleM.x = 100;
        circleM.y = 100;
        stage.addChild(circleM);
    }

    //时钟刻度
    function cacheLine() {

        for (var i = 0; i < 12; i++){
            var cache = new createjs.Shape();
            cache.graphics.ss(2).s("orange").mt(0,-70).lt(0,-80);
            cache.x = 100;
            cache.y = 100;
            cache.rotation = i * 30;
            stage.addChild(cache);
        }

    }

    function init() {
        circleOut();
        hourLine();
        minuteLine();
        secondLine();
        circleMin();
        cacheLine();
    }

    function start() {
        init();
        createjs.Ticker.timingMode = createjs.Ticker.RAF;
        createjs.Ticker.setFPS(60);
        createjs.Ticker.addEventListener('tick', handleTicker);
    }

    function handleTicker() {
        hour.rotation = (new Date()).getHours() * 30;
        minute.rotation = (new Date()).getMinutes() * 6;
        second.rotation = (new Date()).getSeconds() * 6;
        stage.update();
    }

    start();
})();