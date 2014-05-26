var wrapperApp = angular.module('wrapperApp', ['theSandboxChallenge.config', 'ngRoute']);

var htmlTemplate = '<div style="" ng-bind-html="jsBinIFrame"></div>';

wrapperApp.config(['$routeProvider',
  function ($routeProvider) {
    $routeProvider
      .when('/:group', {
        template: htmlTemplate,
        controller: 'wrapperCtrl'
      })
      .when('/:group/:challengeId', {
        template: htmlTemplate,
        controller: 'wrapperCtrl'
      })
      .otherwise({
        redirectTo: '/ES6'
      });
  }]);

var wrapperCtrl = function ($scope, $location, $sce, $routeParams, challengeConfig) {
  var group = $routeParams.group;

  var challengeId = $routeParams.challengeId || challengeConfig.order[group][0];
  var challenge = challengeConfig.challenges[group][challengeId];

  var jsBinHash = challenge.jsBin;

  var jsBinUrl = 'http://jsbin.com/' + jsBinHash + '/embed?';

  if (challenge.views) {
    jsBinUrl += challenge.views;

  } else {
    jsBinUrl += 'js,output';
  }

  $scope.jsBinIFrame = $sce.trustAsHtml('<iframe src="' + jsBinUrl + '" frameborder="0" style="overflow:hidden;height:100vh;width:100%"></iframe>');

  window.addEventListener("message",
    function (e) {
      if (typeof e.data === 'object') {
        switch (e.data.cmd) {
          case 'setLocation':
            location = e.data.params[0];
            break;
        }
      }
    },
    false
  );
};
