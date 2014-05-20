var app = angular.module('theSandboxChallenge.setup', ['theSandboxChallenge', 'ui.bootstrap']);

var SetupCtrl = function($injector) {
    this.group = 'ES6';
    this.challengeId = 'destructuringArrays';
    this.description = '<code>doubleANumber()</code> returns an array of two elements. Assign the first element ' +
        'to a variable called <code>numIsValid</code> and the second element to a variable called <code>num</code>. ' +
        '<br/>Using ES6 destructuring you should be able to call the function and make both variable declarations all ' +
        'on the same line.';

    this.testCases = [
        $injector.instantiate(TestCase, {
            description: '<code>numIsValid</code> is defined',
            expression: 'numIsValid',
            expectedValue: true,
            getActualValue: function() {
                return window.numIsValid;
            }
        }),
        $injector.instantiate(TestCase, {
            description: '<code>num</code> is defined',
            expression: 'num',
            expectedValue: 42,
            getActualValue: function() {
                return window.num;
            }
        })
    ];
};