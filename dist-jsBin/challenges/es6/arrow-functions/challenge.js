let myObj = {
  regexFilter: /abc/,

  /*
   Takes an array of strings and filters out the elements
   that do not match regexFilter.
   Returns the resulting array.
   */
  filterList: function (list) {
    return list.filter(
      function (element) {
        /*
         TODO: this.regexFilter is undefined here.
         Fix this issue using ES6 arrow functions.
         */
        return element.match(this.regexFilter);
      }
    );

  }
};