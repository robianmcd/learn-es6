var wrapperApp = angular.module('wrapperApp', ['theSandboxChallenge.config', 'ngRoute']);

var htmlTemplate = '<div style="" ng-bind-html="jsBinIFrame"></div>';

wrapperApp.config(['$routeProvider',
    function($routeProvider) {
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
                redirectTo: '/es6'
            });
    }]);

var wrapperCtrl = function($scope, $location, $sce, $routeParams, $injector, challengeConfig) {
    var group = $routeParams.group;

    var challengeId = $routeParams.challengeId || challengeConfig.order[group][0];

    console.log(group + " " + challengeId);
    var jsBinHash = challengeConfig.challenges[group][challengeId].jsBin;

    var jsBinUrl = 'http://jsbin.com/' + jsBinHash + '/embed?js,output"';

    $scope.jsBinIFrame = $sce.trustAsHtml('<iframe src="' + jsBinUrl + '" frameborder="0" style="overflow:hidden;height:100vh;width:100%"></iframe>');

    window.addEventListener( "message",
        function (e) {
            if(typeof e.data === 'function') {
                e.data(window, $injector);
            }
        },
        false
    );
};
