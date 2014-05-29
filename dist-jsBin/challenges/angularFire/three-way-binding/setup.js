var app = angular.module('theSandboxChallenge.setup', ['theSandboxChallenge']);

var SetupCtrl = function ($injector, $firebase, $rootScope, $q, $timeout, myFirebaseUtils, findTranscludedScope, htmlUtils) {
  var setup = this;

  this.options = {};
  this.options.group = 'AngularFire';
  this.options.challengeId = 'threeWayBinding';
  this.options.showOutput = true;

  myFirebaseUtils.setCurrentChallenge(this.options.challengeId);

  this.options.description = 'sample description';

  this.dbRoot = $firebase(new Firebase(myFirebaseUtils.getBaseUrl()));

  var dbData = {
    foo: 'bar'
  };

  this.dbRoot.$set(dbData);


  this.options.testCases = [
    $injector.instantiate(TestCase, {
      description: 'sample description',
      expression: "placeholder",
      expectedValue: true,
      runTest: function () {
        return false;
      }
    })
  ];
};