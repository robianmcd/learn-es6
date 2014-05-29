var app = angular.module('theSandboxChallenge.setup', ['theSandboxChallenge']);

var SetupCtrl = function($injector, $firebase, myFirebaseUtils, findTranscludedScope, htmlUtils) {
  var setup = this;

  this.options = {};
  this.options.group = 'AngularFire';
  this.options.challengeId = 'child';
  this.options.showOutput = true;

  myFirebaseUtils.setCurrentChallenge(this.options.challengeId);

  this.options.description = 'The object returnd from $firebase() has serveral helper methods for manipulating ' +
    'Firebase data like $update(), $remove() and $set(). However the child nodes of this object will not have any ' +
    'helper methods on it unless you get them using $child(). <br/><br/>' +
    'Use ' + htmlUtils.buildNewTabLink('https://github.com/firebase/angularFire/blob/gh-pages/documentation.md#childkey', '$child') +
    ' and ' + htmlUtils.buildNewTabLink('https://github.com/firebase/angularFire/blob/gh-pages/documentation.md#setvalue', '$set') +
    ' to set the "Joffery" object to {traits: \'dead\'}.<br/><br/>' +
    'Firebase: ' + htmlUtils.buildNewTabLink(myFirebaseUtils.getBaseUrl());

  this.dbRoot = $firebase(new Firebase(myFirebaseUtils.getBaseUrl()));

  var dbData = {
    Lannisters: {
      Joffrey: {
        occupation: 'king',
        traits: 'jerk'
      },
      Tywin: {
        occupation: 'running everything'
      },
      Tyrion: {
        alias: 'The Imp'
      }
    },
    Starks: {
      Arya: {
        quest: 'trying to get home'
      }
    },
    Other: {
      Hodor: {
        hodor: "HODOR!",
        img: "http://i.imgur.com/XTqNrH2.png"
      }
    }
  };

  this.dbRoot.$set(dbData);


  this.options.testCases = [
    $injector.instantiate(TestCase, {
      description: "The Joffrey object should be set to <code>{traits: 'dead'}</code> locally",
      expression: "myCtrl.charactersByFamily\n  .Lannisters.Joffrey",
      expectedValue: {traits: 'dead'},
      runTest: function() {
        return findTranscludedScope().then(function(scope) {
          var myCtrl = scope.ctrl;
          return myCtrl.charactersByFamily.Lannisters.Joffrey;
        });
      }
    }),
    $injector.instantiate(TestCase, {
      description: "The Joffrey object should be set to <code>{traits: 'dead'}</code> remotely on Firebase",
      expression: "",
      expectedValue: {traits: 'dead'},
      runTest: function() {
        return findTranscludedScope().then(function() {
          return setup.dbRoot.Lannisters.Joffrey;
        });
      }
    })
  ];
};