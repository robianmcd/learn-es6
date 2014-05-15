var app = angular.module('theSandboxChallenge.setup', ['theSandboxChallenge', 'ui.bootstrap']);

var SetupCtrl = function($injector) {
    var _this = this;

    this.group = 'ES6';
    this.challengeId = 'destructuringMultipleReturns';
    this.description = '\
    Use ES6 "Destructuring" to assign the return value of doubleANumber() to two variables by filling in the blank.\
    <br/>\
    Name the first variable <code>numIsValid</code>.\
    <br/>\
    Name the second variable <code>num</code>.';

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