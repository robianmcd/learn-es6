(function() {
    var app = angular.module('theSandboxChallenge');

    app.factory('findTranscludedScope', function ($q, $timeout) {
        return function() {
            var promiseMgr = $q.defer();

            $timeout(function() {
                promiseMgr.resolve(angular.element('#transclude').children().scope());
            });

            return promiseMgr.promise;
        }
    });
})();