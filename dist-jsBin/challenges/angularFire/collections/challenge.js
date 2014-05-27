var MyCtrl = function ($firebase, myFirebaseUtils) {
  //Creates a reference to the firebase database.
  this.dbRef = new Firebase(myFirebaseUtils.getBaseUrl() + '/devResumeChecklist');
  this.devResumeChecklist = $firebase(this.dbRef);

  var newChecklistItem = {description: 'Mentions skills in Excel/Word', importance: -2};

  //TODO: add newChecklistItem to the devResumeChecklist in firebase
  this.devResumeChecklist.$add(newChecklistItem);
};