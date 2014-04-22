var tvKey = new Common.API.TVKeyValue();
var input = null;

var timeout;
var oldKeyHandle = 0;
var Search =
{
   
};

function Input(/**Object*/id)
{
    alert("Input called:" + id);
    // var parent = null;
    var imeReady = function()
    {
        installFocusKeyCallbacks();
        installStatusCallbacks();
        // document.getElementById(id).focus()
        Search.imeReady();
    };
    var self = this;   
    var ime = new IMEShell(id, imeReady, 'sv');
    var element = document.getElementById( id );
    var installFocusKeyCallbacks = function() 
    {
        ime.setKeyFunc(tvKey.KEY_RETURN, onReturn);
        ime.setKeyFunc(tvKey.KEY_EXIT, onReturn);
        ime.setKeyFunc(tvKey.KEY_BLUE, onReturn);
        ime.setKeyFunc(tvKey.KEY_ENTER, onEnter); //do
    };
    
    var installStatusCallbacks = function()
    {
        // ime.setKeySetFunc('12key'); 
        ime.setKeypadPos(350, 155);
        // ime.setKeypadPos(350, 169);
        // ime.setQWERTYPos(215, 169);
    };
    
    var onEnter = function(string)
    {
	window.location = 'SearchList.html?sok=' + $('#write').val();
	return true;
    };

    var onReturn = function() {
        Search.imeShow();
	return true;
    };
}

Search.init = function()
{
    return true;
};

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

};

Search.imeShow = function()
{
    alert("Search.imeShow called");
    $(".imefilter-content").slideToggle(500, function() {});
    if(Buttons.getKeyHandleID()!=7){
        oldKeyHandle = Buttons.getKeyHandleID();
        Buttons.setKeyHandleID(7);
        // pluginAPI.registIMEKey()
        if(input == null)
        {
            // document.getElementById("write").focus();
            try {
                input = new Input("write");
            }
            catch(err) {
                Search.imeShow();
            }
        }
        else {
            Search.imeReady();
        }
    }
    else{
        document.getElementById("write").blur()
	document.body.focus();
        Buttons.setKeyHandleID(oldKeyHandle); 
	Buttons.enableKeys();
    }
};

Search.imeReady = function()
{
    document.getElementById("write").focus();
};
