var app = angular.module('theSandboxChallenge.setup', ['theSandboxChallenge']);

var SetupCtrl = function ($injector) {
  this.options = {};
  this.options.group = 'ES6';
  this.options.challengeId = 'classInheritance';
  this.options.description = 'Make SelfDrivingCar inherit from Car and override the <code>accelerate()</code> method so that the speed is only incremented if <code>obstacleDetected</code> is <code>false</code>';

  this.options.testCases = [
    $injector.instantiate(TestCase, {
      description: '<code>SelfDrivingCar</code> should inherit the <code>honk()</code> method from <code>Car</code>',
      expression: 'let car = new SelfDrivingCar(\'beep\');\n' +
        'car.honk();',
      expectedValue: 'beep',
      runTest: function () {
        var car = new SelfDrivingCar('beep');
        return car.honk();
      }
    }),
    $injector.instantiate(TestCase, {
      description: 'A <code>SelfDrivingCar</code> accelerates when it doesn\'t detect an obstacle.',
      expression: 'let car = new SelfDrivingCar(\'beep\');\n' +
        'car.accelerate();\n' +
        'return car.speed;',
      expectedValue: 1,
      runTest: function () {
        var car = new SelfDrivingCar('beep');
        car.accelerate();
        return car.speed;
      }
    }),
    $injector.instantiate(TestCase, {
      description: 'A <code>SelfDrivingCar</code> does not accelerates when it detect an obstacle.',
      expression: 'let car = new SelfDrivingCar(\'beep\');\n' +
        'car.obstacleDetected = true;' +
        'car.accelerate();\n' +
        'return car.speed;',
      expectedValue: 0,
      runTest: function () {
        var car = new SelfDrivingCar('beep');
        car.obstacleDetected = true;
        car.accelerate();
        return car.speed;
      }
    })
  ];
};