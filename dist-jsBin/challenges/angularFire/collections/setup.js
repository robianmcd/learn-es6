var app = angular.module('theSandboxChallenge.setup', ['theSandboxChallenge']);

var SetupCtrl = function ($injector, $firebase, $rootScope, $q, $timeout, myFirebaseUtils, findTranscludedScope, htmlUtils) {
  var setup = this;

  this.options = {};
  this.options.group = 'AngularFire';
  this.options.challengeId = 'collections';
  this.options.showOutput = true;

  myFirebaseUtils.setCurrentChallenge(this.options.challengeId);

  this.options.description = '1. <code>this.devResumeChecklist</code> in <code>myCtrl</code> contains a refrence to a ' +
    'collection of items from Firebase. Add an ng-repeat to the HTML that iterates over this collection and assigns ' +
    'each element to a variable called <code>item</code>. Note that this "collection" is an Object not an Array. You ' +
    'can take a look at the structure of the firebae data here: ' + htmlUtils.buildNewTabLink(myFirebaseUtils.getBaseUrl()) +
    '<br/>' +
    '2. In <code>myCtrl</code> add <code>newChecklistItem</code> to the <code>devResumeChecklist</code> node in Firebase using ' +
    htmlUtils.buildNewTabLink('https://github.com/firebase/angularFire/blob/gh-pages/documentation.md#addvalue', '$add');

  this.dbRoot = $firebase(new Firebase(myFirebaseUtils.getBaseUrl()));

  var dbData = {
    "devResumeChecklist" : {
      "-JNyqFUBhALVbTvbsyWy" : {
        "description" : "Resume uses a combination of tabs and spaces to indent sections",
        "importance" : -15
      },
      "-JNyqFU8Peku5CVux8uu" : {
        "description" : "E-mail address at own domain",
        "importance" : 3
      },
      "-JNyqFUAg5pCEx09OU9q" : {
        "description" : "Knows only one programming language",
        "importance" : -4
      },
      "-JNyqFU7ottX4ZdTWBXn" : {
        "description" : "Resume compiled from latex",
        "importance" : 12
      },
      "-JNyqFU4bY0oV1mXbrW8" : {
        "description" : "Has written a compiler or OS for fun",
        "importance" : 15
      }
    },
    "source" : "http://stevehanov.ca/blog/index.php?id=56"
  };

  this.dbRoot.$set(dbData);


  this.options.testCases = [
    $injector.instantiate(TestCase, {
      description: 'The first row in the output table should have the first element from the devResumeChecklist collection from Firebase',
      expression: "$('td[id=desc]').eq(0).text()",
      expectedValue: 'Has written a compiler or OS for fun',
      runTest: function () {
        var promiseMgr = $q.defer();

        $timeout(function () {
            promiseMgr.resolve($('td[id=desc]').eq(0).text());
        });

        return promiseMgr.promise;
      }
    }),
    $injector.instantiate(TestCase, {
      description: '<code>newChecklistItem</code> should be added to the devResumeChecklist collection in Firebase.',
      expression: '',
      expectedValue: true,
      runTest: function () {
        var promiseMgr = $q.defer();

        var notifyFirebaseContainsNewItem = function () {
          var itemIds = setup.dbRoot.$child('devResumeChecklist').$getIndex();
          var lastAddedDescription = setup.dbRoot.devResumeChecklist[itemIds[itemIds.length - 1]].description;

          promiseMgr.notify(lastAddedDescription === 'Mentions skills in Excel/Word');
        };

        setup.dbRoot.$on("change", notifyFirebaseContainsNewItem);
        $timeout(notifyFirebaseContainsNewItem);

        return promiseMgr.promise;
      }
    }),

    $injector.instantiate(TestCase, {
      description: 'The last row in the output table should have the <code>newChecklistItem</code> that you added to Firebase',
      expression: "$('td[id=desc]').eq(5).text()",
      expectedValue: 'Mentions skills in Excel/Word',
      runTest: function () {
        var promiseMgr = $q.defer();

        $timeout(function () {
          promiseMgr.resolve($('td[id=desc]').eq(5).text());
        });

        return promiseMgr.promise;
      }
    })
  ];
};