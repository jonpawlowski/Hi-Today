var express = require('express');
var authRouter = express.Router();
var jwt = require('jsonwebtoken');

module.exports = authRouter;

// process token included in the post body
authRouter.post('/', function(req, res, next){

});

// process token included in the request query string
authRouter.get('/', function(req, res, next){
    if(req.query.token){
        res.send(req.query.token);
    }else{
        res.status(400).send('Key is required');
    }
});