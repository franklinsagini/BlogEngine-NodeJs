var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var db = require('monk')('localhost/nodeblog');

router.get('/show/:category',function(req,res,next){
	var db = req.db;
	var posts = db.get('posts');
	var category = req.params.category;
	posts.find({category:category},{},function(err,posts){
		  res.render('index',{
  				"title":req.params.category,
  				"posts":posts
	  });
	});
});

router.get('/add', function(req, res, next) {
  res.render('addcategory',{
  	"title":"Add Category"
  });
});

router.post('/add',function(req,res,next){
	//Get the form values
	var title      = req.body.title;

	//Form Validation
	req.checkBody('title','Title field is required').notEmpty();
	
	//check errors
	var errors = req.validationErrors();

	if (errors){
		res.render('addcategory',{
			"errors":errors,
			"title":title
		});
	} else {
		var posts = db.get('categories');
		//submit to db
		posts.insert({
			"title":title
		},function(err,category){
			if (err){
				res.send('There was on issue submitted the category');
			} else {
				req.flash('success','Category added');
				res.location('/');
				res.redirect('/');
			}
		});
	}
});

module.exports = router;