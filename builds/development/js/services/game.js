/**
 * Created by Tarnos on 2016-12-26.
 */

lotfw.factory('Game', function(EnemyList, logService, Locations){
   var Game = function() {
      this.stats = ['strength', 'endurance', 'dexterity', 'agility'];
      this.isLoaded = true;//set to false to show intro
      this.name = "Legend of the Fallen Warrior";
      this.id = 0;//item id
      this.enemyId = 0;
      this.startGame = function(){
          this.isLoaded = !this.isLoaded;
      };
      this.mainLocationId = 0;
      this.subLocationId = 0;
   };
   Game.prototype.getLocationName = function(){
     var name = Locations.mainAreaList[this.mainLocationId];
     return name;
   };
   Game.prototype.getSubLocationName = function(){
       var name = Locations.subAreaList[this.mainLocationId][this.subLocationId];
       return name;
   };
   Game.prototype.nextEnemy = function(){
       this.enemyId++;
       logService.log("Next enemy set to " + this.enemyId);
       if(EnemyList.list[this.enemyId]) return;//if enemy exist, return...
       this.enemyId--;
   };
   Game.prototype.prevEnemy = function(){
       this.enemyId--;
       if(EnemyList.list[this.enemyId]) return;
       this.enemyId++
   };
   Game.prototype.getCurrentEnemy = function(){
     return EnemyList.list[this.enemyId];
   };
   return new Game();
});