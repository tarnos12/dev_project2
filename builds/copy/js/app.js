/**
 * Created by Tarnos on 2016-12-14.
 */
var lotfw = angular.module("lotfw", ['ui.bootstrap', 'ngAnimate', 'ngTouch', 'ngRoute']);

lotfw.config(function($routeProvider, $locationProvider){
   // $locationProvider.hashPrefix('');
   $routeProvider
       .when('/',
           {
               templateUrl: 'views/stats.html',
               controller: 'PlayerController',
               controllerAs: 'playerCtrl'
           })
       .when('/spells',
           {
               templateUrl: 'views/spells.html',
               controller: 'SpellsController',
               controllerAs: 'spellsCtrl'
           })
       .when('/options',
           {
               templateUrl: 'views/options.html',
               controller: 'OptionsController',
               controllerAs: 'optCtrl'
           })
       .when('/credits',
           {
               templateUrl: 'views/credits.html',
               controller: 'CreditsController',
               controllerAs: 'creditsCtrl'
           })
       .when('/professions',
           {
               templateUrl: 'views/professions.html',
               controller: 'ProfessionController',
               controllerAs: 'professionCtrl'
           })
       .when('/chat',
           {
               templateUrl: 'views/chat.html'
           })
       .otherwise({
           redirectTo: '/'
       });
    // $locationProvider.html5Mode(true);
    // https://scotch.io/tutorials/pretty-urls-in-angularjs-removing-the-hashtag
});

function deepClone (obj) {
    var copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = deepClone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = deepClone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}