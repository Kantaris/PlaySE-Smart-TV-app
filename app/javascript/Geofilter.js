var timeout;
var oldKeyHandle;
var isSwedish=true;
var Geofilter =
{
   
};

Geofilter.init = function()
{

    return true;
};



Geofilter.show = function()
{
	
	if(Buttons.getKeyHandleID() != 6){
		oldKeyHandle = Buttons.getKeyHandleID();
		Buttons.setKeyHandleID(8);
	}
	else{
		Buttons.setKeyHandleID(oldKeyHandle);
	}
	$("#playButton").css("display", "none");
	$("#backButton").css("display", "none");
	$(".slider-blocked").slideToggle(500, function() {});	

};





