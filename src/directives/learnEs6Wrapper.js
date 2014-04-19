var app = angular.module('learnEs6.helper', ['firebase']);

app.config(function($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
        // Allow same origin resource loads.
        'self',
        // Allow loading from github pages
        'http://robianmcd.github.io/learn-es6/**']);
});

app.directive('learnEs6Wrapper', function() {
    return {
        scope: {
            testCases: '='
        },
        controller: LearnEs6WrapperCtrl,
        controllerAs: 'wrapperCtrl',
        //templateUrl: 'http://robianmcd.github.io/learn-es6/src/directives/learnEs6Wrapper.html.js',
        template: '\
            <h3>Test Cases</h3>\
            <table class="table">\
                <tr>\
                    <th></th>\
                    <th>Description</th>\
                    <th>Expression</th>\
                    <th>Expected Value</th>\
                    <th>Actual Value</th>\
                </tr>\
                <tr ng-repeat="testCase in wrapperCtrl.testCases">\
                    <td>\
                        <span ng-show="testCase.isPassing()" class="text-success glyphicon glyphicon-ok"></span>\
                        <span ng-show="!testCase.isPassing()" class="text-danger glyphicon glyphicon-remove"></span>\
                    </td>\
                    <td ng-bind-html="testCase.description"></td>\
                    <td ng-bind-html="testCase.expression"></td>\
                    <td>\
                        {{testCase.expectedValue || \'undefined\'}}\
                    </td>\
                    <td ng-class="{danger: !testCase.isPassing(), \'text-danger\': !testCase.isPassing()}">\
                        {{testCase.getActualValue() || \'undefined\'}}\
                    </td>\
                </tr>\
            </table>\
            \
            <div ng-show="wrapperCtrl.allPassing">\
                Nice Job!\
                <div ng-show="wrapperCtrl.loginStateDetermined && !wrapperCtrl.auth.user">\
                    Share you accomplishments on the leader board by logging in:\
                    <button ng-click="wrapperCtrl.login()">Login with Github</button>\
                </div>\
            </div>'
    }
});

var LearnEs6WrapperCtrl = function($scope, $firebase, $firebaseSimpleLogin) {
    var _this = this;

    this.testCases = $scope.testCases;

    this.dbRef = new Firebase('https://live-leaderboard.firebaseio.com');
    this.auth = $firebaseSimpleLogin(this.dbRef);

    this.allPassing = true;
    for (var i = 0; i < this.testCases.length; i++) {
        this.allPassing = this.allPassing && this.testCases[i].isPassing();
    }

    this.loginStateDetermined = false;
    this.auth.$getCurrentUser().then(function() {
        _this.loginStateDetermined = true;
    });
};

LearnEs6WrapperCtrl.prototype.login = function() {
    this.auth.$login('github');
};