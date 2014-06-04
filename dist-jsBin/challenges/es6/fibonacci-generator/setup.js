var app = angular.module('theSandboxChallenge.setup', ['theSandboxChallenge']);

var SetupCtrl = function ($injector) {
  this.options = {};
  this.options.group = 'ES6';
  this.options.challengeId = 'fibonacciGenerator';
  this.options.description = 'Implement <code>getFibSet(max)</code> so it returns a Set of all the fibonacci numbers less than <code>max</code>.';

  var fibsUnder6 = [1,1,2,3,5];

  var fibsUnder20 = [1,1,2,3,5,8,13];

  this.options.testCases = [
    $injector.instantiate(TestCase, {
      description: '<code>getFibonacciNums(6)</code> returns a set of all the fibonacci numbers under 6.',
      expression: 'getFibonacciNums(6)',
      expectedValue: fibsUnder6,
      runTest: function () {
        return getFibonacciNums(6);
      }
    }),
    $injector.instantiate(TestCase, {
      description: '<code>getFibonacciNums(20)</code> returns a set of all the fibonacci numbers under 20.',
      expression: 'getFibonacciNums(20)',
      expectedValue: fibsUnder20,
      runTest: function () {
        return getFibonacciNums(20);
      }
    })
  ];
};
