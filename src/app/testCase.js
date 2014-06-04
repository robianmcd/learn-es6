var TestCase = function ($sce, $q, description, expression, expectedValue, runTest) {
  var _this = this;

  this.$q = $q;
  this.$sce = $sce;
  this.description = $sce.trustAsHtml(description);
  this.runTestUnsafe = runTest;

  this.wrapExpectedValueInPre = false;
  this.wrapActualValueInPre = false;

  if (expression) {
    if (expression.indexOf('<br/>') > -1 || expression.indexOf('\n') > -1) {
      this.expression = $sce.trustAsHtml('<pre>' + expression + '</pre>');
    }
    else {
      this.expression = $sce.trustAsHtml('<code>' + expression + '</code>');
    }


  }
  else {
    this.expression = $sce.trustAsHtml('n/a');
  }

  this.testHasRun = false;
  this.lastActualValue = '<Waiting>';
  this.expectedValue = '';

  var setExpectedValue = function (value) {
    _this.expectedValue = value;
  };

  $q.when(expectedValue).then(setExpectedValue, setExpectedValue, setExpectedValue);
};

TestCase.prototype.runTest = function () {
  var _this = this;
  this.testHasRun = true;

  var setLastValue = function (value) {
    _this.lastActualValue = value;
  };

  try {
    this.$q.when(this.runTestUnsafe()).then(setLastValue, setLastValue, setLastValue);
  } catch (err) {
    setLastValue(err);
  }

  return this.lastActualValue;
};

TestCase.prototype.isPassing = function () {
  var actualValue = this.getActualValue();

  if (this.expectedValue instanceof Array) {
    return this._compareArrays(this.expectedValue, actualValue);

/*  } else if (this.expectedValue instanceof Set) {
    return this.getPrettySetSummary(this.expectedValue) === this.getPrettySetSummary(actualValue);*/

  } else if(typeof this.expectedValue === 'object') {
    return JSON.stringify(this.expectedValue) === JSON.stringify(actualValue);

  } else {
    return this.expectedValue === actualValue;
  }
};

TestCase.prototype.getActualValue = function () {
  if (this.testHasRun === false) {
    this.runTest();
  }

  return this.lastActualValue;
};

TestCase.prototype.getDisplayableValue = function (value, setWrapInPre) {
  var displayString;
  setWrapInPre(false);

  if (value === undefined) {
    displayString = 'undefined';

  } else if (value instanceof Error) {
    displayString = value.toString();

  } else if (value instanceof Array) {
    displayString = JSON.stringify(value);

/*  } else if (value instanceof Set) {
    displayString = this.getPrettySetSummary(value);*/

  } else if (typeof value === 'object') {
    setWrapInPre(true);
    displayString = this.getPrettyObjectSummary(value);

  } else {
    displayString = String(value);
  }

  return displayString;
};

TestCase.prototype.getDisplayableExpectedValue = function () {
  var _this = this;
  return this.getDisplayableValue(this.expectedValue, function (wrap) {
    _this.wrapExpectedValueInPre = wrap
  });
};

TestCase.prototype.getDisplayableActualValue = function () {
  var _this = this;
  return this.getDisplayableValue(this.getActualValue(), function (wrap) {
    _this.wrapActualValueInPre = wrap
  });
};

//taken from http://stackoverflow.com/a/14853974/373655
TestCase.prototype._compareArrays = function (array1, array2) {
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

/*TestCase.prototype.getPrettySetSummary = function (set) {
  var output = '';

  if (!(set instanceof Set)) {
    return '';
  }

  var setItr = set.values();

  for (var elem = setItr.next(); !elem.done; elem = setItr.next()) {
    output += elem.value + ', ';
  }

  return 'Set [' + output.substring(0, output.length - 2) + ']';
};*/

TestCase.prototype.getPrettyObjectSummary = function (obj) {
  var maxProps = 4;
  var maxLineLength = 20;

  var numProps = 0;
  var output = '{\n';
  for (var key in obj) {
    if (numProps > 0) {
      output += ',\n';
    }

    if (numProps >= maxProps) {
      output += '  ...';
      break;
    }

    if (obj.hasOwnProperty(key)) {
      numProps += 1;
      output += '  ';

      var newLine;
      if (typeof obj[key] === 'function') {
        newLine = key + ': ' + obj[key].toString();
      } else {
        newLine = key + ': ' + JSON.stringify(obj[key]);
      }

      if (newLine.length > maxLineLength) {
        newLine = newLine.substring(0, maxLineLength - 3) + '...';
      }

      output += newLine;
    }
  }

  return output + '\n}';
};