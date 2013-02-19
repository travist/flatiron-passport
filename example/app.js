var flatiron =      require('flatiron');
var passport =      require('passport');
var LocalStrategy = require('passport-local').Strategy;
var fipassport =    require('../flatiron-passport');
var app =           flatiron.app;

// Use the passport strategy.
passport.use(new LocalStrategy(function(username, password, done) {

  // Use this as you normally would in Passport.js.
  // But for now just
  // hard-code the user object.
  done(null, {
    id: 1234,
    username: username,
    password: password
  });
}));

// Serialize based on the user ID.
passport.serializeUser(function(user, done) {

  // @todo: Save your user to the database using the ID as a key.
  done(null, user.id);
});

// Load the user and return it to passport.
passport.deserializeUser(function(id, done) {

  // @todo:  Load your user here based off of the ID, and call done with
  // that user object.
  done(null, {
    id:id,
    username:'foo',
    password:'bar'
  });
});

app.use(flatiron.plugins.http);
app.use(fipassport);

/**
 * Here the API to fipassport.authenticate is the exact same as it would
 * be fore passport.authenticate.  It is just a simple wrapper around that
 * function.
 */
app.router.get('/', function(){
  console.log(this.req.session);
  this.res.end();
});
app.router.get('/login', function(){
  console.log(this.req.user);
  console.log(this.req.session);
  this.res.html('<form action="/login" method="post"><input type="text" name="username"/><input type="password" name="pasword"/><input type="submit"/></form>');
});
app.router.post('/login', fipassport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

// Start our server at port 3000.
app.start(3000, function(){
  console.log('HTTP Server started on port 3000');
});