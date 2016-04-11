var mongoose = require('mongoose');

var CommentSchema = mongoose.Schema({
  author: {type: mongoose.Schema.ObjectId, ref: 'User'},
  comment: String,
  createdAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Comment', CommentSchema);
