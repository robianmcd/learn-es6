//Someone came along and monkey patched array.prototype. Now your for...in loop doesn't work anymore.
Array.prototype.customExtension = "Monkey Patched";

//TODO: Use a for...of loop so that it only iterates over the elements in the array.
function sumArray(inputArray) {
    let sum = 0;

    for(let i in inputArray) {
        sum += inputArray[i];
    }

    return sum;
}
