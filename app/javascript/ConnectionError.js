var timeout;
var oldKeyHandle;
var isSwedish=true;
var ConnectionError =
{
   
};

ConnectionError.init = function()
{

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





