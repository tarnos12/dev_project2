/**
 * Created by Tarnos on 2017-05-02.
 */

angular.module('lotfw.services', [])
.service('loaderSvc', function(){
    var manifest = [
            {src: "Forest.png", id: "forest"}
        ],
        loader = new createjs.LoadQueue(true);

    this.getResult = function (asset) {
        return loader.getResult(asset);
    };
    this.getLoader = function () {
        return loader;
    };
    this.loadAssets = function () {
        loader.loadManifest(manifest, true, "/img/background/");
    };
})