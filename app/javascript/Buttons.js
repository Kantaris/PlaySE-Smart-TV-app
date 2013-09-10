var tvKey = new Common.API.TVKeyValue();

var index = 0; // list = 0, details = 1, player = 2, kanaler = 3, search = 4, player2 = 5, language = 6, blocked = 7, connection error = 8
var fired = false;
var itemSelected;

var shift = false;
var capslock = false;
var rowCount = 1;
var keyCount = 0;
var first = true;
var channels = ['svt1', 'svt2', 'svt24', 'barnkanalen', 'kunskapskanalen'];
var channelId = 0;
var isLeft = 1;
var mute = false;
var Buttons =
{
    
};
Buttons.keyDown = function()
{
	if(index == 0){
		this.keyHandleForList();
	}
	else if(index == 1)
	{
		this.keyHandleForDetails();
	}
	else if(index == 2){
		this.keyHandleForPlayer();
	}
	else if(index == 3){
		this.keyHandleForKanaler();
	}
	else if(index == 4){
		this.keyHandleForSearch();
	}
	else if(index == 5){
		this.getCurrentChannelId();
		this.keyHandleForPlayer2();
	}
	else if(index == 6){
		this.keyHandleForLanguage();
	}
	else if(index == 7){
		this.keyHandleForGeofilter();
	}
	else if(index == 8){
		this.keyHandleForConnectionError();
	}
};

Buttons.getCurrentChannelId = function(){
	var url = document.location.href;
	for(var i = 0; i < channels.length; i++){
		if (url.indexOf(channels[i])>0)
		{
			channelId = i;
		}
	}
	
};

Buttons.setKeyHandleID = function(iid){
	index = iid;
};

Buttons.getKeyHandleID = function(){
	return index; 
};



Buttons.enableKeys = function()
{
	document.getElementById("anchor").focus();
};

Buttons.setFired = function() 
{
	fired = false;
};

Buttons.sscroll = function(param) 
{
	var xaxis = 0;
	if(columnCounter > 0){
		xaxis = columnCounter - 1;
	}
	xaxis = -xaxis * 260;
	$('.content-holder').animate({ marginLeft: xaxis}, 500 );
	 
};

Buttons.keyHandleForList = function()
{
	var topItems = $('.topitem');
	var bottomItems = $('.bottomitem');
	var keyCode = event.keyCode;
	alert("Key pressedd: " + keyCode);

	if (!fired) {
		fired = true;
		window.setTimeout(this.setFired, 500);
		if (!itemSelected) {
			itemSelected = topItems.eq(0).addClass('selected');
			columnCounter = 0;
		}
		switch(keyCode)
		{
			case tvKey.KEY_RIGHT:
				
				itemSelected.removeClass('selected');
				next = itemSelected.next();
				if (next.length > 0) {
					columnCounter++;
					itemSelected = next.addClass('selected');
				} else {
					itemSelected = topItems.eq(0).addClass('selected');
					columnCounter = 0;
				}
				break;
				
			case tvKey.KEY_LEFT:
				itemSelected.removeClass('selected');
				next = itemSelected.prev();
				if (next.length > 0) {
					itemSelected = next.addClass('selected');
					columnCounter--;
				} else {
					itemSelected = topItems.last().addClass('selected');
					columnCounter = topItems.length - 1;
				}
				break;
			case tvKey.KEY_DOWN:
				itemSelected.removeClass('selected');
				itemSelected = bottomItems.eq(columnCounter).addClass('selected');
				break;
			case tvKey.KEY_UP:				
				itemSelected.removeClass('selected');
				itemSelected = topItems.eq(columnCounter).addClass('selected');				
				break;
			case tvKey.KEY_ENTER:
			case tvKey.KEY_PANEL_ENTER:
				var ilink = itemSelected.find('.ilink').attr("href");
				alert(ilink);
				window.location = ilink;
				break;
		}
		this.handleMenuKeys(keyCode);
		this.sscroll(itemSelected);
	}
};

Buttons.keyHandleForDetails = function()
{
	var keyCode = event.keyCode;
	switch(keyCode)
	{
		case tvKey.KEY_LEFT:
		isLeft = 1;
		$('#playButton').addClass('selected');
		$('#backButton').removeClass('selected');
		break;
		case tvKey.KEY_RIGHT:
		isLeft = 0;
		$('#backButton').addClass('selected');
		$('#playButton').removeClass('selected');
		break;
		case tvKey.KEY_ENTER:
		case tvKey.KEY_PANEL_ENTER:
			alert("enter");
			if(isLeft == 0){
				history.go(-1);
			}
			else{
				Details.startPlayer();
			}
			break;
		
	}
	this.handleMenuKeys(keyCode);
	
};

Buttons.keyHandleForLanguage = function()
{
	var keyCode = event.keyCode;
	switch(keyCode)
	{
		case tvKey.KEY_LEFT:
		isLeft = 1;
		$('#english').addClass('selected');
		$('#english').removeClass('unselected');
		$('#swedish').addClass('unselected');
		$('#swedish').removeClass('selected');
		break;
		case tvKey.KEY_RIGHT:
		isLeft = 0;
		$('#swedish').addClass('selected');
		$('#swedish').removeClass('unselected');
		$('#english').addClass('unselected');
		$('#english').removeClass('selected');
		break;
		case tvKey.KEY_ENTER:
		case tvKey.KEY_PANEL_ENTER:
			alert("enter");
			if(isLeft == 0){//0 replace is not left
				$('#swedish').addClass('checked');
				$('#english').removeClass('checked');
				Language.setLang('Swedish');
			}
			else{
				$('#english').addClass('checked');
				$('#swedish').removeClass('checked');
				Language.setLang('English');
			}
			break;
		
	}
	this.handleMenuKeys(keyCode);
	
};

Buttons.keyHandleForSearch = function()
{
	var keys = $('.row' + rowCount);
    keys.eq(keyCount).removeClass('selected');
	var keyCode = event.keyCode;
	switch(keyCode)
	{
		case tvKey.KEY_LEFT:
			if (keyCount > 0) {
                keyCount--;
            }
			break;
		case tvKey.KEY_RIGHT:
			if (keyCount < keys.length - 1) {
                keyCount++;
            }
			break;
		case tvKey.KEY_UP:
			if (rowCount > 1) {
                rowCount--;
            }
			break;
		case tvKey.KEY_DOWN:
			if (rowCount < 5) {
                rowCount++;
            }
			break;
		case tvKey.KEY_ENTER:
		case tvKey.KEY_PANEL_ENTER:
			var $this = keys.eq(keyCount);
			if(first)
			{
				$('#write').val('');
				first = false;
			}
			var character = $this.html(); // If it's a lowercase letter, nothing happens to this variable
			alert(character);
        // Shift keys
        if ($this.hasClass('left-shift') || $this.hasClass('right-shift')) {
            $('.letter').toggleClass('uppercase');
            $('.symbol span').toggle();

            shift = (shift === true) ? false : true;
            capslock = false;
            break;
        }

        // Caps lock
        if ($this.hasClass('capslock')) {
            $('.letter').toggleClass('uppercase');
            capslock = true;
            break;
        }

        // Delete
        if ($this.hasClass('delete')) {
            var html = $('#write').val();

            $('#write').val(html.substr(0, html.length - 1));
            break;
        }

        // Special characters
        if ($this.hasClass('space')) character = ' ';
        if ($this.hasClass('tab')) character = "\t";
        if ($this.hasClass('return')) {
			window.location = 'SearchList.html?sok=' + $('#write').val();
			return false;
		}

        // Uppercase letter
        if ($this.hasClass('uppercase')) character = character.toUpperCase();
		
		// Remove shift once a key is clicked.
        if (shift === true) {
            $('.symbol span').toggle();
            //if (capslock === false) $('.letter').toggleClass('uppercase');

            shift = false;
        }

        // Add the character
		alert("text " + $('#write').val() + character);
        $('#write').val($('#write').val() + character);
		break;
	}
	keys = $('.row' + rowCount);
	if (keyCount > keys.length - 1) {
		keyCount = keys.length - 1;
	}
	keys.eq(keyCount).addClass('selected');
	alert(keyCount);
	$('.keyboard').hide(0, function(){$(this).show();});
	this.handleMenuKeys(keyCode);
};

Buttons.keyHandleForKanaler = function()
{
	var keyCode = event.keyCode;
	switch(keyCode)
	{
		case tvKey.KEY_LEFT:
		isLeft = 1;
		$('#playButton').addClass('selected');
		$('#backButton').removeClass('selected');
		break;
		case tvKey.KEY_RIGHT:
		isLeft = 0;
		$('#backButton').addClass('selected');
		$('#playButton').removeClass('selected');
		break;
		case tvKey.KEY_ENTER:
		case tvKey.KEY_PANEL_ENTER:
			alert("enter");
			if(isLeft == 0){
				history.go(-1);
			}
			else{
				Kanaler.startPlayer();
			}
			break;
		
	}
	this.handleMenuKeys(keyCode);
	
};
Buttons.keyHandleForPlayer2 = function(){
		var keyCode = event.keyCode;
	switch(keyCode)
		{
			case tvKey.KEY_RW:
				Player.skipBackwardVideo();
				break;
			case tvKey.KEY_PAUSE:
				Player.pauseVideo();
				break;
			case tvKey.KEY_PLAY:
				Player.resumeVideo();
				break;
			case tvKey.KEY_STOP:
				Player.stopVideo();
				break;
			case tvKey.KEY_VOL_DOWN:
					alert("VOL_DOWN");
					Audio.setRelativeVolume(1);
				break;
			case tvKey.KEY_PANEL_VOL_DOWN:
				alert("VOL_DOWN");
					Audio.setRelativeVolume(1);
				break;
			case tvKey.KEY_VOL_UP:
				alert("VOL_UP");
				Audio.setRelativeVolume(0);
				break;
			case tvKey.KEY_PANEL_VOL_UP:
				alert("VOL_UP");
				Audio.setRelativeVolume(0);
				break;
			case tvKey.KEY_RETURN:
				widgetAPI.blockNavigation(event); 
				Player.stopVideo();
				break;
			case tvKey.KEY_CH_UP:
				alert('ch up');
				Player.stopVideoNoCallback();
				if(channelId < channels.length - 1){
					channelId = channelId + 1;
					window.location = 'kanaler.html?ilink=kanaler/' + channels[channelId] + '&history=Kanaler/' + channels[channelId] + '/&direct=1';
				}
				break;
			case tvKey.KEY_PANEL_CH_UP:
				alert('ch up');
				Player.stopVideoNoCallback();
				if(channelId < channels.length - 1){
					channelId = channelId + 1;
					window.location = 'kanaler.html?ilink=kanaler/' + channels[channelId] + '&history=Kanaler/' + channels[channelId] + '/&direct=1';
				}
				break;
			case tvKey.KEY_CH_DOWN:
				Player.stopVideoNoCallback();
				if(channelId > 0){
					channelId--;
					window.location = 'kanaler.html?ilink=kanaler/' + channels[channelId] + '&history=Kanaler/' + channels[channelId] + '/&direct=1';
				}
				break;
			case tvKey.KEY_PANEL_CH_DOWN:
				Player.stopVideoNoCallback();
				if(channelId > 0){
					channelId--;
					window.location = 'kanaler.html?ilink=kanaler/' + channels[channelId] + '&history=Kanaler/' + channels[channelId] + '/&direct=1';
				}
				break;
			 case tvKey.KEY_MUTE:
				if (mute == false){
					Audio.plugin.SetSystemMute(true);
					mute = true;
				}
				else{
					Audio.plugin.SetSystemMute(false);
					mute = false;
				}
			 break;
			}
};
Buttons.keyHandleForPlayer = function(){
	var keyCode = event.keyCode;
	switch(keyCode)
		{
			case tvKey.KEY_RW:
				Player.skipBackwardVideo();
				break;
			case tvKey.KEY_PAUSE:
				Player.pauseVideo();
				break;
			case tvKey.KEY_FF:
				Player.skipForwardVideo();
			case tvKey.KEY_PLAY:
				Player.resumeVideo();
				break;
			case tvKey.KEY_STOP:
				Player.stopVideo();
				break;
			case tvKey.KEY_VOL_DOWN:
					alert("VOL_DOWN");
					Audio.setRelativeVolume(1);
				break;
			case tvKey.KEY_PANEL_VOL_DOWN:
				alert("VOL_DOWN");
					Audio.setRelativeVolume(1);
				break;
			case tvKey.KEY_VOL_UP:
				alert("VOL_UP");
					Audio.setRelativeVolume(0);
				break;
			case tvKey.KEY_PANEL_VOL_UP:
				alert("VOL_UP");
					Audio.setRelativeVolume(0);
				break;
			case tvKey.KEY_RETURN:
				widgetAPI.blockNavigation(event); 
				Player.stopVideo();
				break;
			case tvKey.KEY_MUTE:
				if (mute == false){
					Audio.plugin.SetSystemMute(true);
					mute = true;
				}
				else{
					Audio.plugin.SetSystemMute(false);
					mute = false;
				}
			 break;
		}
};
Buttons.keyHandleForGeofilter = function()
{
	var keyCode = event.keyCode;
	switch(keyCode)
	{
		
		case tvKey.KEY_ENTER:
		case tvKey.KEY_PANEL_ENTER:
			history.go(-1);
			break;
		
	}
	this.handleMenuKeys(keyCode);
	
};

Buttons.keyHandleForConnectionError = function()
{
	var keyCode = event.keyCode;
	switch(keyCode)
	{
		
		case tvKey.KEY_ENTER:
		case tvKey.KEY_PANEL_ENTER:
			location.reload(true);
			break;
		
	}
	this.handleMenuKeys(keyCode);
	
};

Buttons.handleMenuKeys = function(keyCode){
	switch(keyCode)
		{
			case tvKey.KEY_RED: 
				window.location = 'index.html';
				break;
			case tvKey.KEY_GREEN: 
				window.location = 'categories.html';
				break;
			case tvKey.KEY_YELLOW:
				window.location = 'live.html';
				break;
			case tvKey.KEY_BLUE:
				Search.show();
				break;
			case tvKey.KEY_RETURN:
				var urlpath = window.location.href;
				var ifound = urlpath.indexOf('index.html');
				if(index == 6){
					widgetAPI.blockNavigation(event); 
					Language.show();
				}
				else if(ifound < 0){
					alert("not index.html");
					widgetAPI.blockNavigation(event); 
					history.go(-1);
				}
				break;
			case tvKey.KEY_TOOLS:
				widgetAPI.blockNavigation(event); 
				Language.show();
				break;
		}
};
