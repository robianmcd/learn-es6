(function() {

    var app = angular.module('learnEs6');

    //language=HTML
    var learnEs6Html = '\
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
            </div>\
            <div>\
                <h3>Leaderboard</h3>\
                <div class="row">\
                    <div class="col-sm-6">\
                        <div class="panel panel-success">\
                            <div class="panel-heading">High scores</div>\
                            <div class="panel-body">\
                                <div class="row" ng-repeat="userData in wrapperCtrl.usersData | orderByPriority | orderBy:wrapperCtrl.getScoreFromUserData.bind(wrapperCtrl) | reverse | limitTo:10">\
                                    <div class="col-xs-1">\
                                        <h3>{{$index + 1}}</h3>\
                                    </div>\
                                    <!--Bootstrap has issues with col-xs-1 columns so we need to make this one 10 instead of 11: http://stackoverflow.com/questions/18365908/bootstrap-3-column-wraps-in-portrait-view-only-->\
                                    <div class="col-xs-10">\
                                        <!--The margins on top of a media entry are only applied if they are not a first child. This makes sure that only the first media entry is a first child-->\
                                        <div ng-if="$index !== 0"></div>\
                                        <div class="media">\
                                            <a class="pull-left" href="">\
                                                <img class="media-object" ng-src="{{userData.profile.pic}}" width="60px" alt="Profile Picture">\
                                            </a>\
                                            <div class="media-body">\
                                                <h4 class="media-heading">{{userData.profile.name}}</h4>\
                                                Score: <strong>{{wrapperCtrl.getScoreFromUserData(userData) || 0}}</strong>\
                                            </div>\
                                        </div>\
                                    </div>\
                                </div>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="col-sm-6">\
                        <div class="panel panel-info">\
                            <div class="panel-heading">Recent Activity</div>\
                            <div class="panel-body">\
                                <div class="media" ng-repeat="userData in wrapperCtrl.usersData | orderByPriority | reverse | limitTo:10">\
                                    <a class="pull-left" href="">\
                                        <img class="media-object" ng-src="{{userData.profile.pic}}" width="60px" alt="Profile Picture">\
                                    </a>\
                                    <div class="media-body">\
                                        <h4 class="media-heading">{{userData.profile.name}}</h4>\
                                        Completed "<strong>{{wrapperCtrl.getLastCompletedChallengeFromUserData(userData).name}}</strong>", \
                                        {{wrapperCtrl.timeSince(wrapperCtrl.getLastCompletedChallengeFromUserData(userData).date)}} ago.\
                                    </div>\
                                </div>\
                            </div>\
                        </div>\
                    </div>\
                </div>\
            </div>';

    app.directive('learnEs6', function() {
        return {
            scope: {
                testCases: '=',
                challengeId: '@'
            },
            controller: LearnEs6WrapperCtrl,
            controllerAs: 'wrapperCtrl',
            template: learnEs6Html
        }
    });

    var LearnEs6WrapperCtrl = function($scope, $rootScope, $firebase, $firebaseSimpleLogin) {
        var _this = this;
        this.testCases = $scope.testCases;
        this.challengeId = $scope.challengeId;

        this.CHALLENGES = {
            scopes01: {
                jsBin: 'xuboz',
                name: 'Scopes Level 1'
            },
            scopes02: {
                jsBin: 'TEST',
                name: 'Scopes Level 2'
            }
        };

        //setup firebase connection
        this.dbRef = new Firebase('https://live-leaderboard.firebaseio.com/learnEs6');
        this.usersData = $firebase(this.dbRef);
        this.auth = $firebaseSimpleLogin(this.dbRef);
        $rootScope.$on("$firebaseSimpleLogin:login", this.onUserLoggedIn.bind(this));

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

    LearnEs6WrapperCtrl.prototype.onUserLoggedIn = function(event, user) {
        var _this = this;
        this.usersData[user.uid] = this.usersData[user.uid] || {};

        //Wait for the data to load from firebase incase it hasn't already been loaded
        this.usersData.then(function() {
            _this.usersData[user.uid].profile = {
                name: user.displayName,
                pic: user.thirdPartyUserData.avatar_url
            };

            _this.usersData[user.uid].challenges = _this.usersData[user.uid].challenges || {};

            if (_this.allPassing && !_this.usersData[user.uid].challenges[_this.challengeId]) {
                var now = new Date();
                _this.usersData[user.uid].challenges[_this.challengeId] = now;
                _this.usersData[user.uid].$priority = now;
            }

            _this.usersData.$save(user.uid);
        });
    };

    LearnEs6WrapperCtrl.prototype.getScoreFromUserData = function(userData) {
        var score = 0;

        for (var challengeId in userData.challenges) {
            if (this.CHALLENGES.hasOwnProperty(challengeId)) {
                score++;
            }
        }

        return score;
    };

    LearnEs6WrapperCtrl.prototype.getLastCompletedChallengeFromUserData = function(userData) {
        var latestCompletedChallengeDate = null;
        var latestCompletedChallenge = null;

        for (var challengeId in userData.challenges) {
            if (this.CHALLENGES.hasOwnProperty(challengeId)) {

                if (!latestCompletedChallengeDate || userData.challenges[challengeId] > latestCompletedChallengeDate) {
                    latestCompletedChallengeDate = userData.challenges[challengeId];
                    latestCompletedChallenge = this.CHALLENGES[challengeId];
                }
            }
        }

        //This shouldn't really come up but could if someone logs in before they complete a challenge.
        if (!latestCompletedChallengeDate) {
            return null;
        }

        var latestChallengeWithDate = angular.copy(latestCompletedChallenge);
        latestChallengeWithDate.date = latestCompletedChallengeDate;

        return latestChallengeWithDate;
    };


    //taken from http://stackoverflow.com/a/3177838/373655
    LearnEs6WrapperCtrl.prototype.timeSince = function(date) {
        if (typeof date !== 'object') {
            date = new Date(date);
        }

        var seconds = Math.floor((new Date() - date) / 1000);
        var intervalType;

        var interval = Math.floor(seconds / 31536000);
        if (interval >= 1) {
            intervalType = 'year';
        } else {
            interval = Math.floor(seconds / 2592000);
            if (interval >= 1) {
                intervalType = 'month';
            } else {
                interval = Math.floor(seconds / 86400);
                if (interval >= 1) {
                    intervalType = 'day';
                } else {
                    interval = Math.floor(seconds / 3600);
                    if (interval >= 1) {
                        intervalType = "hour";
                    } else {
                        interval = Math.floor(seconds / 60);
                        if (interval >= 1) {
                            intervalType = "minute";
                        } else {
                            intervalType = "second";
                        }
                    }
                }
            }
        }

        if (interval > 1) {
            intervalType += 's';
        }

        return interval + ' ' + intervalType;
    };

}());