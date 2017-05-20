/**
 * Created by Tarnos on 2017-01-06.
 */

lotfw.factory('Enemy', function(logService){
   function Enemy(obj){
       this.name = obj.name;
       this.level = obj.level;
       this.minHp = this.level * 20;
       this.maxHp = this.level * 30;
       this.minDefense = this.level * 2;
       this.maxDefense = this.level * 3;
       //drop table...add a property "maxRarity", {Rare} means it wont drop anything higher, Rarity increase itemLevel and item requirements, passing empty Rarity means it can drop all.
       //Enemy level 10 = common lvl 8(if less than 0, then level 1), legendary level 12(min level) +- 2 levels, so common can be 8-10 in case of level 10 enemy
       this.isAlive = true;
       this.killed = 0;//How many kills on this enemy, use with Bestiary. Loop through all enemies to display "empty" list, 1 kill = enemy name, 5 = level, 10 = health(should be min/max)
   }
   Enemy.prototype.init = function(){
       //Make all stats a bit random, add properties, "min" "max" defense, health, to display them in bestiary in the future, "current defense" or just "defense" is calculated random defense stat.
       this.minDamage = this.level * 2;
       this.maxDamage = this.level * 3;
       this.defense = Math.floor(Math.random() * (this.maxDefense - this.minDefense + 1) + this.minDefense);
       this.health = Math.floor(Math.random() * (this.maxHp - this.minHp + 1) + this.minHp); //Min HP = level * 90, Max HP = level * 100;
       this.maxHealth = this.health;
   };
   Enemy.prototype.takeDamage = function(val){
       if(val - this.defense > 0){
           this.health -= (val - this.defense);
           logService.log("You deal " + (val - this.defense) + " damage");
       }else{
           logService.log('Enemy defense is higher than player damage');
       }
       if(this.health <= 0){
           this.isAlive = false;
       }
   };
   Enemy.prototype.getDamage = function(){
     var random = Math.floor(Math.random() * (this.maxDamage - this.minDamage + 1) + this.minDamage);
     return random;
   };
   return Enemy;//return a constructor so we can create a new instance every time we spawn an enemy.
});