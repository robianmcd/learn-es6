function* fibonacci() {
  var pre = 0;
  var cur = 1;

  while(true) {
    yield cur;
    [pre, cur] = [cur, pre + cur];
  }
}

//TODO: return a Set of all the fibonacci
//numbers less than max.
let getFibSet = (max) => {
  let nums = new Set();



  return nums;
};