var mongoose = require('mongoose');
var crypto = require('crypto');

var linksSchema = mongoose.Schema({
  url: String,
  base_url: String,
  code: String,
  title: String,
  visits: Number
});

linksSchema.methods.shortenLink =  function(url){
      var shasum = crypto.createHash('sha1');
      shasum.update(url);
      this.code = shasum.digest('hex').slice(0, 5);
}

exports.Links = mongoose.model('Links', linksSchema);
