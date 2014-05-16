var app = angular.module('theSandboxChallenge.setup', ['theSandboxChallenge']);

var SetupCtrl = function($injector) {
    this.group = 'ES6';
    this.challengeId = 'forOfLoops';
    this.description = '<code>sumArray()</code> should iterate over the elements in <code>inputArray</code> and add ' +
        'them together. However it is also iterating over anything on Array.prototype. To fix this problem replace ' +
        'the for...in loop with a for...of loop.';

    this.window = window;

    this.testCases = [
        $injector.instantiate(TestCase, {
            description: '<code>sumArray()</code> correctly adds numbers in an array',
            expression: 'sumArray([4,8,0])',
            expectedValue: 12,
            getActualValue: function() {
                return window.sumArray([4,8,0]);
            }
        }),
        $injector.instantiate(TestCase, {
            description: '<code>sumArray()</code> correctly adds numbers in another array',
            expression: 'sumArray([1,2,3,5,7,11,13])',
            expectedValue: 42,
            getActualValue: function() {
                return window.sumArray([1,2,3,5,7,11,13]);
            }
        }),
        $injector.instantiate(TestCase, {
            description: 'Monkey patch hasn\'t been removed',
            expression: 'Array.prototype.customExtension',
            expectedValue: "Monkey Patched",
            getActualValue: function() {
                return Array.prototype.customExpression;
            }
        })
    ];

};