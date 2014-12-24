var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var pg = require("pg");
//var conString = "postgres://billy@localhost:5432/webrtc";
var conString = "postgres://jnjmeffshrcdjo:3I1Qo_G1yv2xvCZVmcEGjX11BJ@ec2-54-83-27-26.compute-1.amazonaws.com:5432/d4p7o0qg9a33ft";

var client = new pg.Client(conString);				
				
client.connect();

//client.query("DROP TABLE IF EXISTS users");

//client.query("CREATE TABLE IF NOT EXISTS users(id SERIAL UNIQUE, firstname varchar(64), lastname varchar(64))");
//client.query("INSERT INTO users(firstname, lastname) values($1, $2)", ['Ronald', 'McDonald']);
//client.query("INSERT INTO users(firstname, lastname) values($1, $2)", ['Mayor', 'McCheese']);
//client.query("INSERT INTO users(firstname, lastname) values($1, $2)", ['John', 'Smith']);

router.get('/', function(req, res){

	var query = client.query("SELECT id, username FROM users ORDER BY username");

	query.on("row", function (row, result) {
    	result.addRow(row);
	});	

	query.on("end", function (result) {
		res.render('index', {title: 'Express', data: result.rows});	
	});  
  
});

router.post('/addUser', function(req, res) {
	console.log('form posted');
	console.log(req.body.username);
	
	req.session.user = req.body.username;	
	
	var peerId = "";
	var arr = [];
	var status = true;

 	var statement = 'INSERT INTO users VALUES (default, $1, $2, $3, $4, $5)';
	var params = [
  		req.body.username,
   	req.body.password,
		peerId,   	
   	arr,
   	status
  	];
 		 
 	client.query(statement,params,function afterQuery(err,result){
 		console.log('User Added')
 		res.redirect('/home');
 	});
 		 
});   

router.post('/login', function(req, res){
	
	var statement = 'SELECT * FROM users WHERE username=($1) AND password=($2)';
	var params = [
  		req.body.username,
   	req.body.password,
  	];
 		 
 	client.query(statement,params,function afterQuery(err,result){
 		console.log(req.session.user + ' logged in');
 		if(result.rows.length==1){
 			req.session.user = req.body.username;
			res.redirect('/home'); 				
 		}
 		else{
 			res.redirect('/');	
 		}

 	});
	
});

router.get('/deleteUser/:id?', function(req, res){
	console.log('delete user');
	console.log(req.query.id);
	
	var statement = 'Delete from users where id=($1)';
	var params = [
		req.query.id
	]	
	
	client.query(statement, params, function afterQuery(err, result){
		console.log('User Deleted');
		res.redirect('/');	
	});

});

module.exports = router;
