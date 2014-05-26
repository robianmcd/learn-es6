(function () {
  var app = angular.module('theSandboxChallenge');

  //language=HTML
  var loginButtonsHtml = '\
        <span style="display:inline-block;">\
            <span ng-click="ctrl.login(\'github\')" class="fa fa-github btn btn-default btn-fa navbar-btn btn-github"></span>\
            <span ng-click="ctrl.login(\'google\')" class="fa fa-google-plus btn btn-default btn-fa navbar-btn btn-google"></span>\
            <span ng-click="ctrl.login(\'facebook\')" class="fa fa-facebook-square btn btn-default btn-fa navbar-btn btn-facebook"></span>\
        </span>';


  app.directive('loginButtons', function () {
    return {
      template: loginButtonsHtml
    }
  });
})();