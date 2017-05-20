/**
 * Created by Tarnos on 2017-04-10.
 */

lotfw.controller("CanvasController", function($scope, Battle, Game){
    $scope.battle = Battle;
    $scope.game = Game;
    /* Settings, delay, timers */
    var delayBeforeNextBattle = 500;
    var time;
    var timer = 16;//fake 16ms timer, call it game tick.
    var dt = 0;


    /* Canvas */
    var canvas = document.getElementById("battleCanvas");
    var ctx = canvas.getContext("2d");
    var image = new Image();

    /* Can be used to resize canvas */
    var canvasContainer = document.getElementById("canvasContainer");

    /* Init battle stage */
    function init(){
        image.onload = function(){
            $scope.battle.init();
            delayBeforeNextBattle = 500;
        };
        image.src = "img/background/Forest.png";
    }

    /* Main loop */
    function mainLoop(){
        // var now = new Date().getTime(),
        //     dt = now - (time || now);
        // time = now;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        update();//fake 16ms
        render();
        window.requestAnimationFrame(mainLoop);
    }

    function render(){
        // draw background
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        var color = ["red", "blue", "yellow"];//hp/exp/atb;
        var enemies = $scope.battle.enemy.length;
        var margin = 20;
        var totalWidth = (canvas.width - margin) / enemies - margin;

        drawEntityBackground(0, 60, canvas.width);//for enemies
        drawEntityBackground(canvas.width / 2 - 70, canvas.height - 140, 140);//for player
        for(var i = 0; i <= enemies; i++) {
            //if we go over the enemy length, then add player to the drawing process, not the best way, but works
            var w = totalWidth;
            var h = 15;
            var x = margin + ((totalWidth + margin) * i);
            var y = 100;
            if(i === $scope.battle.enemy.length){
                var entity = $scope.battle.player;
                var w = 100;
                var h = 15;
                var x = canvas.width / 2 - w / 2;
                var y = canvas.height - 100;
            }else{
                var entity = $scope.battle.enemy[i];
            }

            var name = entity.name;
            var hpPercent = entity.health / entity.getMaxHealth() * 100;
            var expPercent = entity.experience / entity.maxExperience * 100;//enemies dont have experience bars
            var atbPercent = entity.currentSpeed / entity.attackSpeed * 100;
            ctx.save();
            if(entity.isDead) {
                ctx.globalAlpha = 0.2;
            }
            drawBattleNames(x, y - h, totalWidth, name);
            if(expPercent >= 0) {
                drawBattleProgressBars(x, y, w, h, expPercent, color[1]);
            }
            drawBattleProgressBars(x, y + h, w, h, hpPercent, color[0]);
            drawBattleProgressBars(x, y + h * 2, w, h, atbPercent, color[2]);
            ctx.restore();
        }
    }

    function drawEntityBackground(x, y, width){
        var height = 100;
        ctx.save();
        ctx.fillStyle = "grey";
        ctx.globalAlpha = 0.7;
        ctx.fillRect(x, y, width, height);
        ctx.restore();
    }
    function drawBattleNames(x, y, w, name){
        ctx.font = "bold 12px sans-serif";
        var width = ctx.measureText(name).width;//width of text
        var difference = w - width;
        if(difference > 0){
            x = x + difference / 2;//center text
        }else{
            ctx.font = "10px sans-serif";//resize text if it wont fit on canvas(too many enemies)
        }
        ctx.fillText(name, x, y);
    }

    function drawBattleProgressBars(x, y, w, h, progressWidth, color){//position from where to calculate, i.e. relative position
        /* Draw health/exp/atb bars */
        var width = progressWidth / 100 * w;//should work with all positive numbers.
        ctx.save();
        ctx.fillStyle = color;
        ctx.fillRect(x, y, width, h);
        ctx.restore();
        ctx.strokeRect(x, y, w, h);
    }
    function update(){
        attack();
        // resize();//might cause some lag? THIS ALSO CLEAR CANVAS DUE TO CHANGING WIDTH/HEIGHT, EVEN IF IT IS SAME VALUE
    }

    function attack(){
        if($scope.battle.enemy.length && !$scope.battle.player.isDead){
            $scope.battle.attack(timer / 1000);
        }
        else if(delayBeforeNextBattle <= 0){
            if($scope.battle.player.isDead) {
                $scope.game.prevEnemy();//since we died, take us to previous enemy which should be easier
                $scope.battle.player.isDead = false;//revive player
            }else {
                $scope.game.nextEnemy();
            }
            init();
        }else{
            delayBeforeNextBattle -= timer;
        }
    }
    function resize(){
        var containerWidth = canvasContainer.clientWidth -30; // remove padding
        var containerHeight = canvasContainer.clientHeight;
        canvas.width = containerWidth;
        canvas.height = containerHeight;
        console.log("Resized window: resized canvas to match width and height");
    }
    window.addEventListener("resize", resize);
    init();
    mainLoop();
    resize();
});