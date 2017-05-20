/**
 * Created by Tarnos on 2017-01-06.
 */

lotfw.controller('BattleCtrl', function($scope, Battle, Game, $interval){
    var battleTimer = null;
    $scope.battle = Battle;//Battle object which store methods/player/enemies...
    $scope.enemies = $scope.battle.enemy;
    $scope.figting = false;
    $scope.isAuto = false;//if auto battle is on
    $scope.isAutoNext = false;//check if should auto change enemy when winning a battle, set to false when player dies and change enemy Id minus 1, so it go back each time player loses
    $scope.startBattle = function() {
        battleTimer = $interval($scope.attack, 1000);
        $scope.initEnemies();
        $scope.isAuto = true;
    };
    $scope.initEnemies = function(){
        $scope.battle.init(Game.enemyId);
    };
    $scope.attack = function(){
        if(Battle.enemy.length){
            $scope.battle.attack();
        }else{
            if (!$scope.isAuto && angular.isDefined(battleTimer)) {
                $interval.cancel(battleTimer);
                $scope.isAuto = false;
                $scope.isAutoNext = false;
            }
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