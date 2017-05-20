/**
 * Created by Tarnos on 2016-12-26.
 */

lotfw.controller('PlayerController', function($scope, $sce, Player){
    //cant use methods since its refering to a nested object...might need to change that
    $scope.player = Player;

    var trusted = {};
    $scope.statTooltip = function(stat) {
        var html ="";
        html += "<div class='row'>";
        html += "<div class='col-xs-12'>";
        html += "<p>" + "Base + equipment = total" + "</p>";
        html += "</div>";
        html += "</div>";
        html += "<div class='row'>";
        html += "<div class='col-xs-12'>";
        html += "<p>" + $scope.player.baseStats[stat] + " + " + $scope.player.equippedStat(stat) + " = " + $scope.player.totalStat(stat) + "</p>";
        html += "</div>";
        html += "</div>";
        return trusted[html] || (trusted[html] = $sce.trustAsHtml(html));
    }
});