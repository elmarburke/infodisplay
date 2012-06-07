function User(context, username, password) {
  this.username;
  this.name;
  this.roles;
  
  this.checkState = function() {
    // First check if user logged in
    $.couch.session({
      success: function(data) {
        if(!data.userCtx.name) {
          console.log("User not logged in");
          return false;
        } else {
          console.log("User logged in: ", data.userCtx.name, data.userCtx.roles);
          this.username = data.userCtx.name;
          this.roles = data.userCtx.roles;
          return true;
        }
      }
    });
  }
  
  function login(username, password) {
    if(username == "" || password == "") {
      throw "Invalid arguments!";
    }
    $.couch.login({
      name: username,
      password: password,
      success: function(data) {
        if(data.ok == true) {
          this.username = username;
          context.redirect("#/");
        }
      }
    })
  }
  
  if((!username || username != "") && (!password || password != "")){
    login(username, password);
  }
}