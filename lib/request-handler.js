var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var db = require('../app/config');

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function(){
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  var query = db.Links.find();
  query.exec(function(err, link){
    if (err) {console.log("fail to fetch links")}
    else 
      res.send(200, link);
  })

};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }
  db.Links.findOne({'url': uri}, function(err, link){
    if (link) {
      res.send(200, link);
    } else if (link === null) {
        util.getUrlTitle(uri, function(err, title){
          if (err) {
            console.log('Error reading URL heading: ', err);
            return res.send(404);
          }
          var newLink = new db.Links({url:uri, title: title, base_url: req.headers.origin, visits: 0})
          newLink.shortenLink(uri);

          newLink.save(function(err, link) {
            if (err) console.log("can't save link");
            else {
              res.send(200, link);
           }
          })
        })
      }
  });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  db.User.findOne({'username': username}, 'username password', function(err, user){
    if (user === null) {
      res.redirect('/login');
    } else {
        user.comparePassword(password, function(match){
          if (match) {
            util.createSession(req, res, user);
          } else {
            res.redirect('/login');
          }
        })
      }
  })

};    

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  db.User.findOne({'username': username}, 'username password', function(err, user){
    if (user === null) {
      var newUser = new db.User({username: username, password: password});
      console.log(newUser);
      newUser.hashPassword(function() {
        console.log("we are hashing");
        newUser.save(function(err, user) {
        if (err) console.log("can't save user");
        else {
          console.log('saved')
          req.session.user = user.username;
          res.redirect('/');
        }
      })

      });

    } else 
       res.redirect('/login');
  })
};


exports.navToLink = function(req, res) {

  db.Links.findOne({code: req.params[0]}, function(err, link){
    if (!link) {
      res.redirect('/');
    } else {
      link.visits = link.visits + 1;
      link.save(function(err, link) {
        if (err) throw err;
        return res.redirect(link.url);
      })
    }
  })
};  