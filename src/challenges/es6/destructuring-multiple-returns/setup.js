var app = angular.module('theSandboxChallenge.setup', ['theSandboxChallenge', 'ui.bootstrap']);

var SetupCtrl = function($injector) {
    var _this = this;

    this.group = 'ES6';
    this.challengeId = 'destructuringMultipleReturns';
    this.description = 'Use destructuring to assign the return value of ____ to val and err in a single line.';

    this.window = window;

    this.testCases = [
        $injector.instantiate(TestCase, {
            description: 'numIsValid',
            expression: 'numIsValid',
            expectedValue: true,
            getActualValue: function() {
                return _this.window.numIsValid;
            }
        }),
        $injector.instantiate(TestCase, {
            description: 'num',
            expression: 'num',
            expectedValue: 42,
            getActualValue: function() {
                return _this.window.num;
            }
        })
    ];
};