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
	window.location = 'SearchList.html?sok=' + $('#ime_write').val();
	return true;
    };

    var onReturn = function() {
        Search.imeShow();
	return true;
    };
}

Search.init = function()
{
	var html = '<div class="search-content">';
	html += '<div class="input_bg">';
	html += '<input id="write" class="footer_input" type="text" value="Sök programtitlar..." />';
	html += '</div>';
	html += '<ul class="keyboard">';
	html += '<li class="symbol row1 selected">!</li>';
	html += '<li class="symbol row1">1</li>';
	html += '<li class="symbol row1">2</li>';
	html += '<li class="symbol row1">3</li>';
	html += '<li class="symbol row1">4</li>';
	html += '<li class="symbol row1">5</li>';
	html += '<li class="symbol row1">6</li>';
	html += '<li class="symbol row1">7</li>';
	html += '<li class="symbol row1">8</li>';
	html += '<li class="symbol row1">9</li>';
	html += '<li class="symbol row1">0</li>';
	html += '<li class="symbol row1">-</li>';
	html += '<li class="symbol row1">+</li>';
	html += '<li class="delete row1 lastitem" id="delete">Ta Bort</li>';
	html += '</ul>';
	html += '<ul class="keyboard">';
	html += '<li class="tab row2">Tab</li>';
	html += '<li class="letter row2">q</li>';
	html += '<li class="letter row2">w</li>';
	html += '<li class="letter row2">e</li>';
	html += '<li class="letter row2">r</li>';
	html += '<li class="letter row2">t</li>';
	html += '<li class="letter row2">y</li>';
	html += '<li class="letter row2">u</li>';
	html += '<li class="letter row2">i</li>';
	html += '<li class="letter row2">o</li>';
	html += '<li class="letter row2">p</li>';
	html += '<li class="letter row2">å</li>';
	html += '<li class="symbol row2">:</li>';
	html += '<li class="symbol row2 lastitem">?</li>';
	html += '</ul>';
	html += '<ul class="keyboard">';
	html += '<li class="capslock row3">Caps Lock</li>';
	html += '<li class="letter row3">a</li>';
	html += '<li class="letter row3">s</li>';
	html += '<li class="letter row3">d</li>';
	html += '<li class="letter row3">f</li>';
	html += '<li class="letter row3">g</li>';
	html += '<li class="letter row3">h</li>';
	html += '<li class="letter row3">j</li>';
	html += '<li class="letter row3">k</li>';
	html += '<li class="letter row3">l</li>';
	html += '<li class="letter row3">ö</li>';
	html += '<li class="letter row3">ä</li>';
	html += '<li class="return row3 lastitem" id="search">Sök</li>';
	html += '</ul>';
	html += '<ul class="keyboard">';
	html += '<li class="left-shift row4">Shift</li>';
	html += '<li class="letter row4">z</li>';
	html += '<li class="letter row4">x</li>';
	html += '<li class="letter row4">c</li>';
	html += '<li class="letter row4">v</li>';
	html += '<li class="letter row4">b</li>';
	html += '<li class="letter row4">n</li>';
	html += '<li class="letter row4">m</li>';
	html += '<li class="symbol row4">,</li>';
	html += '<li class="symbol row4">.</li>';
	html += '<li class="symbol row4">/</li>';
	html += '<li class="right-shift row4 lastitem">Shift</li>';
	html += '</ul>';
	html += '<ul class="keyboard">';
	html += '<li class="space row5 lastitem">&nbsp;</li>';
	html += '</ul>';
	html += '</div>';
	$('.slider-search').html(html);

	var ime_html = '<div class="imesearch-content">';
	ime_html += '<div class="input_bg">';
	ime_html += '<input id="ime_write" class="footer_input" type="text" value="" />';
	ime_html += '</div>';
	ime_html += '</div>';
	$('.slider-imesearch').html(ime_html);
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
	$(".slider-search").slideToggle(500, function() {});	

};

Search.imeShow = function()
{
    alert("Search.imeShow called");
    if(Buttons.getKeyHandleID()!=7){
        oldKeyHandle = Buttons.getKeyHandleID();
        Buttons.setKeyHandleID(7);
        $(".slider-imesearch").slideToggle(500, function() {
            // Position of input box gets messed up in case focus is called too soon (at least in 2012 simulator).
            if (Buttons.getKeyHandleID() == 7)
                document.getElementById("ime_write").focus();
        });

        // pluginAPI.registIMEKey()
        if(input == null)
        {
            try {
                input = new Input("ime_write");
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
        $(".slider-imesearch").slideToggle(500, function() {});
        document.getElementById("ime_write").blur()
	document.body.focus();
        Buttons.setKeyHandleID(oldKeyHandle); 
	Buttons.enableKeys();
    }
};

Search.imeReady = function()
{
    true;
    // document.getElementById("ime_write").focus();
};

Search.hide = function()
{
	
	if(Buttons.getKeyHandleID()==4){
		Buttons.setKeyHandleID(oldKeyHandle);
		$(".slider-search").slideToggle(500, function() {});	
	}
        else if (Buttons.getKeyHandleID()==7){
            Search.imeShow();
        }
};