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

  var httpsReq = https.request(options, function(res) {
    
    res.on('data', function(data) {
      var jsonObject = JSON.parse(data);
      
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
        });

      });

    });

  });

  httpsReq.end();

  httpsReq.on('error', function(err) {
    console.log(err);
  });

});

module.exports = router;
