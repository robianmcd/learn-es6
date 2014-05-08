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

//Assign the result of doubleANumber() to two variables called numIsValid and num in a single line of code:
_____ = doubleANumber(21);

if (numIsValid) {
    console.log(num);
}