var app = angular.module('theSandboxChallenge.setup', ['theSandboxChallenge', 'ui.bootstrap']);

var SetupCtrl = function($injector) {
    var _this = this;

    this.group = 'ES6';
    this.challengeId = 'destructuringObjects';
    this.description = 'Call <code>getAfricanSwallowStats()</code> and using destructuring assign the <code>name</code> ' +
        'property to a variable called <code>name</code> and the <code>airSpeedMetersPerSecond</code> property to a ' +
        'variable called <code>airSpeed</code>. ' +
        '<br/>' +
        'Note: you should be able to do all of this in one line.';

    this.window = window;

    this.testCases = [
        $injector.instantiate(TestCase, {
            description: 'name',
            expression: 'name',
            expectedValue: 'African Swallow',
            getActualValue: function() {
                return _this.window.name;
            }
        }),
        $injector.instantiate(TestCase, {
            description: 'airSpeed',
            expression: 'airSpeed',
            expectedValue: 11,
            getActualValue: function() {
                return _this.window.airSpeed;
            }
        })
    ];
};