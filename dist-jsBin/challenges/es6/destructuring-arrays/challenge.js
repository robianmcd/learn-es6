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
 TODO: doubleANumber() returns an array of two elements.
 Assign the first element to a variable called "numIsValid"
 and the second element to a variable called "num".

 Using ES6 destructuring you should be able to call the
 function and make both variable declarations all on the
 same line.
 */
doubleANumber(21);



if (window.numIsValid) {
    console.log(window.num);
}