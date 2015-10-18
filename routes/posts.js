var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var db = require('monk')('localhost/nodeblog');

router.get('/show/:id',function(req,res,next){
	var db = req.db;
	var id = req.params.id;
	var posts = db.get('posts');
	posts.findById(id,function(err,post){
		if (err){
			console.log(err.message);
		}
		res.render('show',{
			"post":post
		});
		
	});
}); 

router.get('/add',function(req,res,next){
	//var db = req.db;
	var categories = db.get('categories');
	categories.find({},{},function(err,categories){
		if (err){
			console.log(err.message);
		}
		res.render('addpost',{
			"title":"Add Post",
			"categories":categories
		});
	});

});

router.post('/add',function(req,res,next){
	//Get the form values
	var title      = req.body.title;
	var category   = req.body.category;
	var body       = req.body.body;
	var author     = req.body.author;
	var date       = new Date();

	if(req.files.mainimage){
		var mainImageOriginalName = req.files.mainimage.originalname;
		var mainImageName         = req.files.mainimage.name;
		var mainImageMime         = req.files.mainimage.mimetype;
		var mainImagePath         = req.files.mainimage.path;
		var mainImageExt          = req.files.mainimage.extension;
		var mainImageSize         = req.files.mainimage.size;


	} else {
		var mainImageName = 'noimage.png';
	}

	//Form Validation
	req.checkBody('title','Title field is required').notEmpty();
	req.checkBody('body','Body field is required').notEmpty();
	
	//check errors
	var errors = req.validationErrors();

	if (errors){
		res.render('addpost',{
			//"errors":errors,
			"body":body,
			"categories": "['Fashion','Sports','Technology']"
		});
		req.flash('error','Fill everything please');
	} else {
		var posts = db.get('posts');
		//submit to db
		posts.insert({
			"title":title,
			"body":body,
			"category":category,
			"date":date,
			"author":author,
			"mainimage":mainImageName
		},function(err,post){
			if (err){
				res.send('There was on issue submitted the post');
			} else {
				req.flash('success','Post submitted');
				res.location('/');
				res.redirect('/');
			}
		});
	}
});

router.post('/addcomment',function(req,res,next){
	//Get the form values
	var name       = req.body.name;
	var email      = req.body.email;
	var body       = req.body.body;
	var postid     = req.body.postid;
	var commentdate       = new Date();

	//Form Validation
	req.checkBody('name','Name field is required').notEmpty();
	req.checkBody('email','Email field is required').notEmpty();
	req.checkBody('email','Email field is not formatted correctly').isEmail();
	req.checkBody('body','Body field is required').notEmpty();


	//check errors
	var errors = req.validationErrors();

	if (errors){
		var posts = db.get('posts');
		posts.findById(postid,function(err,post){
				res.render('show',{
				"errors":errors,
				"post":post
			});
		});

		req.flash('error','Fill everything please');
	} else {
		var comment = {"name":name,"email":email,"body":body,"commentdate":commentdate};		
		var posts = db.get('posts');
		posts.update(
			{
				"_id":postid
			},
			{
				$push:{"comments":comment}
			},function(err,doc){
				if (err){
					throw err;
				} else {
					req.flash('success','comment succesfully added');
					res.location('/posts/show/'+postid);
					res.redirect('/posts/show/'+postid);
				}
			});

	}
});

module.exports = router;
