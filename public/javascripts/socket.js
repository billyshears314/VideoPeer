//var username = <%- username %>
 
$(function(){

	
	$('#sendMessage').click(function(){
	 	  sendMessage();
	});
	
	$("input").keyup(function(e) {
	e.preventDefault();
	
		if(e.keyCode == 13) {
			sendMessage();
  		}
	});
	
	function sendMessage(){
		var message = {content: $('#chatfield').val()};		 	  
	  	  c.send(message);
 		  $('#chatbox').append(message.username +': ' + message.content + '\n');
  		  $('#chatfield').val('');
	}
	
});