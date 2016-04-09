var mongoose = require('mongoose');

var CommentSchema = mongoose.Schema({
  author: {type: mongoose.Schema.ObjectId, ref: 'User'},
  comment: String,
  createdAt: {type: Date, default: Date.now}
});

var PhotoSchema = mongoose.Schema({
  url: String,
  author: {type: mongoose.Schema.ObjectId, ref: 'User'},
  comments: [CommentSchema],
  createdAt: {type: Date, default: Date.now}
});

var AlbumSchema =  mongoose.Schema({
    name: String,
    author: {type: mongoose.Schema.ObjectId, ref: 'User'},
    collaborators: [{type: mongoose.Schema.ObjectId, ref: 'User'}],
    description: String,
    photos: [PhotoSchema],
    createdAt: {type: Date, default: Date.now}


});

module.exports = mongoose.model('Album', AlbumSchema);
