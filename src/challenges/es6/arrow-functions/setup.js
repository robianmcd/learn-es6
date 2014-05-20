var app = angular.module('theSandboxChallenge.setup', ['theSandboxChallenge']);

var SetupCtrl = function($injector) {
    this.group = 'ES6';
    this.challengeId = 'arrowFunctions';
    this.description = 'There is a bug in <code>filterList()</code>. Fix the issue using ES6 arrow functions.';

    this.testCases = [
        $injector.instantiate(TestCase, {
            description: '<code>filterList()</code> uses the default <code>regexFilter</code> stored in <code>myObj</code> to filter an input list',
            expression: "myObj.filterList(['abcd', '123a', '1abc1'])",
            expectedValue: ['abcd', '1abc1'],
            getActualValue: function() {
                return myObj.filterList(['abcd', '123a', '1abc1']);
            }
        }),
        $injector.instantiate(TestCase, {
            description: '<code>filterList()</code> uses a custom <code>regexFilter</code> to filter an input list',
            expression: "myObj.regexFilter = /123/; </code><br/><code> myObj.filterList(['1234', 'abcd', '12abc3']);",
            expectedValue: ['1234'],
            getActualValue: function() {
                var oldFilter = myObj.regexFilter;
                myObj.regexFilter = /123/;
                var actualValue = myObj.filterList(['1234', 'abcd', '12abc3']);
                myObj.regexFilter = oldFilter;
                return actualValue;
            }
        })
    ];
};