var app = angular.module('theSandboxChallenge.setup', ['theSandboxChallenge']);

var SetupCtrl = function ($injector) {
  this.options = {};
  this.options.group = 'ES6';
  this.options.challengeId = 'classConstructors';
  this.options.description = '1. Create a constructor for <code>Car</code> that takes a parameter and assigns it to <code>this.hornNoise</code>. <br/>' +
    '2. Implement <code>createCar()</code> so that it: creates a new Car, passes in \'BEEP\' as the hornNoise, and returns it.';

  this.options.testCases = [
    $injector.instantiate(TestCase, {
      description: '<code>createCar()</code> returns a car',
      expression: 'createCar() instanceof Car',
      expectedValue: true,
      runTest: function () {
        return createCar() instanceof Car;
      }
    }),
    $injector.instantiate(TestCase, {
      description: '<code>createCar()</code> should return a car that goes "BEEP"',
      expression: 'createCar().honk()',
      expectedValue: 'BEEP',
      runTest: function () {
        return createCar().honk();
      }
    })
  ];
};