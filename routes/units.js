var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('mongodb://bacnl:123456@ds161121.mlab.com:61121/autopost');

router.get('/add', function(req, res, next) {
	res.render('addunit',{
  		'title': 'Add Unit'	
	});
});

router.post('/add', function(req, res, next) {
  // Get Form Values
  var name = req.body.name;
  var label = req.body.label;

  	// Form Validation
	req.checkBody('name','Name field is required').notEmpty();
	req.checkBody('label','Label field is required').notEmpty();
	// Check Errors
	var errors = req.validationErrors();

	if(errors){
		res.render('addunit',{
			"errors": errors
		});
	} else {
		var categories = db.get('units');
		categories.insert({
			"name": name,
			"label": label,
		}, function(err, post){
			if(err){
				res.send(err);
			} else {
				req.flash('success','Unit Added');
				res.location('/');
				res.redirect('/');
			}
		});
	}
});

module.exports = router;