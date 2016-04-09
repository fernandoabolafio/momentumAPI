var express = require('express');
var router = express.Router();

var User = require('../models/user-model');

var jwt = require('jsonwebtoken');

var https = require('https');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/authenticate', function(req, res, next) {
  //Pegar o token
  var fbToken = req.query.token;

  //Pegar o fbId do token.
  var fbUrl = 'graph.facebook.com'

  var options = {
    hostname: fbUrl,
    port: 443,
    path: '/me?access_token='+fbToken,
    method: 'GET'
  };
 console.log("REQUESTING FB TOKEN");
  var fbReq = https.request(options, function(fbRes) {

    //console.log("FB respondeu");

    fbRes.on('data', function(data) {
      var jsonObject = JSON.parse(data);

      //console.log(jsonObject);

      User.findOne({
        fbId: jsonObject.id
      }, function (err, user) {
        if (err) throw err;

        if(!user) {
          console.log('New User');

          user = new User({
            fbId: jsonObject.id,
          });
        }

        user.fbToken = fbToken;
        user.save(function(err) {
          if(err) throw err;

          console.log('Deu bom!');

          //TODO: return jwt token.
          console.log("CREATING TOKEN");

          var token = jwt.sign(String(user._id), "ronaldo", {} );
          console.log(token);
          res.json({
            success: true,
            message: "Enjoy your token!",
            token: token });
        });

      });

    });

  });

  fbReq.end();

  fbReq.on('error', function(err) {
    console.log(err);
  });

});
// verify token
router.use(function(req,rest,next){
  var token = req.query.token;
  console.log("verify token: "+token);

  if (token){
    jwt.verify(token, "ronaldo", function(err, decoded){
      if (err) {
        return res.json({ success: false, message: "Failed to authenticate Token"})
      }else {
        User.findById(decoded, function(err, user) {
          if(err) throw err;

          if(!user) {
            return res.json({ success: false, message: "Failed to authenticate Token"})
          } else {
            req.user = user;
            next();
          }
        });
      }
    });
  }else {
    return res.status(403).send({
      success: false,
      message: "No token provided"
    });
  }
});

module.exports = router;
