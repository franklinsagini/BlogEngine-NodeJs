var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var db = require('monk')('localhost/nodeblog');

//Homepage blog posts
router.get('/', function(req, res, next) {
  var db = req.db;
  var posts = db.get('posts');
  posts.find({},{},function(err,posts){
  	if (err){
  		console.log(err);
  	}
  	res.render('index',
  		{
  			"posts":posts
  		});
  });
});


module.exports = router;