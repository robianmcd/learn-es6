var MyCtrl = function ($firebase, myFirebaseUtils) {
  //Creates a reference to the firebase database.
  this.dbRef = new Firebase(myFirebaseUtils.getBaseUrl() + '/devResumeChecklist');
  this.devResumeChecklist = $firebase(this.dbRef);
};

MyCtrl.prototype.setImportance = function (item, newImportance) {
  /*
  TODO: Assign the newImportance to the item's importance
  and $priority and save the result to firebase using $save.
   */



};


var app = angular.module('theSandboxChallenge');
app.filter('reverse', function () {
  return function (items) {
    return items.slice().reverse();
  };
});