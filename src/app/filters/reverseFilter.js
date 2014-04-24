(function() {

    var app = angular.module('learnEs6');

    app.filter('reverse', function() {
        return function(items) {
            return items.slice().reverse();
        };
    });

}());