var passport = require('passport');

/**
 * Flatiron Passport integration.
 *
 * This small snippit of code wraps the flatiron passport functionality so that
 * it is compatible with the flatiron framework.  There are only two things
 * different between using this API and using the regular Passport API.
 *
 *  1.)  Instead of calling...
 *
 *         app.use(passport.initialize());
 *         app.use(passport.session());
 *
 *       You simply need to call...
 *
 *         var fipassport = require('flatiron-passport');
 *         app.use(fipassport);
 *
 *  2.)  Instead of calling...
 *
 *         passport.authenticate
 *
 *       You simply call this instead...
 *
 *         fipassport.authenticate
 *
 * Everything else should be the same....
 *
 * For example:
 *
 * var flatiron =   require('flatiron');
 * var passport =   require('passport');
 * var fipassport = require('flatiron-passport');
 * var LocalStrategy = require('passport-local').Strategy
 *
 * // Use the passport strategy.
 * passport.use(new LocalStrategy(
  function(username, password, done) {
    findByUsername(username, function(err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, {
          message: 'Unkown user ' + username
        });
      }
      if (user.password != password) {
        return done(null, false, {
          message: 'Invalid password'
        });
      }
      return done(null, user);
    })
  }
 *
 * var app = flatiron.app;
 *
 * app.use(flatiron.plugins.http);
 * app.use(fipassport);
 *
 * // Login...
 * app.router.post('/login', fipassport.authenticate('local', {
 *   successRedirect: '/',
 *   failureRedirect: '/login'
 * }));
 *
 */


exports.name = 'flatiron-passport';
exports.attach = function(options) {
  var app = this;

  // Initialize passport.
  app.http.before.push(function(req, res) {
    passport.initialize(options)(req, res, function() {
      res.emit('next');
    });
  });

  // Initialize the session of passport.
  app.http.before.push(function(req, res) {
    passport.session()(req, res, function() {
      res.emit('next');
    });
  });
};

// Wrap the authenticate function.
exports.authenticate = function(name, options, callback) {
  return function() {
    passport.authenticate(name, options, callback)(this.req, this.res, (function(self) {
      return function() {
        self.res.emit('next');
      }
    })(this));
  };
};