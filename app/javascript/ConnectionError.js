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
	
	if(Buttons.getKeyHandleID() != 8){
		oldKeyHandle = Buttons.getKeyHandleID();
		Buttons.setKeyHandleID(8);
	}
	else{
		Buttons.setKeyHandleID(oldKeyHandle);
	}
	$(".slider-error").slideToggle(500, function() {});	

};





