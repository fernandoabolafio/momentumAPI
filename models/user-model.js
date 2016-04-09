var mongoose = require('mongoose');

var UserSchema =  mongoose.Schema({
    fbId: String,
    fbToken: String,
});

module.exports = mongoose.model('User', UserSchema);