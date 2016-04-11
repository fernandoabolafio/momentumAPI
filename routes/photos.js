var express = require('express');
var Photo = require('../models/photo-model');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  //get the token
  var userId = req.user._id;
  Photo.find({
    author: userId
  }).populate("author")
  .exec(function(err,photos){
    if (err) throw err;
    res.json(photos);
  });

});

router.post('/', function(req, res, next) {

  var userId = req.user._id;
  console.log("photo userid: "+userId);

  var photo = new Photo({
    url: req.body.url,
    author: userId,
  });

  photo.save(function(err) {
    if(err) throw err;
    res.json({success: true, message: "Photo created."});
  });

});

module.exports = router;
