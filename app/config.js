var mongoose = require('mongoose').mongoose;


module.exports.connectdb = function() {
  mongoose.connect('mongodb://localhost:27017/test');
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connction error...'));
  db.once('open', function (callback){
    console.log('shortly db is open');
  });

  var userSchema = mongoose.Schema({
    username: String,
    password: String
  });

  var linksSchema = mongoose.Schema({
    url: String,
    base_url: String,
    code: String,
    title: String,
    visits: Number
  });
}

exports.userSchema = mongoose.Schema({
  username: String,
  password: String
});