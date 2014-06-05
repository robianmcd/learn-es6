var app = angular.module('theSandboxChallenge.setup', ['theSandboxChallenge', 'ui.bootstrap']);

var SetupCtrl = function ($injector) {
  this.options = {};
  this.options.group = 'ES6';
  this.options.challengeId = 'optionalParameters';
  this.options.description = 'Modify <code>foo()</code> using ES6 default parameters so that b defaults to 10 and c defaults to 100.';

  this.options.testCases = [
    $injector.instantiate(TestCase, {
      description: '<code>foo()</code> adds the parameters together when they are all specified.',
      expression: 'foo(1,2,3)',
      expectedValue: 6,
      runTest: function () {
        return foo(1, 2, 3);
      }
    }),
    $injector.instantiate(TestCase, {
      description: '<code>foo()</code> uses default parameters when a value is not passed in.',
      expression: 'foo(1,2)',
      expectedValue: 103,
      runTest: function () {
        return foo(1, 2);
      }
    }),
    $injector.instantiate(TestCase, {
      description: '<code>foo()</code> uses default parameters when a value is not passed in.',
      expression: 'foo(1,undefined,300)',
      expectedValue: 311,
      runTest: function () {
        return foo(1, undefined, 300);
      }
    }),
    $injector.instantiate(TestCase, {
      description: '<code>foo()</code> doesn\'t work when required parameters aren\'t specified.',
      expression: 'foo(undefined,10, 100)',
      expectedValue: 'NaN',
      runTest: function () {
        var ret = foo(undefined, 10, 100);
        if (isNaN(ret)) {
          return 'NaN';
        } else {
          return ret;
        }
      }
    })
  ];
};