/**
 * Created by Tarnos on 2017-05-01.
 */

angular.module('lotfw.directives', [])
.directive('canvasTest', ['loaderSvc', 'Background', function(loaderSvc, Background){
   "use strict";
   return{
       restrict: "EAC",
       replace: true,
       scope:{
       },
       template: "<canvas width='960' height='400'></canvas>",
       link: function(scope, element, attribute){
           var w, h, loader, manifest, background;
           drawGame();
           function drawGame(){
               if (scope.stage) {
                   scope.stage.autoClear = true;
                   scope.stage.removeAllChildren();
                   scope.stage.update();
               } else {
                   scope.stage = new createjs.Stage(element[0]);
               }
               w = scope.stage.canvas.width;
               h = scope.stage.canvas.height;
               loaderSvc.getLoader().addEventListener("complete", handleComplete);
               loaderSvc.loadAssets();
           }
           function handleComplete(){
               background = new Background({width:w, height:h});
               background.addToStage(scope.stage);
               createjs.Ticker.timingMode = createjs.Ticker.RAF;
               createjs.Ticker.addEventListener("tick", tick);
           }
           function tick(event){
               scope.stage.update(event);
           }
       }
   }
}]);