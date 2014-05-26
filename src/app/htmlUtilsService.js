(function () {
  var app = angular.module('theSandboxChallenge');

  app.factory('htmlUtils', function () {
    return {
      buildNewTabLink: function (href, text) {
        if (!text) {
          text = href;
        }

        return '<a href="' + href + '" target="_blank">' + text + '</a>';
      }
    };
  });
})();