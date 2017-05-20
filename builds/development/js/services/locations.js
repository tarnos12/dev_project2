/**
 * Created by Tarnos on 2017-03-20.
 */

lotfw.factory('Locations', function(){
    //use json to store this data.
   var area = {};
   area.mainAreaList = [
       "Varik Avarice",
       "Narsus Forest",
   ];
   area.subAreaList = [
       ["Varik Outer", "Varik Inner", "Varik Lair"],
       ["Forest Entrance", "Inner Forest", "Narsus Lair"]
   ];
   return area;
});