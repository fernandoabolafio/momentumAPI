var mongoose = require('mongoose');


var AlbumSchema =  mongoose.Schema({
    name: String,
    author: {type: mongoose.Schema.ObjectId, ref: 'User'},
    collaborators: [{type: mongoose.Schema.ObjectId, ref: 'User'}],
    description: String,
    photos: [{type: mongoose.Schema.ObjectId, ref: 'Photo'}],
    createdAt: {type: Date, default: Date.now}


});

module.exports = mongoose.model('Album', AlbumSchema);
