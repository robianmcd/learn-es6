var app = angular.module('theSandboxChallenge.setup', ['theSandboxChallenge']);

var SetupCtrl = function ($injector) {
  this.options = {};
  this.options.group = 'ES6';
  this.options.challengeId = 'blockScopeLet';
  this.options.description = 'Change the code so that the temporary variables <code>i</code> and <code>iSquared</code> are not on the global scope.';

  this.options.testCases = [
    $injector.instantiate(TestCase, {
      description: '<code>i</code> should not be on the global scope.',
      expression: 'i',
      expectedValue: undefined,
      runTest: function () {
        return window.i;
      }
    }),
    $injector.instantiate(TestCase, {
      description: '<code>iSquared</code> should not be on the global scope.',
      expression: 'iSquared',
      expectedValue: undefined,
      runTest: function () {
        return window.iSquared;
      }
    }),
    $injector.instantiate(TestCase, {
      description: '<code>squareSum</code> should be on the global scope.',
      expression: 'squareSum',
      expectedValue: 385,
      runTest: function () {
        return window.squareSum;
      }
    })
  ];
};