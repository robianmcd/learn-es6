var squareSum = 0;

/*
TODO: Using ES6 features, change the code so that the
temporary variables i and iSquared are not on the global
scope.
*/
for (var i = 1; i <= 10; i++) {
    var iSquared = i * i;
    squareSum += iSquared;
}