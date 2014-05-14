(function() {
    var app = angular.module('theSandboxChallenge');

    //language=HTML
    var loginButtonsHtml = '\
        <span ng-click="ctrl.login(\'github\')" style="font-size: 200%; padding:2px 6px" class="fa fa-github btn btn-default navbar-btn"></span>\
        <span ng-click="ctrl.login(\'google\')" style="font-size: 200%; padding:2px 6px" class="fa fa-google-plus btn btn-default navbar-btn"></span>\
        <span ng-click="ctrl.login(\'facebook\')" style="font-size: 200%; padding:2px 6px" class="fa fa-facebook-square btn btn-default navbar-btn"></span>';

    app.directive('loginButtons', function() {
        return {
            template: loginButtonsHtml
        }
    });
})();