/**
 * Created by Tarnos on 2017-01-07.
 */

lotfw.factory('itemDrop', function(Game, itemTable, logService){
    function ItemDrop(){

    };
    ItemDrop.prototype.getRarity = function(){
        var random = Math.floor(Math.random() * 100) + 1;
        var index = random > 95 ? 6 :
            random > 85 ? 5 :
                random > 70 ? 4 :
                    random > 60 ? 3 :
                        random > 50 ? 2:
                            random > 40 ? 1:
                        0;
        return index;
    };
    ItemDrop.prototype.filterByName = function(value) {
        return function (element) {
            return element.name === value;
        };
    };
    ItemDrop.prototype.filterByLevel = function(level) {
        return function (element) {
            return ((element.ilvl + 3) >= level && (element.ilvl - 3) <= level);
        }
    };
    //finds an item which is equal or less than a level specified
    ItemDrop.prototype.closestLevel = function(arr, level){
        var curr = arr[0].ilvl;
        var diff = Math.abs(level - curr);
        for(var i = 0; i < arr.length; i++){
            var newdiff = Math.abs(level - arr[i].ilvl);
            if(newdiff < diff){
                diff = newdiff;
                curr = i;
            }
        }
        return arr[curr];
    };
    //search for an item based on the name.
    ItemDrop.prototype.dropItemByName = function(itemType){
        for(var type in itemTable.items.equipment){
            if(itemTable.items.equipment.hasOwnProperty(type)){
                for(var item in itemTable.items.equipment[type]){
                    if(itemTable.items.equipment[type].hasOwnProperty(item)){
                        var arr = itemTable.items.equipment[type][item];
                        var items = arr.filter(this.filterByName(itemType));
                        if(items.length >0) {
                            return items[0];
                        }
                    }
                }
            }
        }
    };
    ItemDrop.prototype.searchItemType = function(prop, obj) {
        obj = obj || itemTable.items;
        var val = obj[prop];
        if (obj[prop] !== undefined) {
            return val;
        };
        if (!(Object.prototype.toString.call(obj) === '[object Array]')) {
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    var result = this.searchItemType(prop, obj[key]);
                    if (result !== undefined) {
                        return result;
                    }
                }
            }
        }else{
            for(var i = 0; i < obj.length; i++){
                if(obj[i].name === prop){
                    return obj[i];
                }
            }
        }
        return undefined;
    };
//random item based on a property we give
    //for example "equipment" will pick any random item, weapon/armor/accessory/potion
    //might add some additional conditions such as "near level"
    ItemDrop.prototype.randomItemNearLevel = function(obj, level){
        var item = [];
        var name = obj;
        var prop = "";
        //picks random item type based on "obj" we pass, ex. We pass "weapon", it will pick random type(sword/axe etc)
        //if we pass "equipment" it will choose random weapon/armor/accessory/ etc, until it reach axe/helmet/ring
        //which is an array
        while(!(Object.prototype.toString.call(name) === '[object Array]')){
            prop = pickRandomProperty(name);
            name = name[prop];
        }
        item = name.filter(this.filterByLevel(level));
        if(item.length < 1){
            //find closest item if filter above fails when selected level is too small in range to the item levels.
            item = this.closestLevel(name, level);
        }else{
            //choose random item if an array have more than 1
            item = item[Math.floor(Math.random()*item.length)];
        }
        return item;
    };
    ItemDrop.prototype.createItem = function(obj){
        var item = {};
        for(var key in obj){
            if(obj.hasOwnProperty(key)){
                item[key] = {};
                item[key] = obj[key];
            }
        }
        return item;
    };
    ItemDrop.prototype.dropItem = function(val, level, chance){
        var rand = Math.random() * 100;
        var item = {};
        var itemType = {};
        if(rand > chance){
            logService.log("Failed to drop an item: " + chance + "%" + " chance to drop");
            return;
        }
        itemType = this.searchItemType(val);
        if(itemType.name){
            item = itemType;
        }else{
            item = this.randomItemNearLevel(itemType, level);
        }

        // item = this.createItem(item);//remove reference
        return deepClone(this.createStats(item));
    };
    ItemDrop.prototype.createStats = function(item){
        var rarityIndex = this.getRarity();
        item.rarity = itemTable.itemRarities[rarityIndex];//random for now
        item.stats = {};
        for(var i = 0; i< 2 + rarityIndex;i++){
            var rand = Math.floor(Math.random() * 5) + 1;
            var randStat = Game.stats[Math.floor(Math.random()*Game.stats.length)];
            if(rand > 1){
                for(var j = 0; j < itemTable.preferedStat.length; j++){
                    if(item.stats[itemTable.preferedStat[j]]){
                        item.stats[itemTable.preferedStat[j]] += item.ilvl + (item.ilvl * rarityIndex);
                    }else{
                        item.stats[itemTable.preferedStat[j]] = item.ilvl + (item.ilvl * rarityIndex);
                    }
                }
            }else{
                if(item.stats[randStat]){
                    item.stats[randStat] += item.ilvl + (item.ilvl * rarityIndex);
                }else{
                    item.stats[randStat] = item.ilvl + (item.ilvl * rarityIndex);
                }
            }
        }
        return item;
    };
    return new ItemDrop();
});