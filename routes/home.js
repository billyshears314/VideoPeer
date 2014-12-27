var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var pg = require("pg");
//var conString = "postgres://billy@localhost:5432/webrtc";
//var conString = "postgres://jnjmeffshrcdjo:3I1Qo_G1yv2xvCZVmcEGjX11BJ@ec2-54-83-27-26.compute-1.amazonaws.com:5432/d4p7o0qg9a33ft";

//var client = new pg.Client(conString);

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
		
	console.log("LOG: " + JSON.stringify(result.rows[0]));
	
	//var statement2 = "SELECT id, username, peerId, online FROM users WHERE id = ANY(SELECT friends FROM users WHERE username = ($1))";
	var statement2 = "SELECT id, username, peerid, status FROM users WHERE id = ANY(Array[3])";	
	
	if(result.rows[0]){
		console.log("TEST");
		var friends = result.rows[0].friends;
		console.log(friends);			
	}	
	else{
		var friends = [];
	}
	
	var params2 = [
	//	friends
	];		
	
	var friendsList = result.rows;
	
		client.query(statement2, function afterQuery(err, result){
	
			console.log("LOG 2: " + JSON.stringify(result.rows));			
			
			if(req.session.user){
				res.render('home', {title: 'Express', username: req.session.user, data: friendsList, onlineList: result.rows});
			}
			else{
				res.redirect('/');
			}	
			
		});
		
	});  	

});

router.post('/addFriend', function(req, res){

	console.log("Friend: " + req.body.id);
	console.log("User: " + req.session.user);

 	var statement = 'UPDATE users SET friends = array_append(friends, ($1)) WHERE username = ($2)';
	var params = [
 		req.body.id,
 		req.session.user
  	];
 		 
 	client.query(statement,params,function afterQuery(err,result){
 		console.log('Friend Added')
 		res.redirect('/home');
 	});
	
});

router.post('/setPeerId', function(req, res){

	var statement = 'UPDATE users SET peerId = ($1) WHERE username = ($2)';
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

router.get('/logout', function(req, res){
	req.session.destroy();
	res.redirect('/');
});

module.exports = router;
