var app = angular.module('theSandboxChallenge.setup', ['theSandboxChallenge', 'ui.bootstrap']);

var SetupCtrl = function($injector) {
    var _this = this;

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