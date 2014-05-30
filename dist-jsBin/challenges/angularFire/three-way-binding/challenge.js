var MyCtrl = function ($firebase, $scope, myFirebaseUtils) {
  //Creates a reference to the firebase database.
  this.dbRef = new Firebase(myFirebaseUtils.getBaseUrl());
  this.scientists = $firebase(this.dbRef);

  /*
  TODO: $bind this.scientists.turing to Firebase so that
  any changes made to it will automatically be saved to
  Firebase.
   */

};