var app = angular.module('theSandboxChallenge.setup', ['theSandboxChallenge']);

var SetupCtrl = function ($injector, $q, $scope, $firebaseSimpleLogin, findTranscludedScope) {
  this.options = {};
  this.options.group = 'AngularFire';
  this.options.challengeId = 'firebaseSimpleLogin';
  this.options.description = 'Implement the <code>login()</code> function so that it logs a user in with "github", "google", or "facebook".';

  $firebaseSimpleLogin(new Firebase('https://sandbox-challenge.firebaseio.com')).$logout();


  this.options.testCases = [
    $injector.instantiate(TestCase, {
      description: 'Tries to log a user in with the <code>login()</code> method and ensure that the resulting login event is triggered.',
      expression: "this.login()",
      expectedValue: '<Event Triggered>',
      runTest: function () {


        return findTranscludedScope().then(function (scope) {
          var promiseMgr = $q.defer();

          scope.$on("$firebaseSimpleLogin:login", function () {
            promiseMgr.resolve('<Event Triggered>');
          });

          scope.ctrl.login();

          return promiseMgr.promise;
        });

      }
    })
  ];
};