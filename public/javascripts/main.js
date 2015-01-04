

	$(function(){
	
		var usersFound = [
    		"ActionScript",
   	];
   	 
   	$( "#friendName" ).autocomplete({
    		source: usersFound
   	});	
	
		setInterval(function(){ 		
				
			$.ajax({
				url: 'http://localhost:3000/home/updateFriendsData?username='+username,
				type: 'GET',
				contentType: 'application/json',
				success: function(data) {
					console.log("Success");
					var data2 = JSON.parse(data);
			
					$('#friendsListArea').html('<ul>');
					for(var i=0; i<data2.length; i++){
						$('#friendsListArea').append('<li>' + data2[i].username + ': ' + data2[i].status);	
						if(data2[i].status===true){
							$('#friendsListArea').append('<button id="connectUserButton" class="connect btn btn-success" type="button" value="'+data2[i].peerid+'">Connect</button>');
						}
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
			})			
			
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
		
						//$('#friendToAddList').html('<ul>');				 	
					 	usersFound = [];
					 	for(var i=0; i<data.length; i++){
					 		console.log(data[i].id);
					 		/*
							$('#friendToAddList').append('<li>'+data[i].username+'<button id="'+'addFriendButton'+data[i].id+'" class="addFriend btn btn-primary">Add</button>'+'</li>');
							*/							
							usersFound.push(data[i].username);	 	
					 	}
					 		//Refresh autocomplete
					 	    $( "#friendName" ).autocomplete({
   						   source: usersFound
   						 });	
					 	
					 //	$('#friendToAddList').append('</ul>');


					}		          
		          
		      });
	      
	      }    		
    		
  		});
  		
  							 	
	 	$('#addFriendBtn').click(function(){

			console.log($('#friendName').val());

			var buttonID = $(this).attr('id');

			buttonID = parseInt(buttonID.substring(15, buttonID.length));						
			
			$.ajax({
				url: 'http://localhost:3000/home/addFriend',	
				type: 'POST',
				data: JSON.stringify({friendName: $('#friendName').val(), user: username}),
			   contentType: 'application/json',				
	 			success: function(data) {
	 				console.log("success");
	 				console.log(JSON.stringify(data));
  		
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