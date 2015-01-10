

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
					url: 'http://'+hostSite+'/home/getUsersMatchingString',	
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
				url: 'http://'+hostSite+'/home/addFriend',	
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
		url: 'http://'+hostSite+'/home/updateLastOnline',	
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
		url: 'http://'+hostSite+'/home/updateFriendsData?username='+username,
		type: 'GET',
		contentType: 'application/json',
		success: function(data) {
			console.log("Success");
			console.log(JSON.stringify(data.result));
			
			if(data.message==="not_empty"){				
			
			var data2 = data.result;
	
			$('#friendsListArea').html('<ul id="friendsList">');


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
				
				$('#friendsListArea').append('<li class="friendItem"><div class="onlineCircle"></div> <img src="images/placeholder_person.jpg" width="45" height="45" style="border-style:solid;border-width:1px;margin:5px"></img>' + data2[i].username + ': ' + status);	
				
				//$('.friendItem:last').append('<img src="images/placeholder_person.jpg" width="45" height="45"></img>')				
							
				
				if(status==="online"){
					$('.friendItem:last').append('<button id="connectUserButton" class="connect btn btn-default" style="padding:3px 5px 1px 7px" type="button" value="'+data2[i].peerid+'"><span class="glyphicon glyphicon-facetime-video" aria-hidden="true"></span></button>');		
				}
				else{
					$('.friendItem:last > .onlineCircle').css('background-color', '#ff0000');	
				}
					$('.friendItem:last').append('<button id="unfriendButton" class="unfriend btn btn-default" style="padding:3px 4px 1px 4px" type="button" value="'+data2[i].username+'"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></button>');
				
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
						url: 'http://'+hostSite+'/home/unfriend',	
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