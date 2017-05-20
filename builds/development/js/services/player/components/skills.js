/**
 * Created by Tarnos on 2017-02-27.
 */


// SKILLS

//Each skill is an object, with methods such us "unlockNextSkill", which
//will be used with skill requirements. i.e.: FireBall.level >= 5 ==> FireBlast.isUnlocked = true;
//This will make skill trees easier to work with.
//Might use something else to make it more readable, FireBlast.requirements.fireBall() >>
//>>Check if fireball has reached a proper level, or even make a json with requirements.
//"Fireblast: requirements: [["fireball", 5], ["Magic mastery", 5]];, nested array = name <=> level

lotfw.service('SkillList', function(){
   function Skills(){
       this.list = {};
   };

   Skills.prototype.init = function(data){
       for(var i = 0; i < data.length; i++){
           var skill = data[i];
           var name = skill.name;
           var req = skill.requirements;
           var count = 0;//prevent infinite loop

           //skill info, level, description, buffs, debuffs
           this.list[name] = {};

           /* CONVERTING STRINGS WITH NUMBERS BY ADDING PLUS SIGN BEFORE A PROPERTY e.x. level = "100", +level === 100
            * UNTIL I FIGURE OUT HOW TO PROPERLY SAVE NUMBERS IN EXCEL, I HAVE TO SAVE THEM AS A STRING */

           /* Level and requirements */
           this.list[name].level = 1;
           this.list[name].maxLevel = +skill.maxLevel;
           this.list[name].levelRequirement = +skill.levelRequirement;//player level needed to unlock this skill
           this.list[name].levelRequirementPerLevel = +skill.levelRequirementPerLevel;//increase skill level required
           this.list[name].requirements = [];//Other Skills requirement, FireStorm might require level 10 fireball etc.

           /* Damage */
           this.list[name].damage = +skill.damage;// 1 = 100%, 0.01 = 1%
           this.list[name].damagePerLevel = +skill.damagePerLevel;//bonus damage increase per level

           /* Chance to cast */
           this.list[name].chance = +skill.chance;// 1 = 100%, 0.01 = 1%, every turn there is a roll for each equipped spell, INTELLIGENCE MIGHT INCREASE "SLOTS" FOR EQUIPPING SKILLS.
           this.list[name].chancePerLevel = +skill.chancePerLevel; // increase cast chance for each level of skill.

           /* Description */
           this.list[name].description = skill.description;//inside excel use brackets like: "This skill name is [name]", using regex, refer to property of skill "name".

           /* Name */
           this.list[name].name = skill.name;

           //req = string, using regex to take out name and level of requirements.
           //loop all requirements
           while(req) {
               var obj = {};
               var reqName = req.match(/^[a-zA-Z\s]*/gi).join('');
               var reqLevel = parseInt(req.match(/\d+/).join(''));
               reqName = reqName.replace(/\s+$/, '');//remove trailing space
               obj.name = reqName;
               obj.level = reqLevel;
               this.list[name].requirements.push(obj);
               req = req.replace(reqName, '');//remove previously matched text
               req = req.replace(/\d+/, '');//remove previously matched number
               req = req.replace(/^\s+|\s+$/g, '');//remove leading spaces
               count++;
               if(count > 100){//just in case
                   return;
               }
           }
       }
       console.log(this.list);
   };

   return new Skills();
});