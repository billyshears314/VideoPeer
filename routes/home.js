var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var pg = require("pg");

var client = new pg.Client({
    user: "jnjmeffshrcdjo",
    password: "3I1Qo_G1yv2xvCZVmcEGjX11BJ",
    database: "d4p7o0qg9a33ft",
    port: 5432,
    host: "ec2-54-83-27-26.compute-1.amazonaws.com",
    ssl: true
}); 

client.connect();

router.get('/', function(req, res){

	console.log("You are: " + req.session.user);	
	
	var statement = "SELECT friends FROM users WHERE username = ($1)";
	var params = [
  		req.session.user
  	];

	client.query(statement,params,function afterQuery(err,result){
	
	friends = JSON.stringify(result.rows[0].friends);

	var params2 = [
		friends
	];		
	
	//var statement2 = "SELECT id, username, peerId, online FROM users WHERE id = ANY(SELECT friends FROM users WHERE username = ($1))";
	var statement2 = "SELECT id, username, peerid, lastOnline FROM users WHERE id = Any(Array"+friends+")";	
	
	var friendsList = result.rows;
	
		client.query(statement2, function afterQuery(err, result){
	
			if(result){
				console.log("TRUE");	
				if(req.session.user){
				res.render('home', {title: 'Express', username: req.session.user, data: friendsList, onlineList: result.rows});
				}
				else{
					res.redirect('/');
				}	
			}else{
				if(req.session.user){
					res.render('home', {title: 'Express', username: req.session.user, data: friendsList, onlineList: []});
				}
				else{
					res.redirect('/');
				}	
			}
			
		});
		
	});  	

});

router.get('/updateFriendsData/:username?', function(req, res){
	
	console.log("..........");
	
	var statement = 'SELECT friends FROM users WHERE username = ($1)';
	
	var params = [
		req.param('username')	
	]
	
	client.query(statement,params,function afterQuery(err,result){
		
		friends = JSON.stringify(result.rows[0].friends);

		var params2 = [
			friends
		];	
		
		var statement2 = "SELECT id, username, peerid, lastOnline FROM users WHERE id = Any(Array"+friends+")";	
	
		var friendsList = result.rows;
		
		client.query(statement2, function afterQuery(err, result){
	
			if(result){
				res.send({message: "not_empty", result: result.rows});
			}else{
				res.send({message: "empty"});
			}
			
		});
		
	});
	
	
});

router.post('/addFriend', function(req, res){

	console.log("Friend: " + req.body.friendName);
	console.log("User: " + req.body.user);
	
	var statement = 'SELECT id FROM users where username = ($1)';
	
	var params = [
		req.body.friendName	
	]
	
	client.query(statement, params, function  afterQuery(err, result){

	 	var statement2 = 'UPDATE users SET friends = array_append(friends, ($1)) WHERE username = ($2)';
		var params2 = [
	 		result.rows[0].id,
	 		req.body.user
	  	];
	 		 
	 	client.query(statement2,params2,function afterQuery(err,result){
	 		console.log('Friend Added')
	 	});
 	
	});
	
});

router.post('/setPeerId', function(req, res){

	var statement = 'UPDATE users SET peerid = ($1) WHERE username = ($2)';
	var params = [
 		req.body.peerId,
 		req.session.user
  	];
 		 
 	client.query(statement,params,function afterQuery(err,result){
 		console.log('Updated Peer Id');
 		console.log(req.body.peerId);
 		res.write('successfully updated peer Id');
 		//res.redirect('/home');
 	});
	
});

router.post('/getUsersMatchingString', function(req, res){
	
	var startOfUsername = req.body.friendName+'%';	
	
	var statement = "SELECT id, username from users WHERE username LIKE ($1) AND username != ($2)";
	
	var params = [
		startOfUsername,
		req.body.myUsername
	]; 	
	
	client.query(statement, params, function afterQuery(err, result){
		console.log("Got Users Matching String");		
		console.log(JSON.stringify(result.rows));
		res.send(result.rows);
	});
	
});

router.post('/unfriend', function(req, res){

	console.log("Friend: " + req.body.friendName);
	console.log("User: " + req.body.user);
	
	var statement = 'SELECT id FROM users where username = ($1)';
	
	var params = [
		req.body.friendName	
	]
	
	client.query(statement, params, function  afterQuery(err, result){

	 	var statement2 = 'UPDATE users SET friends = array_remove(friends, ($1)) WHERE username = ($2)';
		var params2 = [
	 		result.rows[0].id,
	 		req.body.user
	  	];
	 		 
	 	client.query(statement2,params2,function afterQuery(err,result){
	 		console.log('Friend Removed');
	 	});
 	
	});


});

router.post('/updateLastOnline', function(req, res){
	
	console.log("UPDATE");

	var statement = 'UPDATE users SET lastOnline = now() WHERE username = ($1)';
	var params = [
		req.session.user
	]

	client.query(statement, params, function afterQuery(err, result){
		
		console.log(req.session.user + " still online");		
		
	});

});


router.get('/deleteAccount', function(req, res){
	
	var statement = 'Delete from users where username=($1)';
	var params = [
		req.session.user
	]	
	
	client.query(statement, params, function afterQuery(err, result){
		console.log('User Deleted');
		res.redirect('/');	
	});

});

router.get('/logout', function(req, res){
	req.session.destroy();
	res.redirect('/');
});

module.exports = router;
