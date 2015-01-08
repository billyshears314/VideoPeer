

	$(function(){
	
		var usersFound = [];
   	 
   	$( "#friendName" ).autocomplete({
    		source: usersFound
   	});	
   	
   	updateFriendsList();

		updateOnlineTimestamp();
		
		//myFunction();
	
		setInterval(function(){ 		
				
			updateFriendsList();		
			
		}, 5000);

	
	  $("input").keyup(function(){		
    		
			if($('#friendName').val()===''){
			
				$('#friendToAddList').html('');			
			
			}    		
			else{
			
				$.ajax({
					url: 'http://localhost:3000/home/getUsersMatchingString',	
					type: 'POST',
					data: JSON.stringify({friendName: $('#friendName').val(), myUsername: JSON.stringify(username)}),
		      	 contentType: 'application/json',				
		      	 success: function(data) {
					 	console.log("success");
					 	console.log(JSON.stringify(data));
					 	
					 	usersFound = [];
					 	for(var i=0; i<data.length; i++){
					 		console.log(data[i].id);						
							usersFound.push(data[i].username);	 	
					 	}
					 		//Refresh autocomplete
					 	    $( "#friendName" ).autocomplete({
   						   source: usersFound
   						 });	
					 	
					}		          
		          
		      });
	      
	      }    		
    		
  		});
  		
  							 	
	 	$('#addFriendBtn').click(function(){				
			
			$.ajax({
				url: 'http://localhost:3000/home/addFriend',	
				type: 'POST',
				data: JSON.stringify({friendName: $('#friendName').val(), user: username}),
			   contentType: 'application/json',				
	 			success: function(data) {
	 				console.log("success");
	 				console.log(JSON.stringify(data));
  					updateFriendsList();
  				}
  			});
  							
    	});
  		

		$('.connect').click(function(){
		
			var peeridValue = $(this).attr('val');

		//Connect for video sharing
			var call = peer.call(peeridValue, mystream);		
			
			call.on('stream', function(remoteStream){
			
				$('#their-video').prop('src', URL.createObjectURL(remoteStream));			
			
			});
		
		//Connect for text messaging		
		c = peer.connect(peeridValue);
		
		   c.on('data', function(data) {
		   	console.log('received remote data');
		   	if(data.name){
   				$('#chatbox').append(data.name + ': '+data.content + '\n');
   			}
			});
					
		});
	
	});
	
function updateOnlineTimestamp(){

	$.ajax({
		url: 'http://localhost:3000/home/updateLastOnline',	
		type: 'POST',
   	contentType: 'application/json',				
   	success: function() {
		 	console.log("success");	
		}		          
       
   });

}

var myFunction = function(){
		
	setTimeout(function(){ 		

		console.log("SEND REQUEST");				
			
		updateOnlineTimestamp();		
		
		myFunction();

	}, 15000);

}

	
function updateFriendsList(){
	
		$.ajax({
		url: 'http://localhost:3000/home/updateFriendsData?username='+username,
		type: 'GET',
		contentType: 'application/json',
		success: function(data) {
			console.log("Success");
			console.log(JSON.stringify(data.result));
			
			if(data.message==="not_empty"){				
			
			var data2 = data.result;
	
			$('#friendsListArea').html('<ul>');


			var timeNow = (new Date).getTime()/1000;		
			
			console.log("TIME NOW: " + timeNow);	
			
			for(var i=0; i<data2.length; i++){

				console.log(data2[i].lastonline);

				var userTime = (new Date(data2[i].lastonline)).getTime() / 1000;
				
				var timeDifference = timeNow - userTime;
				
				if(timeDifference<240){
					var status = "online";		
				}
				else{
					var status = "offline";				
				}
	
				$('#friendsListArea').append('<li>' + data2[i].username + ': ' + status + ", " + timeDifference);	
				if(status==="online"){
					$('#friendsListArea').append('<button id="connectUserButton" class="connect btn btn-success" type="button" value="'+data2[i].peerid+'">Connect</button>');
				}
					$('#friendsListArea').append('<button id="unfriendButton" class="unfriend btn btn-success" type="button" value="'+data2[i].username+'">Remove</button>');
				
				$('#friendsListArea').append('</li>');
			}
			$('#friendsListArea').append('</ul>');	
			
				$('.connect').click(function(){
		
					var peeridValue = $(this).attr('value');

					
				//Connect for video sharing
					var call = peer.call(peeridValue, mystream);		
					
					call.on('stream', function(remoteStream){
					
						$('#their-video').prop('src', URL.createObjectURL(remoteStream));			
					
					});

					//Connect for text messaging		
					c = peer.connect(peeridValue);
					
					   c.on('data', function(data) {
					   	console.log('received remote data');
					   	if(data.name){
			   				$('#chatbox').append(data.name + ': '+data.content + '\n');
			   			}
						});
								
				});
				
				
			}
			else{
				console.log("You have no friends.");					
			}
					
				$('.unfriend').click(function(){

					console.log('unfriend clicked');
					
					console.log($(this).val());
					
					$.ajax({
						url: 'http://localhost:3000/home/unfriend',	
						type: 'POST',
						data: JSON.stringify({friendName: $(this).val(), user: username}),
					   contentType: 'application/json',				
			 			success: function(data) {
			 				console.log("success");
			 				console.log(JSON.stringify(data));
		  					updateFriendsList();
		  				}
		  			});	
				
				});
			}			
	});

}