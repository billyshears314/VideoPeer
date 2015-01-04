	$(function(){
		
		$('#gray_filter').click(function(){
			
			$('video').css('filter', 'grayscale(100%)');		
			$('video').css('-moz-filter', 'grayscale(100%)');
			$('video').css('-webkit-filter', 'grayscale(100%)');		
			
		});		
		
		$('#sepia_filter').click(function(){
			
			$('video').css('filter', 'sepia(100%)');		
			$('video').css('-moz-filter', 'sepia(100%)');
			$('video').css('-webkit-filter', 'sepia(100%)');		
			
		});
		
		$('#saturate_filter').click(function(){
			
			$('video').css('filter', 'saturate(100%)');		
			$('video').css('-moz-filter', 'saturate(100%)');
			$('video').css('-webkit-filter', 'saturate(100%)');		
			
		});
		
		$('#brightness_filter').click(function(){
			
			$('video').css('filter', 'brightness(0.5)');		
			$('video').css('-moz-filter', 'brightness(0.5)');
			$('video').css('-webkit-filter', 'brightness(0.5)');		
			
		});
		
		$('#contrast_filter').click(function(){
			console.log("CONTRAST");
			
			$('video').css('filter', 'contrast(0%)');		
			$('video').css('-moz-filter', 'contrast(0%)');
			$('video').css('-webkit-filter', 'contrast(0%)');		
			
		});

		$('#hue-rotate_filter').click(function(){
			
			$('video').css('filter', 'hue-rotate(90deg)');		
			$('video').css('-moz-filter', 'hue-rotate(90deg)');
			$('video').css('-webkit-filter', 'hue-rotate(90deg)');		
			
		});
		
		$('#blur_filter').click(function(){
			
			$('video').css('filter', 'blur(10px)');		
			$('video').css('-moz-filter', 'blur(10px)');
			$('video').css('-webkit-filter', 'blur(10px)');		
			
		});
		
	});