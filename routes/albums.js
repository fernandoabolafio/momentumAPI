var express = require('express');
var Album = require('../models/album-model');

var router = express.Router();


/* GET users listing. */
router.get('/', function(req, res, next) {
  //get the token
  var userId = req.user._id;
  Album.find({
    author: userId
  }).populate("author")
  .exec(function(err,albums){
    if (err) throw err;
    res.json(albums);
  });

});

router.post('/', function(req, res, next) {

  var userId = req.user._id;
  console.log("album userid: "+userId);

  var album = new Album({
    name: req.body.name,
    author: userId,
    description: req.body.description,
    collaborators: req.body.collaborators
  });

  album.save(function(err) {
    if(err) throw err;
    res.json({success: true, message: "Album created."});
  });

});

module.exports = router;
