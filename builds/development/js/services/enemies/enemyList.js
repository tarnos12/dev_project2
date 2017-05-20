/**
 * Created by Tarnos on 2017-01-06.
 */

//Basic enemy list, used with Enemy constructor to create actual enemy with stats.
lotfw.factory('EnemyList', function(Enemy){
    function Enemies(){
        this.area = "";
        this.list = {};
    }

    Enemies.prototype.getEnemy = function(name){
        var enemy;
        for(var key in this.list){
            if(this.list.hasOwnProperty(key)){
                for(var i = 0; i < this.list[key].length; i++){
                    if(name === this.list[key][i].name){
                        enemy = this.list[key][i];
                        break;
                    }
                }
            }
        }
      return new Enemy(enemy);
    };

    Enemies.prototype.init = function(enemyList){
        for(var i = 0; i < enemyList.length; i++){
            var enemy = enemyList[i];
            this.area = enemyList[i].area;
            var obj = {
                name: enemy.name,
                level: enemy.level || i + 1,
                isBoss: enemy.isBoss,
                kills: 0 //Might be required to unlock next enemy
            };
            if(!this.list[this.area]){
                this.list[this.area] = [];
            }
            this.list[this.area].push(obj);
        }
    };

    return new Enemies();
});