var app = angular.module('theSandboxChallenge.setup', ['theSandboxChallenge']);

var SetupCtrl = function($injector, $q, $scope, findTranscludedScope, $timeout) {
    this.options = {};
    this.options.group = 'AngularFire';
    this.options.challengeId = 'getConnected';
    this.options.description = 'placeholder description';


    this.options.testCases = [
        $injector.instantiate(TestCase, {
            description: 'A user has been logged in.',
            expression: "this.loginObj.user instanceof Object",
            expectedValue: true,
            runTest: function() {
                return findTranscludedScope().then(function(scope) {
                    var promiseMgr = $q.defer();

                    scope.$on("$firebaseSimpleLogin:login", function() {
                        $timeout(function() {
                            promiseMgr.resolve(scope.ctrl.loginObj.user instanceof Object);
                        });

                    });

                    scope.ctrl.login();

                    return promiseMgr.promise;
                });

            }
        })
    ];
};