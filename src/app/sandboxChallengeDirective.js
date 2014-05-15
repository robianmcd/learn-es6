(function() {

    var app = angular.module('theSandboxChallenge');

    //language=HTML
    var sandboxChallengeHtml = '\
        <div style="margin-top:30px">\
            <div class="navbar navbar-default">\
                <div class="container-fluid">\
                    <div class="navbar-header">\
                        <span class="navbar-brand">Challenges:</span>\
                    </div>\
                    <ul class="nav navbar-nav">\
                        <li ng-repeat="(group, challenge) in ctrl.challengeConfig.challenges" ng-class="{active: group === ctrl.group}">\
                            <a ng-click="ctrl.goToGroup(group)" href="">{{group}}</a>\
                        </li>\
                    </ul>\
                    <span ng-if="ctrl.loginStateDetermined && !ctrl.auth.user">\
                        <span class="navbar-right">\
                            Login with:\
                            <span login-buttons></span>\
                        </span>\
                    </span>\
                    <span ng-if="ctrl.loginStateDetermined && ctrl.auth.user">\
                        <span style="margin-top:5px" class="navbar-right">\
                            <a ng-click="ctrl.logout()" class="navbar-link" href="">Log out</a>\
                            <img class="navbar-img" height="40px" ng-src="{{ctrl.getPicFromUser(ctrl.auth.user)}}" alt="Profile"/>\
                        </span>\
                    </span>\
                </div>\
            </div>\
            <div style="margin: 20px 5px">\
                <div style="width: 100%" class="btn-group btn-group-lg" dropdown>\
                    <button style="width: 100%" type="button" class="btn btn-default dropdown-toggle">\
                        <span ng-show="ctrl.challenges[ctrl.challengeId].completed" class="text-success glyphicon glyphicon-ok"></span> \
                        {{ctrl.challenges[ctrl.challengeId].name}} <span class="caret"></span>\
                    </button>\
                    <ul class="dropdown-menu" role="menu">\
                        <li ng-repeat="challengeId in ctrl.challengeOrder">\
                            <a href="" ng-click="ctrl.goToChallenge(challengeId)">\
                                <span ng-show="ctrl.challenges[challengeId].completed" class="text-success glyphicon glyphicon-ok"></span> \
                                <strong ng-show="challengeId === ctrl.challengeId">{{ctrl.challenges[challengeId].name}}</strong>\
                                <span ng-show="challengeId !== ctrl.challengeId">{{ctrl.challenges[challengeId].name}}</span>\
                            </a>\
                        </li>\
                    </ul>\
                </div>\
            </div>\
            \
            <p ng-bind-html="ctrl.description"></p>\
            \
            <h4>Test Cases</h4>\
            <table class="table">\
                <tr>\
                    <th></th>\
                    <th>Description</th>\
                    <th>Expression</th>\
                    <th>Expected Value</th>\
                    <th>Actual Value</th>\
                </tr>\
                <tr ng-repeat="testCase in ctrl.testCases">\
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
            <div ng-show="ctrl.allPassing">\
                Nice Job!\
                <div ng-show="ctrl.loginStateDetermined && !ctrl.auth.user">\
                    Share you accomplishments on the leader board by logging in:\
                    <span login-buttons></span>\
                </div>\
                <div ng-show="ctrl.getNextChallengeId()" style="text-align:center; margin-top:20px">\
                    <button ng-click="ctrl.goToChallenge(ctrl.getNextChallengeId())" class="btn btn-success btn-lg">\
                        Next Challenge <span class="fa fa-arrow-right"></span>\
                    </button>\
                </div>\
            </div>\
            <div>\
                <h3>Leaderboard</h3>\
                <div class="row">\
                    <div class="col-sm-6">\
                        <div class="panel panel-success">\
                            <div class="panel-heading">High scores</div>\
                            <div class="panel-body">\
                                <div class="row" ng-repeat="userData in ctrl.leaderboard | orderByPriority | orderBy:ctrl.getScoreFromUserData.bind(ctrl) | reverse | limitTo:10">\
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
                                                Score: <strong>{{ctrl.getScoreFromUserData(userData) || 0}}</strong>\
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
                                <div class="media" ng-repeat="userData in ctrl.leaderboard | orderByPriority | reverse | limitTo:10" \
                                    ng-init="lastChallenge = ctrl.getLastCompletedChallengeFromUserData(userData)" ng-show="lastChallenge">\
                                    <a class="pull-left" href="">\
                                        <img class="media-object" ng-src="{{userData.profile.pic}}" width="60px" alt="Profile Picture">\
                                    </a>\
                                    <div class="media-body">\
                                        <h4 class="media-heading">{{userData.profile.name}}</h4>\
                                        Completed "<strong>{{lastChallenge.name}}</strong>", \
                                        {{ctrl.timeSince(lastChallenge.date)}} ago.\
                                    </div>\
                                </div>\
                            </div>\
                        </div>\
                    </div>\
                </div>\
            </div>\
        </div>\
        ';

    app.directive('sandboxChallenge', function() {
        return {
            scope: {
                group: '=',
                challengeId: '=',
                testCases: '=',
                description: '='

            },
            controller: SandboxChallengeCtrl,
            controllerAs: 'ctrl',
            template: sandboxChallengeHtml
        }
    });

    var SandboxChallengeCtrl = function($scope, $rootScope, $firebase, $firebaseSimpleLogin, $sce, challengeConfig) {
        var _this = this;
        this.group = $scope.group;
        this.challengeId = $scope.challengeId;
        this.testCases = $scope.testCases;
        this.description = $sce.trustAsHtml($scope.description);
        this.challengeConfig = challengeConfig;

        this.challenges = challengeConfig.challenges[this.group];
        this.challengeOrder = challengeConfig.order[this.group];

        //setup firebase connection
        this.dbRef = new Firebase('https://sandbox-challenge.firebaseio.com');
        this.leaderboard = $firebase(this.dbRef.child('leaderboard'));
        this.auth = $firebaseSimpleLogin(this.dbRef);
        $rootScope.$on("$firebaseSimpleLogin:login", this.onUserLoggedIn.bind(this));

        this.allPassing = true;
        for (var i = 0; i < this.testCases.length; i++) {
            this.allPassing = this.allPassing && this.testCases[i].isPassing();
        }

        if (this.allPassing) {
            this.challenges[this.challengeId].completed = true;
        }

        this.loginStateDetermined = false;
        this.auth.$getCurrentUser().then(function() {
            _this.loginStateDetermined = true;
        });

    };

    SandboxChallengeCtrl.prototype.login = function(provider) {
        this.auth.$login(provider);
    };

    SandboxChallengeCtrl.prototype.logout = function() {
        this.auth.$logout();
    };

    SandboxChallengeCtrl.prototype.onUserLoggedIn = function(event, user) {
        var _this = this;
        this.leaderboard[user.uid] = this.leaderboard[user.uid] || {};

        //Wait for the data to load from firebase incase it hasn't already been loaded
        var onDataLoaded = function() {
            _this.leaderboard[user.uid].profile = {
                name: user.displayName,
                pic: _this.getPicFromUser(user)
            };

            _this.leaderboard[user.uid].challenges = _this.leaderboard[user.uid].challenges || {};
            var userChallenges = _this.leaderboard[user.uid].challenges;

            if (_this.allPassing && !userChallenges[_this.challengeId]) {
                var now = new Date();
                userChallenges[_this.challengeId] = now;
                _this.leaderboard[user.uid].$priority = now;
            }

            _this.leaderboard.$save(user.uid);

            for (var key in userChallenges) {
                if (key in _this.challenges) {
                    _this.challenges[key].completed = true;
                }
            }
        };

        if (this.leaderboard.then) {
            this.leaderboard.then(onDataLoaded);
        } else {
            onDataLoaded();
        }
    };

    SandboxChallengeCtrl.prototype.getPicFromUser = function(user) {
        switch (user.provider) {
            case 'github':
                return user.thirdPartyUserData.avatar_url;
            case 'google':
                return user.thirdPartyUserData.picture;
            case 'facebook':
                return 'https://graph.facebook.com/' + user.id + '/picture';
        }

    };

    SandboxChallengeCtrl.prototype.getScoreFromUserData = function(userData) {
        var score = 0;

        for (var challengeId in userData.challenges) {
            if (this.challenges.hasOwnProperty(challengeId)) {
                score++;
            }
        }

        return score;
    };

    SandboxChallengeCtrl.prototype.getLastCompletedChallengeFromUserData = function(userData) {
        var latestCompletedChallengeDate = null;
        var latestCompletedChallenge = null;

        for (var challengeId in userData.challenges) {
            if (this.challenges.hasOwnProperty(challengeId)) {

                if (!latestCompletedChallengeDate || userData.challenges[challengeId] > latestCompletedChallengeDate) {
                    latestCompletedChallengeDate = userData.challenges[challengeId];
                    latestCompletedChallenge = this.challenges[challengeId];
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
    SandboxChallengeCtrl.prototype.timeSince = function(date) {
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

    SandboxChallengeCtrl.prototype.goToChallenge = function(challengeId) {
        window.top.postMessage({cmd: 'setLocation', params: ['#/' + this.group + '/' + challengeId]}, '*');
    };

    SandboxChallengeCtrl.prototype.goToGroup = function(group) {
        window.top.postMessage({cmd: 'setLocation', params: ['#/' + group]}, '*');
    };

    SandboxChallengeCtrl.prototype.getNextChallengeId = function() {
        var curChallengeIndex = this.challengeOrder.indexOf(this.challengeId);

        if (curChallengeIndex > -1 && curChallengeIndex < this.challengeOrder.length) {
            return this.challengeOrder[curChallengeIndex + 1];
        }
        else {
            return undefined;
        }
    }

}());