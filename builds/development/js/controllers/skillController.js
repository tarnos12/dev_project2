/**
 * Created by Tarnos on 2017-03-31.
 */

lotfw.controller('SkillController', function($scope, SkillList){
    $scope.skills = SkillList;
    console.log($scope.skills);
});