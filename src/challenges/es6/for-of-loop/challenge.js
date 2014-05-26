/*
 Someone came along and monkey patched array.prototype. Now
 the for...in loop in sumArray() is iterating over the array
 elements AND this string.
 */
Array.prototype.customExpression = "Monkey Patched";


function sumArray(inputArray) {
  let sum = 0;

  /*
   TODO: This loop is iterating over more than just the
   elements in inputArray. To fix that replace this
   for...in loop with a for...of loop.
   */
  for (let i in inputArray) {
    sum += inputArray[i];
  }

  return sum;
}
