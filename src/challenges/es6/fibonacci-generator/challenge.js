function* fibonacci() {
  var pre = 0;
  var cur = 1;

  while(true) {
    yield cur;
    [pre, cur] = [cur, pre + cur];
  }
}

/*
TODO: return an array of all the fibonacci numbers
less than max.

Note: JSBin does not support Generator.next()
so you should iterate over the fibonacci generator
with a for...of loop.
 */
let getFibonacciNums = (max) => {
  let nums = [];



  return nums;
};