/**
 * Created by Tarnos on 2016-12-19.
 */

//Consider using multiple controllers for each game part, view/inventory/battle...
lotfw.controller("MainController", function($scope, Game, Player, Battle, SkillList, EnemyList, logService){//Skill is not in scope, should not be updated in view, might use this controller to initialize all data
    $scope.Game = Game;
    $scope.player = Player;
    $scope.Battle = Battle;
    $scope.log = logService;//used to display log on screen
    $scope.footer = {isVisible: false};
    $scope.gameViews = [
        {name: 'stats', href: '', icon:'fa fa-bar-chart fa-lg', hovering: false, hoverClass: 'fa-2x'},
        // {name: 'spells', href: 'spells',icon:'fa fa-book fa-lg', hovering: false, hoverClass: 'fa-2x'},
        {name: 'skills', href: 'skills',icon:'fa fa-university fa-lg', hovering: false, hoverClass: 'fa-2x'},
        // {name: 'professions', href: 'professions', icon:'fa fa-compass fa-lg', hovering: false, hoverClass: 'fa-2x'},
        // {name: 'options', href: 'options',icon:'fa fa-cog fa-lg', hovering: false, hoverClass: 'fa-spin fa-2x'},
        // {name: 'credits', href: 'credits',icon:'fa fa-list-alt fa-lg', hovering: false, hoverClass: 'fa-2x'},
        // {name: 'debug', href: 'debug',icon:'fa fa-list-alt fa-lg', hovering: false, hoverClass: 'fa-2x'},
        {name: 'chat', href: 'chat',icon:'fa fa-commenting-o', hovering: false, hoverClass: 'fa-2x'}
    ];
    $scope.isHovering = function(e){
        var c = e.icon;
        return (e.hovering) ? (c + " " + e.hoverClass) : c;
    };
    var initGameData = function () {

        //Adding datetime as querystring to force the code to read newest file and not cache.
        var fileUrl = "json/Data.xls?_="+ new Date().getTime();
        var oReq = new XMLHttpRequest();
        oReq.open("GET", fileUrl, true);
        oReq.responseType = "arraybuffer";
        oReq.onload = function (e) {
            var arraybuffer = oReq.response;

            /* convert data to binary string */
            var data = new Uint8Array(arraybuffer);
            var arr = [];
            for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
            var bstr = arr.join("");

            /* Call XLSX */
            var workbook = XLSX.read(bstr, { type: "binary" });

            /* DO SOMETHING WITH workbook HERE */
            var enemyList = workbook.Sheets["Enemy List"];
            var offensiveSkills = workbook.Sheets["Offensive Skills"];
            var enemies = XLSX.utils.sheet_to_json(enemyList);
            var skills = XLSX.utils.sheet_to_json(offensiveSkills);
            SkillList.init(skills);
            EnemyList.init(enemies);
        };
        oReq.send();
    };
    initGameData();
    //TO DO: add a view for dev, with buttons to add item/gold etc
    //might also include some debug info
});