var app = angular.module('theSandboxChallenge.setup', ['theSandboxChallenge']);

var SetupCtrl = function($injector) {
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