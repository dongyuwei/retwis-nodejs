var sys = require("sys");

before(function(request) {
  var loggedIn = request.session["userId"]
  if (!loggedIn &&
      request.url.pathname !== "/login" && 
      request.url.pathname !== '/signup' && 
      request.url.pathname.indexOf("/public") !== 0) {
    this.redirect('/login');
  }
});


get('/login', function() {
  this.render("login.html.ejs", {
    locals: {
      login_error: null,
      signup_error: null
    }
  })                         
})

post('/login', function() {
  this.session["userId"] = 1;
  this.redirect("/")   
}) 

get('/logout', function() {
  this.session["userId"] = null
  this.redirect('/login')
})

post('/signup', function() {
  var signup_error = null
  var self = this
  
  if (!self.param('username').match(/^\w+$/))
    signup_error = "Username must only contain letters, numbers and underscores."
  else {
    RedisClient.get("user:username:" + self.param('username'), function(err, value) {
      if (value)
        signup_error = "That username is taken."
      else if (self.param('username').length < 4)
        signup_error = "Username must be at least 4 characters"
      else if (self.param('password').length < 6)
        signup_error = "Password must be at least 6 characters!"
      else if (self.param('password') != self.param('password_confirmation'))
        signup_error = "Passwords do not match!"
      
      if (signup_error)
        self.render("login.html.ejs", {
          locals: {
              login_error: null,
              signup_error: signup_error
          }
        })
      else {
        //user = User.create(param[:username], param[:password])
        self.session["userId"] = 1
        self.redirect("/")
      }          
    });
  }


})