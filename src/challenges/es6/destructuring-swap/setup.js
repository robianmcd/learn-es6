var app = angular.module('theSandboxChallenge.setup', ['theSandboxChallenge', 'ui.bootstrap']);

var SetupCtrl = function ($injector) {
  this.options = {};
  this.options.group = 'ES6';
  this.options.challengeId = 'destructuringSwap';
  this.options.description = 'Swap the values of <code>x</code> and <code>y</code> in a single line of code using destructuring.';

  this.options.testCases = [
    $injector.instantiate(TestCase, {
      description: '<code>x</code> has <code>y</code>\'s initial value',
      expression: 'x',
      expectedValue: 2,
      runTest: function () {
        return window.x;
      }
    }),
    $injector.instantiate(TestCase, {
      description: '<code>y</code> has <code>x</code>\'s initial value',
      expression: 'y',
      expectedValue: 1,
      runTest: function () {
        return window.y;
      }
    })
  ];
};