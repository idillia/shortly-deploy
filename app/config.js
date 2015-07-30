var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  // yay!
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

// userSchema.methods.comparePassword = function(attemptedPassword, callback) {
//   bcrypt.compare(attemptedPassword, this.password, function(err, isMatch) {
//     callback(isMatch);
// });
// }

// userSchema.methods.hashPassword = function(){
//     var cipher = Promise.promisify(bcrypt.hash);
//     return cipher(this.password), null, null).bind(this)
//       .then(function(hash) {
//         this.password = hash;
//       });
//   }
exports.User = mongoose.model('User', userSchema);

// linksSchema.methods.shortenLink = function(model, attrs, options){
//       var shasum = crypto.createHash('sha1');
//       shasum.update(this.url);
//       this.code = shasum.digest('hex').slice(0, 5));
// }

exports.Links = mongoose.model('Links', linksSchema);







