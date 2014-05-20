var app = angular.module('theSandboxChallenge.setup', ['theSandboxChallenge']);

var SetupCtrl = function($injector) {
    this.group = 'ES6';
    this.challengeId = 'blockScopeLet';
    this.description = 'Change the code so that the temporary variables <code>i</code> and <code>iSquared</code> are not on the global scope.';

    this.testCases = [
        $injector.instantiate(TestCase, {
            description: '<code>i</code> should not be on the global scope.',
            expression: 'i',
            expectedValue: undefined,
            getActualValue: function() {
                return window.i;
            }
        }),
        $injector.instantiate(TestCase, {
            description: '<code>iSquared</code> should not be on the global scope.',
            expression: 'iSquared',
            expectedValue: undefined,
            getActualValue: function() {
                return window.iSquared;
            }
        }),
        $injector.instantiate(TestCase, {
            description: '<code>squareSum</code> should be on the global scope.',
            expression: 'squareSum',
            expectedValue: 385,
            getActualValue: function() {
                return window.squareSum;
            }
        })
    ];
};