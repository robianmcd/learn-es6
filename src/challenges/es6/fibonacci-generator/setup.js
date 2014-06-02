var app = angular.module('theSandboxChallenge.setup', ['theSandboxChallenge']);

var SetupCtrl = function ($injector) {
  this.options = {};
  this.options.group = 'ES6';
  this.options.challengeId = 'fibonacciGenerator';
  this.options.description = 'Implement <code>getFibSet(max)</code> so it returns a Set of all the fibonacci numbers less than <code>max</code>.';

  var fibsUnder10 = new Set();
  fibsUnder10.add(1);
  fibsUnder10.add(2);
  fibsUnder10.add(3);
  fibsUnder10.add(5);
  fibsUnder10.add(8);

  var fibsUnder50 = new Set();
  fibsUnder50.add(1);
  fibsUnder50.add(2);
  fibsUnder50.add(3);
  fibsUnder50.add(5);
  fibsUnder50.add(8);
  fibsUnder50.add(13);
  fibsUnder50.add(21);
  fibsUnder50.add(34);

  this.options.testCases = [
    $injector.instantiate(TestCase, {
      description: '<code>getFibSet(10)</code> returns a set of all the fibonacci numbers under 10.',
      expression: 'getFibSet(10)',
      expectedValue: fibsUnder10,
      runTest: function () {
        return getFibSet(10);
      }
    }),
    $injector.instantiate(TestCase, {
      description: '<code>getFibSet(50)</code> returns a set of all the fibonacci numbers under 50.',
      expression: 'getFibSet(50)',
      expectedValue: fibsUnder50,
      runTest: function () {
        return getFibSet(50);
      }
    })
  ];
};
