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
                        jsBin: 'katum',
                        name: 'For...Of Loops'
                    },
                    destructuringArrays: {
                        jsBin: 'fidig',
                        name: 'Destructuring: Arrays'
                    },
                    destructuringSwap: {
                        jsBin: 'sapuyo',
                        name: 'Destructuring: Swap'
                    },
                    destructuringObjects: {
                        jsBin: 'gagebowu',
                        name: 'Destructuring: Objects'
                    },
                    optionalParameters: {
                        jsBin: 'befey',
                        name: 'Optional Parameters'
                    }
                },
                Firebase: {

                }
            },
            order: {
                ES6: ['blockScopeLet', 'forOfLoops', 'optionalParameters', 'destructuringArrays', 'destructuringSwap', 'destructuringObjects'],
                Firebase: []
            }

        }
    });
}());