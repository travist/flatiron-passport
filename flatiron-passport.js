var passport = require('passport');
var connect = require('connect');

/**
 * Flatiron Passport integration.
 *
 * Read README.md for documentation on how to use.
 */
exports.name = 'flatiron-passport';
exports.attach = function(options) {
  var app = this;

  // Allow them to set a secret.
  options.secret = options.secret || 'keyboard cat';

  // Add session support.
  app.http.before.push(connect.cookieParser(options.secret));
  app.http.before.push(connect.session());

  // Initialize passport.
  app.http.before.push(function(req, res) {
    passport.initialize(options)(req, res, function() {

      // Copy over the authentication methods.
      req.isAuthenticated = res.req.isAuthenticated;
      req.isUnauthenticated = res.req.isUnauthenticated;
      req.login = req.logIn = res.req.login;
      req.logout = req.logOut = res.req.logout;
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