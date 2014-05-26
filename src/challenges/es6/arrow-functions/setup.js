var app = angular.module('theSandboxChallenge.setup', ['theSandboxChallenge']);

var SetupCtrl = function ($injector) {
  this.options = {};
  this.options.group = 'ES6';
  this.options.challengeId = 'arrowFunctions';
  this.options.description = 'There is a bug in <code>filterList()</code>. Fix the issue using ES6 arrow functions.';

  this.options.testCases = [
    $injector.instantiate(TestCase, {
      description: '<code>filterList()</code> uses the default <code>regexFilter</code> stored in <code>myObj</code> to filter an input list',
      expression: "myObj.filterList(<br/>&nbsp;&nbsp;['abcd', '123a', '1abc1']<br/>);",
      expectedValue: ['abcd', '1abc1'],
      runTest: function () {
        return myObj.filterList(['abcd', '123a', '1abc1']);
      }
    }),
    $injector.instantiate(TestCase, {
      description: '<code>filterList()</code> uses a custom <code>regexFilter</code> to filter an input list',
      expression: "" +
        "myObj.regexFilter = /123/; <br/>" +
        "myObj.filterList(<br/>" +
        "&nbsp;&nbsp;['1234', 'abcd', '12abc3']<br/>" +
        ");",
      expectedValue: ['1234'],
      runTest: function () {
        var oldFilter = myObj.regexFilter;
        myObj.regexFilter = /123/;
        var actualValue = myObj.filterList(['1234', 'abcd', '12abc3']);
        myObj.regexFilter = oldFilter;
        return actualValue;
      }
    })
  ];
};