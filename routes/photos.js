var express = require('express');
var Photo = require('../models/photo-model');
var router = express.Router();
var Upload = require('s3-uploader');
var fs = require('fs');
var AWS = require('aws-sdk');
var shortid = require('shortid');

var s3bucket = new AWS.S3({ params: {Bucket: 'xgoal'} });
var bucketname = 'xgoal';

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

  //Initiates S3 Upload process
  //create a stream from some file
  //TODO recive a file input from client
  var fileStream = fs.createReadStream('public/images/paisagem.jpg');
  //generate a unique and random name for the image url
  var name = shortid.generate();

  //set params for s3 uploading
  var params = {
    Key: name,
    Body: fileStream
  };
  //starts the upload
  s3bucket.putObject(params, function(err,data){
    console.log()
    if(err){
      console.log("s3 error message:" + err);
    }else{
      console.log("DDDeu bom o s3!" + data);
      var aws_url = bucketname + 'https://s3.amazonaws.com/'  + '/' + name;
      var photo = new Photo({
        url: aws_url,
        author: userId,
      });
      photo.save(function(err) {
        if(err) throw err;
        res.json({success: true, message: "Photo created."});
      });


    }
  });



});

module.exports = router;
