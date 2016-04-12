var mongoose = require('mongoose');



var PhotoSchema = mongoose.Schema({
  url: String,
  author: {type: mongoose.Schema.ObjectId, ref: 'User'},
  comments: [{type: mongoose.Schema.ObjectId, ref: 'Comment'}],
  createdAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Photo', PhotoSchema);
