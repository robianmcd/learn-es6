(function () {
  var app = angular.module('theSandboxChallenge');

  app.factory('myFirebaseUtils', function () {
    return {
      currentChallengeId: 'theSandboxChallenge',
      setCurrentChallenge: function (challengeId) {
        this.currentChallengeId = challengeId;
      },
      getBaseUrl: function () {
        if (!localStorage.firebaseKey) {
          //Generates 5 character random string [a-z0-9]
          localStorage.firebaseKey = Math.random().toString(36).substring(2, 7);
        }

        return 'https://' + this.currentChallengeId + '-' + localStorage.firebaseKey + '.firebaseio-demo.com';
      }
    };
  });
})();