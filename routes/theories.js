var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({ dest: './public/images' })
var mongo = require('mongodb');
var db = require('monk')('mongodb://bacnl:123456@ds161121.mlab.com:61121/autopost');

// router.get('/show/:id', function(req, res, next) {
// 	var posts = db.get('posts');

// 	posts.findById(req.params.id,function(err, post){
// 		res.render('show',{
//   			'post': post
//   		});
// 	});
// });

router.get('/add', function(req, res, next) {
	var units = db.get('units');

	units.find({},{},function(err, units){		
		res.render('addtheory',{
  			'title': 'Add Theory',
  			'units': units
  		});
	});
});

router.post('/add', function(req, res, next) {
  // Get Form Values
  console.log(req);
  var title = req.body.title;
  var unit = req.body.unitid;
  var body = req.body.body;
  var date = new Date();

    	// Form Validation
	req.checkBody('title','Title field is required').notEmpty();
	req.checkBody('body', 'Body field is required').notEmpty();

	// Check Errors
	var errors = req.validationErrors();

	if(errors){
		res.render('addtheory',{
			"errors": errors
		});
	} else {
		var posts = db.get('theories');
		posts.insert({
			"title": title,
			"body": body,
			"unit": unit,
			"date": date,
		}, function(err, post){
			if(err){
				res.send(err);
			} else {
				req.flash('success','Theory Added');
				res.location('/');
				res.redirect('/');
			}
		});
	}
});


router.post('/addcomment', function(req, res, next) {
  // Get Form Values
  var name = req.body.name;
  var email= req.body.email;
  var body = req.body.body;
  var postid= req.body.postid;
  var commentdate = new Date();

  	// Form Validation
	req.checkBody('name','Name field is required').notEmpty();
	req.checkBody('email','Email field is required but never displayed').notEmpty();
	req.checkBody('email','Email is not formatted properly').isEmail();
	req.checkBody('body', 'Body field is required').notEmpty();

	// Check Errors
	var errors = req.validationErrors();

	if(errors){
		var posts = db.get('posts');
		posts.findById(postid, function(err, post){
			res.render('show',{
				"errors": errors,
				"post": post
			});
		});
	} else {
		var comment = {
			"name": name,
			"email": email,
			"body": body,
			"commentdate": commentdate
		}

		var posts = db.get('posts');

		posts.update({
			"_id": postid
		},{
			$push:{
				"comments": comment
			}
		}, function(err, doc){
			if(err){
				throw err;
			} else {
				req.flash('success', 'Comment Added');
				res.location('/posts/show/'+postid);
				res.redirect('/posts/show/'+postid);
			}
		});
	}
});

module.exports = router;