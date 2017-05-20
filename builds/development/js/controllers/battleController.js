/**
 * Created by Tarnos on 2017-01-06.
 */

lotfw.controller('BattleCtrl', function($scope, Battle, Game, $interval){
    var battleTimer = null;
    $scope.battle = Battle;//Battle object which store methods/player/enemies...
    $scope.Game = Game;
    $scope.enemies = $scope.battle.enemy;
    $scope.figting = false;
    $scope.isAuto = false;//if auto battle is on
    $scope.isAutoNext = false;//check if should auto change enemy when winning a battle, set to false when player dies and change enemy Id minus 1, so it go back each time player loses
    var timer = 10;//ms speed for update, how fast game is updating/refresing, it does not affect actual game "speed"
    var delayBeforeNextBattle = 500;
    $scope.startBattle = function() {
        battleTimer = $interval($scope.attack, timer);
        $scope.battle.init();
        $scope.isAuto = true;
    };
    $scope.attack = function(){
        if(Battle.enemy.length && !Battle.player.isDead){
            $scope.battle.attack(timer / 1000);
        }
        else if(delayBeforeNextBattle <= 0){
            if(Battle.player.isDead) {
                Game.prevEnemy();//since we died, take us to previous enemy which should be easier
                Battle.player.isDead = false;//revive player
            }else {
                Game.nextEnemy();
            }
            $scope.battle.init();
            delayBeforeNextBattle = 500;
        }else{
            delayBeforeNextBattle -= timer;
        }
    };
    //might need to destroy interval, in case of provider which instantiate a controller, which will result in calling a function below again thus creating second interval and doubling battle speed
    $scope.$on("$destroy",function(){
        if (angular.isDefined(battleTimer)) {
            $interval.cancel(battleTimer);
        }
    });
    $scope.startBattle();
});