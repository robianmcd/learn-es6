var app = angular.module('theSandboxChallenge.setup', ['theSandboxChallenge']);

var SetupCtrl = function($injector) {
    this.group = 'ES6';
    this.challengeId = 'forOfLoops';
    this.description = 'Use destructuring to assign the return value of ____ to val and err in a single line.';

    this.window = window;

    this.testCases = [
        $injector.instantiate(TestCase, {
            description: 'placeholder',
            expression: 'placeholder',
            expectedValue: undefined,
            getActualValue: function() {
                return false;
            }
        })
    ];
};