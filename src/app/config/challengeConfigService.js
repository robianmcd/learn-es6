(function() {
    var configApp = angular.module('theSandboxChallenge.config');

    configApp.factory('challengeConfig', function () {
        return {
            challenges: {
                ES6: {
                    blockScopeLet: {
                        jsBin: 'likum',
                        name: 'Block Scopes'
                    },
                    forOfLoops: {
                        jsBin: 'fidig',
                        name: 'For...Of Loops'
                    },
                    destructuringMultipleReturns: {
                        jsBin: 'katum',
                        name: 'Destructuring: Multiple Returns'
                    }
                },
                Firebase: {

                }
            },
            order: {
                ES6: ['blockScopeLet', 'forOfLoops', 'destructuringMultipleReturns'],
                Firebase: []
            }

        }
    });
}());