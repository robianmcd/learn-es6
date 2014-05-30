var app = angular.module('theSandboxChallenge.setup', ['theSandboxChallenge']);

var SetupCtrl = function ($injector, $firebase, $rootScope, $q, $timeout, myFirebaseUtils, findTranscludedScope, htmlUtils) {
  var setup = this;

  this.options = {};
  this.options.group = 'AngularFire';
  this.options.challengeId = 'threeWayBinding';
  this.options.showOutput = true;

  myFirebaseUtils.setCurrentChallenge(this.options.challengeId);

  this.options.description = 'In a previous challenge you had to use <code>$save()</code> to save local changes to ' +
    'firebase. For this challenge use ' + htmlUtils.buildNewTabLink('https://github.com/firebase/angularFire/blob/gh-pages/documentation.md#bindscope-model', '$bind') +
    ' to automatically save all local changes on <code>this.scientists.turing</code> to Firebase. Once you\'ve got ' +
    'it working you should be able to edit any of Turing\'s fields and see the changes automatically saved to Firebase.<br/><br/>' +
    '<strong>Hint:</strong> you\'ll also need to use ' + htmlUtils.buildNewTabLink('https://github.com/firebase/angularFire/blob/gh-pages/documentation.md#childkey', '$child') +
    ' in this challenge.<br/><br/>' +
    'Firebase: ' + htmlUtils.buildNewTabLink(myFirebaseUtils.getBaseUrl());

  this.dbRoot = $firebase(new Firebase(myFirebaseUtils.getBaseUrl()));

  var dbData = {
    liskov: {
      name: 'Barbara Liskov',
      born: '1939',
      summary: 'Professor at MIT and creator of the Liskov Substitution Principle',
      ".priority": 1939
    },
    dijkstra: {
      name: 'Edsger Dijkstra',
      born: '1930',
      summary: 'Received the 1972 Turing Award for fundamental contributions to developing programming languages',
      ".priority": 1930
    },
    turing: {
      name: 'Alen Turing',
      born: '1912',
      summary: 'A British mathematician, logician, cryptanalyst, computer scientist and philosopher',
      ".priority": 1912
    }
  };

  this.dbRoot.$set(dbData);


  this.options.testCases = [
    $injector.instantiate(TestCase, {
      description: 'Changing Alen Turing\'s name to "Alen" should automatically update it on Firebase',
      expression: "this.scientists.turing.name = 'Alen'",
      expectedValue: 'Alen',
      runTest: function () {
        return findTranscludedScope().then(function(scope) {
          var myCtrl = scope.ctrl;
          myCtrl.scientists.turing.name = 'Alen';

          return $timeout(function() {
            myCtrl.scientists.turing.name = 'Alen Turing';
            return setup.dbRoot.turing.name;
          });

        });
      }
    }),
    $injector.instantiate(TestCase, {
      description: 'Changing Edsger Dijkstra\'s name to "Edsger" should <strong>NOT</strong> update it on Firebase',
      expression: "this.scientists.dijkstra.name = 'Edsger'",
      expectedValue: 'Edsger Dijkstra',
      runTest: function () {
        return findTranscludedScope().then(function(scope) {
          var myCtrl = scope.ctrl;
          myCtrl.scientists.dijkstra.name = 'Edsger';

          return $timeout(function() {
            myCtrl.scientists.dijkstra.name = 'Edsger Dijkstra';
            return setup.dbRoot.dijkstra.name;
          });

        });
      }
    })
  ];
};