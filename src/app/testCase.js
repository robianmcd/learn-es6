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
    return this.getActualValue() === this.expectedValue;
};