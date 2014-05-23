var MyCtrl = function($firebaseSimpleLogin) {
    //Creates a reference to the firebase database.
    this.dbRef = new Firebase('https://sandbox-challenge.firebaseio.com');

    //Creates an object that can be used preform
    //authentication actions like log the user in or get
    //the current user.
    this.loginObj = $firebaseSimpleLogin(this.dbRef);
};

MyCtrl.prototype.login = function() {
    /*
     TODO: use the loginObj to log in using either 'github',
     'google', or 'facebook' as the provider.
     */

    this.loginObj.$login('google');
};