var app = angular.module('theSandboxChallenge.setup', ['theSandboxChallenge']);

var SetupCtrl = function ($injector, $q) {
  this.options = {};
  this.options.group = 'ES6';
  this.options.challengeId = 'makeAPromise';
  this.options.description = 'Implement <code>promiseToCalculateReciprocal()</code> so that it returns a new Promise. If num is 0 the promise should be rejected. Otherwise the promise should be resolved with the value 1/num';

  this.options.testCases = [
    $injector.instantiate(TestCase, {
      description: '<code>promiseToCalculateReciprocal(4)</code> should return a Promise and resolve it with 1/4',
      expression: 'promiseToCalculateReciprocal(4)\n' +
        '  .then(function(value) {\n' +
        '    value === 1/4;\n' +
        '  })',
      expectedValue: 0.25,
      runTest: function () {
        var promiseManager = $q.defer();

        promiseToCalculateReciprocal(4)
          .then(function(value) {
            promiseManager.resolve(value);
          })
          .catch(function() {
            promiseManager.resolve('<Promise Rejected>');
          });

        return promiseManager.promise;
      }
    }),
    $injector.instantiate(TestCase, {
      description: '<code>promiseToCalculateReciprocal(0)</code> should return a Promise and reject it',
      expression: 'promiseToCalculateReciprocal(0)\n' +
        '  .catch(function(value) {\n' +
        '    value === undefined;\n' +
        '  })',
      expectedValue: undefined,
      runTest: function () {
        var promiseManager = $q.defer();

        promiseToCalculateReciprocal(0)
          .then(function(value) {
            promiseManager.resolve(value);
          })
          .catch(function(value) {
            promiseManager.resolve(value);
          });

        return promiseManager.promise;
      }
    })
  ];
};
