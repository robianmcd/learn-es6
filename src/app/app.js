(function() {

    var app = angular.module('learnEs6', ['firebase']);

    app.config(function($sceDelegateProvider) {
        $sceDelegateProvider.resourceUrlWhitelist([
            // Allow same origin resource loads.
            'self',
            // Allow loading from github pages
            'http://robianmcd.github.io/learn-es6/**']);
    });

}());

