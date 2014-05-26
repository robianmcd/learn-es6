var app = angular.module('theSandboxChallenge.setup', ['theSandboxChallenge']);

var SetupCtrl = function ($injector, $firebase, $rootScope, $q, $timeout, myFirebaseUtils, findTranscludedScope, htmlUtils) {
  this.options = {};
  this.options.group = 'AngularFire';
  this.options.challengeId = 'firebaseService';
  this.options.showOutput = true;

  myFirebaseUtils.setCurrentChallenge(this.options.challengeId);

  this.options.description = '1. Use the ' + htmlUtils.buildNewTabLink('https://github.com/firebase/angularFire/blob/gh-pages/documentation.md#firebase', '$firebase') + ' service to create a refrence to the Firebase data and assign it to <code>this.fbData</code>.<br/>' +
    '2. Then use the ' + htmlUtils.buildNewTabLink('https://github.com/firebase/angularFire/blob/gh-pages/documentation.md#updatevalue', '$update') + ' function to change the value of <code>this.fbData.lorem</code> to "my sample text".<br/>' +
    'This should make the change both locally and on the remote Firebase server. You can see the data on the remote Firebase server here: ' + htmlUtils.buildNewTabLink(myFirebaseUtils.getBaseUrl());

  var remoteFbData = $firebase(new Firebase(myFirebaseUtils.getBaseUrl()));
  remoteFbData.$set({
    lorem: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor',
    bacon: 'Bacon ipsum dolor sit amet t-bone spare ribs bacon pork turducken frankfurter jerky',
    hipster: {
      neat: 'Retro roof party readymade post-ironic, High Life irony Tonx Helvetica Echo',
      latin: 'VHS pour-over drinking vinegar scenester odio cliche. Single-origin coffee vero'
    }
  });

  this.options.testCases = [
    $injector.instantiate(TestCase, {
      description: '<code>lorem</code> should contain "my sample text" locally.',
      expression: "this.fbData.lorem",
      expectedValue: 'my sample text',
      runTest: function () {
        var promiseMgr = $q.defer();

        findTranscludedScope().then(function (scope) {
          var myCtrl = scope.ctrl;

          var notifyWithFirebaseContent = function () {
            try {
              promiseMgr.notify(myCtrl.fbData.lorem);
            } catch (err) {
              promiseMgr.notify(err);
            }

          };

          remoteFbData.$on("change", notifyWithFirebaseContent);
          $timeout(notifyWithFirebaseContent);
        });


        return promiseMgr.promise;
      }
    }),
    $injector.instantiate(TestCase, {
      description: '<code>lorem</code> should contain "my sample text" on the remote Firebase server.',
      expression: "",
      expectedValue: 'my sample text',
      runTest: function () {
        var promiseMgr = $q.defer();

        var notifyWithFirebaseContent = function () {
          try {
            promiseMgr.notify(remoteFbData.lorem);
          } catch (err) {
            promiseMgr.notify(err);
          }

        };

        remoteFbData.$on("change", notifyWithFirebaseContent);
        $timeout(notifyWithFirebaseContent);


        return promiseMgr.promise;
      }
    })
  ];
};