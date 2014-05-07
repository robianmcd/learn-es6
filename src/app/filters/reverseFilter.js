(function() {

    var app = angular.module('theSandboxChallenge');

    app.filter('reverse', function() {
        return function(items) {
            return items.slice().reverse();
        };
    });

}());