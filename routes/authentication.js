var express = require('express');
var authRouter = express.Router();
var jwt = require('jsonwebtoken');

module.exports = authRouter;

// process token included in the post body
authRouter.post('/', function(req, res, next){
	if(req.body.key){
		// store db instance
		var keys = req.keys_db;
		var inputKey = req.body.key;
		// valid the key
		keys.find({key: inputKey}, function(err, data){
			if(data.length){
				jwt.sign(data[0].key, req.app.get('secret'), function(err, token){
					if(err) res.status(500).send('Token can not be generated');
					if(token){
						res.status(200).send(token);
					}
				});
			}else{
				res.status(400).send('Password is incorrect');
			}
		});
	}else{
		res.status(400).send('Key can not be empty');
	}
});