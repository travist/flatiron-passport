Passport.js integration for FlatIron web framework.
===================================================

This package allows [Flatiron.js](http://flatironjs.org) applications to easily use the [Passport.js](http://passportjs.org)
authentication framework.

There are only two things that are different between using this API and using the regular Passport API.

1.)  Instead of calling...

```javascript
var express = require('express');
var passport = require('passport');
var app = express();
// ... BOILERPLATE SETUP CODE GOES HERE ...
app.use(passport.initialize());
app.use(passport.session());
```

You simply need to call...
```javascript
var flatiron =      require('flatiron');
var fipassport =    require('flatiron-passport');
var app =           flatiron.app;
// ... BOILERPLATE SETUP CODE GOES HERE ...
app.use(fipassport);
```


2.)  Now anywhere you would use the variable ```passport```, you replace that with ```fipassport``` in your app, like so...

```javascript
passport.use(new LocalStrategy(function(username, password, done) {
  ...
  ...
});

passport.serializeUser(function(user, done) {
  ...
  ...
});

passport.deserializeUser(function(id, done) {
  ...
  ...
});

passport.authenticate(.....)
```

You simply call this instead...
```javascript
fipassport.use(new LocalStrategy(function(username, password, done) {
  ...
  ...
});

fipassport.serializeUser(function(user, done) {
  ...
  ...
});

fipassport.deserializeUser(function(id, done) {
  ...
  ...
});

fipassport.authenticate(.....)
```

Please refer to the included example to get a better idea....

Install
------------------------
```
npm install flatiron-passport
```

Example:  From the example folder...
------------------------
```javascript
var fs =            require('fs')
var flatiron =      require('flatiron');
var LocalStrategy = require('passport-local').Strategy
var fipassport =    require('flatiron-passport');
var app =           flatiron.app;

// You would not usually have these lines...
// This is just to store the username in memory.
var global_user = '';
var global_pass = '';

// Use the passport strategy.
fipassport.use(new LocalStrategy(function(username, password, done) {

  // You would not normally have these lines...
  // This is just to store it in memory for use later.
  global_user = username;
  global_pass = password;

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
fipassport.serializeUser(function(user, done) {

  // @todo: Save your user to the database using the ID as a key.
  done(null, user.id);
});

// Load the user and return it to passport.
fipassport.deserializeUser(function(id, done) {

  // @todo:  Load your user here based off of the ID, and call done with
  // that user object.
  done(null, {
    id:id,
    username:global_user,
    password:global_pass
  });
});

// Use http and flatiron-passport.
app.use(flatiron.plugins.http);
app.use(fipassport);

// Get the front page.
app.router.get('/', function() {
  if (this.req.isAuthenticated()) {
    this.res.end('Hello ' + this.req.user.username);
  }
  else {
    fs.readFile('index.html', (function(self) {
      return function(err, data) {
        if(err) {
          self.res.writeHead(404);
          self.res.end();
          return;
        }
        self.res.writeHead(200, {'Content-Type': 'text/html'});
        self.res.end(data);
      };
    })(this));
  }
});

/**
 * Here the API to fipassport.authenticate is the exact same as it would
 * be fore passport.authenticate.  It is just a simple wrapper around that
 * function.
 */
app.router.post('/login', fipassport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

// Start our server at port 3000.
app.start(3000, function(){
  console.log('HTTP Server started on port 3000');
});
```
