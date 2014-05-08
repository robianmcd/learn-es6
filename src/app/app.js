(function() {

    var app = angular.module('theSandboxChallenge', ['firebase', 'ui.bootstrap']);

    app.config(function($sceDelegateProvider) {
        $sceDelegateProvider.resourceUrlWhitelist([
            // Allow same origin resource loads.
            'self',
            // Allow loading from github pages
            'http://robianmcd.github.io/the-sandbox-challenge/**']);
    });

}());

