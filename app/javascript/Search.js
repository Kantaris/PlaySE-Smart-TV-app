var timeout;
var oldKeyHandle
var Search =
{
   
}

Search.init = function()
{

    return true;
}

Search.show = function()
{
	
	if(Buttons.getKeyHandleID()!=4){
		oldKeyHandle = Buttons.getKeyHandleID();
		Buttons.setKeyHandleID(4);
	}
	else{
		Buttons.setKeyHandleID(oldKeyHandle);
	}
	$(".filter-content").slideToggle(500, function() {});	

}


