var app = angular.module('theSandboxChallenge.setup', ['theSandboxChallenge']);

var SetupCtrl = function($injector, $q, $rootScope, $firebaseSimpleLogin, $interval, findTranscludedScope, $timeout) {
    this.options = {};
    this.options.group = 'AngularFire';
    this.options.challengeId = 'userProfile';
    this.options.description = 'Now that your logged in, let\'s pull some information out of your <code>user</code> ' +
        'object. Find and return the <code>user</code> object from the <code>getUser()</code> function and display ' +
        'your <code>displayName</code>, <code>id</code>, and the <code>provider</code> used to login in the "My Profile" table.<br/><br/>' +
        '<em><strong>Tip:</strong> if your running low on screen real estate you can show or hide the panes from the "HTML", "JavaScript", and "Output" buttons up top.</em><br/>' +
        '<small>Note: if you skipped the first challenge and your not logged in you can log in from the nav bar.</small>';

    this.options.showOutput = true;

    var promiseDisplayNameMgr = $q.defer();
    var promiseIdMgr = $q.defer();
    var promiseProviderMgr = $q.defer();

    var promiseUserMgr = $q.defer();


    //For some reason you can't nofity until after the listener has been registered.
    $timeout(function() {
        promiseDisplayNameMgr.notify('<Waiting For Login>');
        promiseIdMgr.notify('<Waiting For Login>');
        promiseProviderMgr.notify('<Waiting For Login>');
        promiseUserMgr.notify('<Waiting For Login>');
    });

    $rootScope.$on("$firebaseSimpleLogin:login", function(event, user) {
        promiseDisplayNameMgr.notify(user.displayName);
        promiseIdMgr.notify(user.id);
        promiseProviderMgr.notify(user.provider);
        promiseUserMgr.notify(user);
    });

    this.options.testCases = [
        $injector.instantiate(TestCase, {
            description: 'Ensures that the "My Profile" table has your displayName',
            expression: "$('#displayName').text()",
            expectedValue: promiseDisplayNameMgr.promise,
            runTest: function() {
                var promiseMgr = $q.defer();

                var notifyTestCase = function() {
                    promiseMgr.notify($('#displayName').text());
                };
                notifyTestCase();

                $interval(function() {
                    notifyTestCase();
                }, 500);

                return promiseMgr.promise;
            }
        }),
        $injector.instantiate(TestCase, {
            description: 'Ensures that the "My Profile" table has your id',
            expression: "$('#id').text()",
            expectedValue: promiseIdMgr.promise,
            runTest: function() {
                var promiseMgr = $q.defer();

                var notifyTestCase = function() {
                    promiseMgr.notify($('#id').text());
                };
                notifyTestCase();

                $interval(function() {
                    notifyTestCase();
                }, 500);

                return promiseMgr.promise;
            }
        }),
        $injector.instantiate(TestCase, {
            description: 'Ensures that the "My Profile" table has the provider used to login',
            expression: "$('#provider').text()",
            expectedValue: promiseProviderMgr.promise,
            runTest: function() {
                var promiseMgr = $q.defer();

                var notifyTestCase = function() {
                    promiseMgr.notify($('#provider').text());
                };
                notifyTestCase();

                $interval(function() {
                    notifyTestCase();
                }, 500);

                return promiseMgr.promise;
            }
        }),
        $injector.instantiate(TestCase, {
            description: '<code>getUser()</code> returned the logged in user.',
            expression: "this.getUser()",
            expectedValue: promiseUserMgr.promise,
            runTest: function() {
                var promiseMgr = $q.defer();

                findTranscludedScope().then(function(scope) {

                    scope.$on("$firebaseSimpleLogin:login", function() {
                        promiseMgr.notify(scope.ctrl.getUser());
                    });
                });

                return promiseMgr.promise;


            }
        })
    ];
};