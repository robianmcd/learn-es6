var app = angular.module('theSandboxChallenge.setup', ['theSandboxChallenge']);

var SetupCtrl = function ($injector, $firebase, $q, $timeout, myFirebaseUtils, findTranscludedScope, htmlUtils) {
  var setup = this;

  this.options = {};
  this.options.group = 'AngularFire';
  this.options.challengeId = 'priority';
  this.options.showOutput = true;

  myFirebaseUtils.setCurrentChallenge(this.options.challengeId);

  this.options.description = 'In this challenge you will filter the output table so that it only disaplays the top 5 ' +
    'items and get the <code class="fa fa-plus"></code> / <code class="fa fa-minus"></code> buttons working so that ' +
    'they edit an item\'s importance and $priority. Each item in the output has an <code>importance</code> property ' +
    'which is shown in the table and a hidden <code>$priority</code> property which just has the same value as the ' +
    '<code>importance</code> and will be used for sorting. <br/><br/>' +
    '1. Implement the <code>setImportance()</code> function so that it sets the item\'s <code>importance</code> and ' +
    htmlUtils.buildNewTabLink('https://github.com/firebase/angularFire/blob/gh-pages/documentation.md#priority', '$priority') +
    ' and ' + htmlUtils.buildNewTabLink('https://github.com/firebase/angularFire/blob/gh-pages/documentation.md#savekey', '$save') +
    's the changes to Firebase.<br/>' +
    '2. In the <code>ng-repeat</code> apply the ' + htmlUtils.buildNewTabLink('https://github.com/firebase/angularFire/blob/34d7abbc1691fa65a2f8119f1dd03cbbf171ac63/documentation.md#orderbypriority', 'orderByPriority') +
    ' filter to <code>ctrl.devResumeChecklist</code>. This will convert the object into an Array and sort it by each ' +
    'item\'s <code>$priority</code>. The Default sort order puts the lowest priority item first (for some reason) so ' +
    'use the custom <code>reverse</code> filter that is supplied. Then just use Angular\'s ' +
    htmlUtils.buildNewTabLink('https://docs.angularjs.org/api/ng/filter/limitTo', 'limitTo') + ' filter to select the ' +
    'top 5 items in the list.<br/><br/>' +
    'Firebase: ' + htmlUtils.buildNewTabLink(myFirebaseUtils.getBaseUrl());

  this.dbRoot = $firebase(new Firebase(myFirebaseUtils.getBaseUrl()));


  var dbData = {
      "devResumeChecklist" : {
        "-JO-d1M-BsbqydeKwPCQ" : {
          ".priority" : 15.0,
          "description" : "Has written a compiler or OS for fun",
          "importance" : 15
        },
        "-JO-d1LrZy5CB4K4zjyr" : {
          ".priority" : 11.0,
          "description" : "Contributes to open source software",
          "importance" : 11
        },
        "-JO-d1Lwdsewu-csAPGX" : {
          ".priority" : -10.0,
          "description" : "Lists visual basic experience first",
          "importance" : -10
        },
        "-JO-d1Ly104T_akiZIh7" : {
          ".priority" : 0.0,
          "description" : "Lists job at fast food chain",
          "importance" : 0
        },
        "-JO-d1LtP0y2yuOcazU7" : {
          ".priority" : 4.0,
          "description" : "Founded a company",
          "importance" : 4
        },
        "-JO-d1M4OH_9FLV1694C" : {
          ".priority" : 8.0,
          "description" : "Has blog discussing programming topics",
          "importance" : 8
        },
        "-JO-d1MDJ1fSJw_ErmN3" : {
          ".priority" : -6.0,
          "description" : "Resume more than 3 pages long",
          "importance" : -6
        },
        "-JO-d1M1B9BYVIwRGwEo" : {
          ".priority" : -0.5,
          "description" : "Looks kind of drunk in facebook picture",
          "importance" : -0.5
        },
        "-JO-d1M2T6IBeCOBUW7o" : {
          ".priority" : 3.0,
          "description" : "E-mail address at own domain",
          "importance" : 3
        },
        "-JO-d1M7ltZ-peFiM_Av" : {
          ".priority" : 12.0,
          "description" : "Resume compiled from latex",
          "importance" : 12
        },
        "-JO-d1LugkN--Y_TCx9C" : {
          ".priority" : -2.0,
          "description" : "Spelling or grammar errors on resume",
          "importance" : -2
        },
        "-JO-d1M6Y6HwmJ6BLcs6" : {
          ".priority" : -15.0,
          "description" : "Resume uses a combination of tabs and spaces to indent sections",
          "importance" : -15
        },
        "-JO-d1M0jvnpyfonbLh-" : {
          ".priority" : 4.0,
          "description" : "Has internship",
          "importance" : 4
        },
        "-JO-d1LmOSvIOyuzJxh2" : {
          ".priority" : 5.0,
          "description" : "Knows 3 or more programming languages",
          "importance" : 5
        },
        "-JO-d1Lwdsewu-csAPGY" : {
          ".priority" : -4.0,
          "description" : "Knows only one programming language",
          "importance" : -4
        },
        "-JO-d1M3lP1pDcYRK1bR" : {
          ".priority" : -4.0,
          "description" : "All programming experience in class",
          "importance" : -4
        }
      },
      "source" : "http://stevehanov.ca/blog/index.php?id=56"
    };

  this.dbRoot.$set(dbData);

  var _this = this;


  var modifyImportanceId = "-JO-d1M2T6IBeCOBUW7o";


  this.options.testCases = [
    $injector.instantiate(TestCase, {
      description: 'Calling <code>this.setImportance(item, 5)</code> for the "E-mail address at own domain" item should set that item\'s <strong><code>importance</code></strong> to 5 <strong>locally</strong>',
      expression: 'this.setImportance(item, 5)<br/>item.importance',
      expectedValue: 5,
      runTest: function () {
        return findTranscludedScope().then(function(scope) {
          var myCtrl = scope.ctrl;

          myCtrl.setImportance(myCtrl.devResumeChecklist[modifyImportanceId], 5);
          return myCtrl.devResumeChecklist[modifyImportanceId].importance;
        });
      }
    }),
    $injector.instantiate(TestCase, {
      description: 'Calling <code>this.setImportance(item, 5)</code> for the "E-mail address at own domain" item should set that item\'s <strong><code>$priority</code></strong> to 5 <strong>locally</strong>',
      expression: 'this.setImportance(item, 5)<br/>item.$priority',
      expectedValue: 5,
      runTest: function () {
        return findTranscludedScope().then(function(scope) {
          var myCtrl = scope.ctrl;

          return myCtrl.devResumeChecklist[modifyImportanceId].$priority;
        });
      }
    }),
    $injector.instantiate(TestCase, {
      description: 'Calling <code>this.setImportance(item, 5)</code> for the "E-mail address at own domain" item should set that item\'s <strong><code>importance</code></strong> to 5 <strong>remotely on Firebase</strong>',
      expression: '',
      expectedValue: 5,
      runTest: function () {
        return findTranscludedScope().then(function(scope) {
          var myCtrl = scope.ctrl;

          return setup.dbRoot.devResumeChecklist[modifyImportanceId].importance;
        });
      }
    }),
    $injector.instantiate(TestCase, {
      description: 'Calling <code>this.setImportance(item, 5)</code> for the "E-mail address at own domain" item should set that item\'s <strong><code>$priority</code></strong> to 5 <strong>remotely on Firebase</strong>',
      expression: '',
      expectedValue: 5,
      runTest: function () {
        return findTranscludedScope().then(function(scope) {
          var myCtrl = scope.ctrl;

          //No Idea why I have to use $child here but it doesn't get the priority otherwise :(
          return setup.dbRoot.$child('devResumeChecklist')[modifyImportanceId].$priority;
        });
      }
    }),
    $injector.instantiate(TestCase, {
      description: 'The first row in the output table should have the highest priority item',
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
      description: 'The table should be limited to 5 rows',
      expression: "$('td[id=desc]').length",
      expectedValue: 5,
      runTest: function () {
        var promiseMgr = $q.defer();

        $timeout(function () {
          promiseMgr.resolve($('td[id=desc]').length);
        });

        return promiseMgr.promise;
      }
    })
  ];
};