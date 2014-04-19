var app = angular.module('learnEs6.helper', ['firebase']);

app.directive('learnEs6Wrapper', function() {
    return {
        scope: {
            testCases: '='
        },
        controller: LearnEs6WrapperCtrl,
        controllerAs: 'wrapperCtrl',
        templateUrl: 'http://robianmcd.github.io/learn-es6/src/directives/learnEs6Wrapper.html'
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