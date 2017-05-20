/**
 * Created by Tarnos on 2017-01-06.
 */

lotfw.factory('Battle', function(Player, EnemyList, Game, logService){
   function Battle(){
       this.player = Player;
       this.selectedEnemy = 0;
       this.enemy = [];//Or enemies as an array...
       this.aliveEnemies = [];//store indexes of all alive enemies, can be used with AoE spells,debuffs, random enemy select etc.
       this.deadEnemies = [];//same as above
   }
   Battle.prototype.spawnEnemies = function(id){
       var letter = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
       var random = Math.floor(Math.random() * 4);//how many enemies to spawn, might be based on current Area enemy limit? Boss = limit 3, pass custom array of enemies to spawn.
       //if boss then spawn only 1, then reduce id by 1 or more, and spawn random amount of enemies.
       this.enemy.length = 0;//remove all enemies, so we can init new(in case we had 3 enemies, but only spawn 1, then 2 others would stay, and we dont want that)
       for(var i = 0; i <= random; i++){
           this.enemy[i] = {};
           this.enemy[i] = EnemyList.getEnemy(id);
           this.enemy[i].init();
           this.enemy[i].name += " " + letter[i];
           this.aliveEnemies.push(i);
       }
   };
   Battle.prototype.selectEnemy = function(index){
       if(!this.enemy[index].isDead) {
           this.selectedEnemy = index;
       }else{
           logService.log("Can't select dead enemy");
       }
   };
   Battle.prototype.init = function(){
       //Add front line/back line, add purpose of long range weapons/front line tanks/spear weapon
       this.aliveEnemies.length = 0;
       this.deadEnemies.length = 0;
       this.spawnEnemies(Game.enemyId);//will be based on player level or map id...might spawn multiple enemies based on level/map id
       //everytime we start a new battle call a Weather(?) service, which rolls a new weather, 10% for new, 90% for no change?, or 50% for clear.
       this.selectedEnemy = 0;//reset selected enemy when starting a new battle.
   };
   Battle.prototype.atbCheck = function(unit, dt){
       unit.currentSpeed += dt;
       if(unit.currentSpeed >= unit.attackSpeed) {
           unit.currentSpeed = unit.currentSpeed - unit.attackSpeed;
           return true;
       }
   };
   Battle.prototype.attack = function(dt){
       // var randEnemy = this.enemy[Math.floor(Math.random() * this.enemy.length)];//choose random enemy to attack
       for(var i = this.enemy.length - 1; i >= 0; i--){
           var enemy = this.enemy[i];
           if(!enemy.isDead){
               if(this.atbCheck(enemy, dt)){
                   var dmg = enemy.getDamage();
                   Player.takeDamage(dmg);
               }
               if(Player.isDead) break;//stop loop when player dies
           }
       }
       if(this.atbCheck(this.player, dt)){
           var randEnemy = this.enemy[this.selectedEnemy];

           var playerDmg = Player.getDamage();
           randEnemy.takeDamage(playerDmg);
           if(randEnemy.isDead){

               /* Selected random enemy */
               this.selectedEnemy = this.randomEnemyIndex(this.aliveEnemies);

               /* Keep track of dead and alive enemy index, can be used with spells such as ressurection or AoE pick random alive enemy etc. */
               var deadEnemyIndex = this.enemy.indexOf(randEnemy);
               var removeAliveIndex = this.aliveEnemies.indexOf(deadEnemyIndex);
               this.deadEnemies.push(deadEnemyIndex);
               this.aliveEnemies.splice(removeAliveIndex, 1);

               /* Reward player for beating enemy, might consider rewarding items only when defeating all enemies */
               Player.addExperience(randEnemy.level);

               /* if all enemies are dead, dont use "this.deadEnemies.length === this.enemy.length,
               *  since more enemies can be summoned, eaten etc. during battle, while aliveEnemies should keep track of it */
               if(!this.aliveEnemies.length){
                   this.enemy.length = 0;
               }
           }
       }
   };

   Battle.prototype.randomEnemyIndex = function(arr){
       //pick random enemy index from an array
       return arr[Math.floor(Math.random() * arr.length)];
   };
   return new Battle();//Will create "new" battle by passing certain values, such as map ID.
});