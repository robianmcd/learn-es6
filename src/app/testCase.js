var TestCase = function($sce, description, expression, expectedValue, getActualValue) {
    this.description = $sce.trustAsHtml(description);


    if (expression) {
        this.expression = $sce.trustAsHtml('<code>' + expression + '</code>');
    }
    else {
        this.expression = $sce.trustAsHtml('n/a');
    }

    this.expectedValue = expectedValue;
    this.getActualValue = getActualValue;
};

TestCase.prototype.isPassing = function() {
    try {
        var actualValue = this.getActualValue();

        if (this.expectedValue instanceof Array) {
            return this._compareArrays(this.expectedValue, actualValue);
        } else {
            return this.expectedValue === actualValue;
        }
    }
    catch(err) {
        return false;
    }
};

//taken from http://stackoverflow.com/a/14853974/373655
TestCase.prototype._compareArrays = function(array1, array2) {
    // if an array is a falsy value, return
    if (!array1 || !array2) {
        return false;
    }

    // compare lengths - can save a lot of time
    if (array1.length != array2.length)
        return false;

    for (var i = 0; i < array1.length; i++) {
        // Check if we have nested arrays
        if (array1[i] instanceof Array && array2[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this._compareArrays(array1[i], array2[i])) {
                return false;
            }
        }
        else if (array1[i] != array2[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
};