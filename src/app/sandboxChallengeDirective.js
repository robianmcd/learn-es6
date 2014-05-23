(function() {

    var app = angular.module('theSandboxChallenge');

    //language=HTML
    var sandboxChallengeHtml = '\
        <div style="margin-top:30px">\
            <div class="navbar navbar-default">\
                <div class="container-fluid">\
                    <div class="navbar-header">\
                        <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#navbar-collapse">\
                            <span class="sr-only">Toggle navigation</span>\
                            <span class="icon-bar"></span>\
                            <span class="icon-bar"></span>\
                            <span class="icon-bar"></span>\
                        </button>\
                        <span class="navbar-brand">The Sandbox Challenge</span>\
                    </div>\
                    <div class="collapse navbar-collapse" id="navbar-collapse">\
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
            <div class="well">\
                <p ng-bind-html="ctrl.description"></p>\
            </div>\
            <div>\
                <div id="transclude" ng-transclude></div>\
            </div>\
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
                        {{testCase.getDisplayableExpectedValue()}}\
                    </td>\
                    <td ng-class="{danger: !testCase.isPassing(), \'text-danger\': !testCase.isPassing()}">\
                        {{testCase.getDisplayableActualValue()}}\
                    </td>\
                </tr>\
            </table>\
            \
            <div ng-show="ctrl.getAllTestsPassing()">\
                <div class="alert alert-success">\
                    <strong>Nice Job!</strong> You completed the <em>&OpenCurlyDoubleQuote;{{ctrl.challenges[ctrl.challengeId].name}}&CloseCurlyDoubleQuote;</em> challenge.\
                </div>\
                <div class="alert alert-warning alert-dismissable" ng-show="ctrl.loginStateDetermined && !ctrl.auth.user">\
                        <strong>You are not logged in.</strong> Share you accomplishments on the leader board by logging in:\
                        <span login-buttons></span>\
                </div>\
                <div ng-show="ctrl.getNextChallengeId()" style="text-align:center; margin-top:20px">\
                    <button ng-click="ctrl.goToChallenge(ctrl.getNextChallengeId())" class="btn btn-success btn-lg">\
                        Next Challenge <span class="fa fa-arrow-right"></span>\
                    </button>\
                </div>\
            </div>\
            <hr/>\
            <div style="margin-top: 40px">\
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
                options: '='

            },
            transclude: true,
            controller: SandboxChallengeCtrl,
            controllerAs: 'ctrl',
            template: sandboxChallengeHtml
        }
    });

    var SandboxChallengeCtrl = function($scope, $rootScope, $firebase, $firebaseSimpleLogin, $sce, challengeConfig) {
        var _this = this;


        //Extract options
        this.group = $scope.options.group;
        this.challengeId = $scope.options.challengeId;
        this.testCases = $scope.options.testCases;
        this.description = $sce.trustAsHtml($scope.options.description);

        this.challengeConfig = challengeConfig;

        this.challenges = challengeConfig.challenges[this.group];
        this.challengeOrder = challengeConfig.order[this.group];

        //setup firebase connection
        this.dbRef = new Firebase('https://sandbox-challenge.firebaseio.com');
        this.leaderboard = $firebase(this.dbRef.child('leaderboard'));
        this.auth = $firebaseSimpleLogin(this.dbRef);
        $rootScope.$on("$firebaseSimpleLogin:login", this.onUserLoggedIn.bind(this));

        this.loginStateDetermined = false;
        this.auth.$getCurrentUser().then(function() {
            _this.loginStateDetermined = true;
        });

        this.allTestsPassedPreviously = false;
    };

    SandboxChallengeCtrl.prototype.getAllTestsPassing = function() {
        var allPassing = true;
        for (var i = 0; i < this.testCases.length; i++) {

            allPassing = allPassing && this.testCases[i].isPassing();
        }

        if (allPassing && !this.allTestsPassedPreviously) {
            this.allTestsPassedPreviously = true;
            this.challenges[this.challengeId].completed = true;

            //TODO: need to maybe update firebase here
        }

        return allPassing;
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

            //TODO: this stuff won't get hit if all tests start passing later
            if (_this.getAllTestsPassing() && !userChallenges[_this.challengeId]) {
                var now = new Date();
                userChallenges[_this.challengeId] = now;
                _this.leaderboard[user.uid].$priority = now;
            }

            _this.leaderboard.$save(user.uid);

            for (var key in userChallenges) {
                var curChallenge = _this.challengeConfig.getChallenge(key);
                if (curChallenge) {
                    curChallenge.completed = true;
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
            if (this.challengeConfig.getChallenge(challengeId)) {
                score++;
            }
        }

        return score;
    };

    SandboxChallengeCtrl.prototype.getLastCompletedChallengeFromUserData = function(userData) {
        var latestCompletedChallengeDate = null;
        var latestCompletedChallenge = null;

        for (var challengeId in userData.challenges) {
            var challenge = this.challengeConfig.getChallenge(challengeId);
            if (challenge) {
                if (!latestCompletedChallengeDate || userData.challenges[challengeId] > latestCompletedChallengeDate) {
                    latestCompletedChallengeDate = userData.challenges[challengeId];
                    latestCompletedChallenge = challenge;
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