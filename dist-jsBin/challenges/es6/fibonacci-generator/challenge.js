function* fibonacci() {
  var pre = 0;
  var cur = 1;

  while(true) {
    yield cur;
    [pre, cur] = [cur, pre + cur];
  }
}

//TODO: return an array of all the fibonacci
//numbers less than max.
let getFibonacciNums = (max) => {
  let nums = [];



  return nums;
};