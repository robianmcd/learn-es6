var MyCtrl = function ($firebase, myFirebaseUtils) {
  //Creates a reference to the firebase database.
  this.dbRef = new Firebase(myFirebaseUtils.getBaseUrl());

  this.charactersByFamily = $firebase(this.dbRef);

  //TODO use $child and $set to set the Joffrey object to: {traits: 'dead'}

};