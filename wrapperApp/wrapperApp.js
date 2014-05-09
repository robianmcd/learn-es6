var wrapperApp = angular.module('wrapperApp', ['ngRoute']);

wrapperApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            otherwise({
                template: '<div style="" ng-bind-html="jsBinIFrame"></div>',
                controller: 'wrapperCtrl'
            });
    }]);

var wrapperCtrl = function($scope, $location, $sce) {
    var jsBinUrl = 'http://jsbin.com' + $location.path() + '/embed?js,output"';

    $scope.jsBinIFrame = $sce.trustAsHtml('<iframe src="' + jsBinUrl + '" frameborder="0" style="overflow:hidden;height:100vh;width:100%"></iframe>');
};
