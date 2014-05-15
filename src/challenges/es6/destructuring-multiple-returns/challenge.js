let doubleANumber = function(num) {
    let valid, result;

    if (typeof num === 'number') {
        result = num * 2;
        valid = true;
    } else {
        valid = false;
    }

    return [valid, result];
};

/*
 TODO: Use ES6 "Destructuring" to assign the return value of
 doubleANumber() to two variables by filling in the blank. 
 Name the first variable "numIsValid".
 Name the second variable "num".
 */
_____ = doubleANumber(21);

if (numIsValid) {
    console.log(num);
}