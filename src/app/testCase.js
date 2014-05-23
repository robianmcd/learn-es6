var TestCase = function($sce, $q, description, expression, expectedValue, runTest) {
    this.$q = $q;
    this.description = $sce.trustAsHtml(description);
    this.runTestUnsafe = runTest;


    if (expression) {
        if (expression.indexOf('<br/>') > -1) {
            this.expression = $sce.trustAsHtml('<pre>' + expression + '</pre>');
        }
        else {
            this.expression = $sce.trustAsHtml('<code>' + expression + '</code>');
        }


    }
    else {
        this.expression = $sce.trustAsHtml('n/a');
    }

    this.expectedValue = expectedValue;
};

TestCase.prototype.runTest = function() {
    var _this = this;

    if (this.lastActualValue === undefined) {
        this.lastActualValue = 'waiting';
    }

    var setLastValue = function(value) {
        _this.lastActualValue = value;
    };

    try {
        this.$q.when(this.runTestUnsafe()).then(setLastValue, setLastValue);
    } catch (err) {
        setLastValue(err);
    }

    return this.lastActualValue;
};

TestCase.prototype.isPassing = function() {
    var actualValue = this.getActualValue();

    if (this.expectedValue instanceof Array) {
        return this._compareArrays(this.expectedValue, actualValue);

    } else {
        return this.expectedValue === actualValue;
    }
};

TestCase.prototype.getActualValue = function() {
    if(this.lastActualValue === undefined) {
      this.runTest();
    }

    return this.lastActualValue;
};

TestCase.prototype.getDisplayableValue = function(value) {
    if (value === undefined) {
        return 'undefined';

    } else if (value instanceof Error) {
        return value.toString();

    } else {
        return value;
    }
};

TestCase.prototype.getDisplayableExpectedValue = function() {
    return this.getDisplayableValue(this.expectedValue);
};

TestCase.prototype.getDisplayableActualValue = function() {
    return this.getDisplayableValue(this.getActualValue());
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