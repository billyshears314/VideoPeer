var myPeerId;
var mystream;

$(document).ready(function() {

	peer = new Peer({ key: 'lwjd5qra8257b9'});

	peer.on('open', function(id){
		myPeerId = id;
		setPeerIdToDatabase(myPeerId);
		console.log("My ID: " + myPeerId);
	});

    // Wait for a connection from the second peer.
	peer.on('connection', function(connection) {
		console.log("CONNECTION");
		c = connection;
      connection.on('open', function() {
     
        // Send 'Hello' on the connection.
       // connection.send('I guess I\'ll connect with you.');
       	connection.send('connection opened');
      });
      
      // The `data` event is fired when data is received on the connection.
      connection.on('data', function(data) {
      	console.log('data received');
         $('#chatbox').append(data.name + ': ' + data.content + '\n');
      });
   });
   
	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

	navigator.getUserMedia({video: true, audio: true}, function(stream) {
	mystream = stream;
	$('#my-video').prop('src', URL.createObjectURL(mystream));
	}, function(err) {
	  console.log('Failed to get local stream' ,err);
	});
	
	peer.on('call', function(call) {
		console.log('called');
	  navigator.getUserMedia({video: true, audio: true}, function(stream) {
	  console.log('answer');
	 call.answer(stream); // Answer the call with an A/V stream.
	 call.on('stream', function(remoteStream) {
	     $('#their-video').prop('src', URL.createObjectURL(remoteStream));
	 });
	  }, function(err) {
	 console.log('Failed to get local stream' ,err);
	  });
	});
	
     function setPeerIdToDatabase(peerId){

      console.log('search clicked');
      
		$.ajax({
			//url: 'http://videopeer.herokuapp.com/home/setPeerId',	
			url: 'http://localhost:3000/home/setPeerId',
			type: 'POST',
			data: JSON.stringify({peerId: peerId}),
	       contentType: 'application/json',				
	       success: function(data) {
				 console.log("success");
	          }
	      });
	
	  };	

});



 