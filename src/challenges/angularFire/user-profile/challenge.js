var MyCtrl = function ($firebaseSimpleLogin) {
  //Creates a reference to the firebase database.
  this.dbRef = new Firebase('https://sandbox-challenge.firebaseio.com');

  //Creates an object that can be used preform
  //authentication actions like log the user in or get
  //the current user.
  this.loginObj = $firebaseSimpleLogin(this.dbRef);
};

MyCtrl.prototype.login = function () {
  this.loginObj.$login('github');
};

MyCtrl.prototype.getUser = function () {
  //TODO: return the user object that gets created when you login.
};