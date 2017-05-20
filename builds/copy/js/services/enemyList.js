/**
 * Created by Tarnos on 2017-01-06.
 */

lotfw.factory('EnemyList', function(Enemy, logService){
    function Enemies(){
        this.area = "";
        this.enemies = [
        ]
    }
    Enemies.prototype.add = function(name, level, isBoss){
        var enemy = {
            name: name,
            level: level,
            isBoss: isBoss || false,
            area: this.area
        };
        this.enemies.push(enemy);
    };
    Enemies.prototype.getEnemy = function(id){
        //Add loop here, and return an array of multiple enemies; if id = enemy with "Boss" == true;
      var enemy = this.enemies[id]
      return new Enemy(enemy);
    };
    Enemies.prototype.init = function(){
        //create enemies based on a map;
        //Set group so we can reference it and add enemies

        //Varik Avarice
        this.area = "Varik Avarice";
        this.add("Varik Grunt", 1);
        this.add("Varik Soldier", 3);
        this.add("Varik Marksmen", 5);
        this.add("Varik Vulture", 7);
        this.add("Varik Evader", 9);
        this.add("Variks Liar", 11);
        this.add("Variks Queen", 13);
        this.add("Lord Varik", 15, true);

        //Narsus Forest
        this.area = "Varik Avarice";
        this.add("Narsus", 17);
    };
    var enemies = new Enemies();
    enemies.init();
    return enemies;
});