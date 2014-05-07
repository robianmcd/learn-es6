var app = angular.module('theSandboxChallenge.setup', ['theSandboxChallenge']);

var SetupCtrl = function($injector) {
    var _this = this;

    this.window = window;

    this.testCases = [
        $injector.instantiate(TestCase, {
            description: '<code>i</code> should not be on the global scope.',
            expression: 'i',
            expectedValue: undefined,
            getActualValue: function() {
                return _this.window.i;
            }
        }),
        $injector.instantiate(TestCase, {
            description: '<code>iSquared</code> should not be on the global scope.',
            expression: 'iSquared',
            expectedValue: undefined,
            getActualValue: function() {
                return _this.window.iSquared;
            }
        }),
        $injector.instantiate(TestCase, {
            description: '<code>squareSum</code> should be on the global scope.',
            expression: 'squareSum',
            expectedValue: 385,
            getActualValue: function() {
                return _this.window.squareSum;
            }
        })
    ];
};