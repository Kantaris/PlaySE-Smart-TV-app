var timeout;
var oldKeyHandle;
var isSwedish=true;
var ConnectionError =
{
   
};

ConnectionError.init = function()
{
	 var html = '<div class="error-content">';
	 html += '<ul>';
	 html += '<li class="btext"><a href="#">Connection error, can\'t connect to svtplay.se.</a></li>';
	 html += '<li id="breturn" class="selected"><a href="#">Retry</a></li>';
	 html += '</ul>';
	 html += '</div>';
	 $(".slider-error").html(html);


    return true;
};



ConnectionError.show = function()
{
	
	if(Buttons.getKeyHandleID() != 9){
		oldKeyHandle = Buttons.getKeyHandleID();
		Buttons.setKeyHandleID(9);
	}
	else{
		Buttons.setKeyHandleID(oldKeyHandle);
	}
	$(".slider-error").slideToggle(500, function() {});	

};





