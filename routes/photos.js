var express = require('express');
var Photo = require('../models/photo-model');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  //get the token
  get_signed_request('../public/images/paisagem.jpg');

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
  var AWS = require('aws-sdk');

  });

  photo.save(function(err) {
    if(err) throw err;
    res.json({success: true, message: "Photo created."});
  });

});
function upload_file(file, signed_request, url){
    var xhr = new XMLHttpRequest();
    xhr.open("PUT", signed_request);
    xhr.setRequestHeader('x-amz-acl', 'public-read');
    xhr.onload = function() {
        if (xhr.status === 200) {
            document.getElementById("preview").src = url;
            document.getElementById("avatar_url").value = url;
        }
    };
    xhr.onerror = function() {
        alert("Could not upload file.");
    };
    xhr.send(file);
}

function get_signed_request(file){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/sign_s3?file_name="+file.name+"&file_type="+file.type);
    xhr.onreadystatechange = function(){
        if(xhr.readyState === 4){
            if(xhr.status === 200){
                var response = JSON.parse(xhr.responseText);
                upload_file(file, response.signed_request, response.url);
            }
            else{
                alert("Could not get signed URL.");
            }
        }
    };
    xhr.send();
}

module.exports = router;
