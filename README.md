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


2.)  Instead of calling...

```javascript
passport.authenticate(.....)
```

You simply call this instead...
```javascript
fipassport.authenticate(.....)
```

Everything else should be the same....

Install
------------------------
```
npm install flatiron-passport
```

Example
------------------------
```javascript
var flatiron =      require('flatiron');
var passport =      require('passport');
var LocalStrategy = require('passport-local').Strategy
var fipassport =    require('flatiron-passport');
var app =           flatiron.app;

// Use the passport strategy.
passport.use(new LocalStrategy(
  function(username, password, done) {

    // Use this as you normally would in Passport.js
  }
});

app.use(flatiron.plugins.http);
app.use(fipassport);

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
