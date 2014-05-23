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
                    arrowFunctions: {
                        jsBin: 'mupone',
                        name: 'Arrow Functions'
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
                AngularFire: {
                    firebaseSimpleLogin: {
                        jsBin: '',
                        name: 'Firebase Simple Login'
                    }
                }
            },
            order: {
                ES6: ['blockScopeLet', 'arrowFunctions', 'forOfLoops', 'optionalParameters', 'destructuringArrays', 'destructuringSwap', 'destructuringObjects'],
                AngularFire: ['firebaseSimpleLogin']
            },

            getChallenge: function(id) {
                for (var group in this.challenges) {
                    for (var challengeId in this.challenges[group]) {
                        if (id === challengeId) {
                            return this.challenges[group][challengeId];
                        }
                    }
                }

                return undefined;
            }

        }
    });
}());