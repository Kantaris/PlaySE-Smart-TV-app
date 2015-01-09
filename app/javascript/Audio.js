var timeout;
var mute = false;

var Audio =
{
    plugin : null
};

Audio.init = function()
{
    var success = true;
    
    this.plugin = document.getElementById("pluginAudio");
    
    if (!this.plugin)
    {
        success = false;
    }

    return success;
};

Audio.toggleMute = function(){
	mute = this.plugin.GetUserMute();
	if (mute == false){
		this.plugin.SetUserMute(1);
		Footer.display(true);
		$('.muteoverlay').css("display", "block");
		alert("mute");
		mute = true;
	
	}
	else{
		this.plugin.SetUserMute(0);
		Footer.display(false);
		$('.muteoverlay').css("display", "none");
		alert("unmute");
		mute = false;
		
	}
	this.showMute();
};


Audio.showMute = function(){
	mute = this.plugin.GetUserMute();
	if (mute == true){
		window.clearTimeout(timeout);
		$('.video-wrapper').css("display", "block");				
		$('.video-footer').css("display", "block");
		$('.bottomoverlaybig').css("display", "block");
		var pp;
		if(Language.getisSwedish()){
			pp='Volym: Tyst';
		}else{
			pp='Volume: Mute';
		}
		$('.bottomoverlaybig').html(pp);
		timeout = window.setTimeout(this.hideControls, 5000);
	}
	else{
		window.clearTimeout(timeout);
		$('.video-wrapper').css("display", "block");				
		$('.video-footer').css("display", "block");
		$('.bottomoverlaybig').css("display", "block");
		var pp;
		if(Language.getisSwedish()){
			pp='Volym: ';
		}else{
			pp='Volume: ';
		}
		$('.bottomoverlaybig').html(pp + this.getVolume() + '%');
		timeout = window.setTimeout(this.hideControls, 5000);
	}
};

Audio.setRelativeVolume = function(delta)
{

	window.clearTimeout(timeout);
    this.plugin.SetVolumeWithKey(delta);
	$('.video-wrapper').css("display", "block");				
	$('.video-footer').css("display", "block");
	$('.bottomoverlaybig').css("display", "block");
	var pp;
	if(Language.getisSwedish()){
		pp='Volym: ';
	}else{
		pp='Volume: ';
	}
	$('.muteoverlay').css("display", "none");
	$('.bottomoverlaybig').html(pp + this.getVolume() + '%');
	this.showMuteFooter();
	timeout = window.setTimeout(this.hideControls, 5000);

};

Audio.hideControls = function(){
	$('.video-wrapper').css("display", "none");				
	$('.video-footer').css("display", "none");
	$('.bottomoverlaybig').css("display", "none");
};

Audio.getVolume = function()
{
    return this.plugin.GetVolume();
};



Audio.setCurrentMode = function(smute){
	mute = this.plugin.GetUserMute();
	alert('sr-mute' + mute);
	if(smute == 0){
		alert('play unmuted');
		this.plugin.SetUserMute(0);
	}
	else{
		alert('play muted');
		$('.muteoverlay').css("display", "block");
		this.plugin.SetUserMute(1);
	}
};


Audio.uiToggleMute = function()
{
	if(this.plugin.GetUserMute() == 0){
		alert("mute");
		this.plugin.SetUserMute(1);
		Footer.display(true);
	}
	else{
		alert("unmute");
		this.plugin.SetUserMute(0);
		Footer.display(false);
	}
	
};

Audio.showMuteFooter = function()
{
	if(this.plugin.GetUserMute() == 1){
		alert("muted");
		Footer.display(true);
	}
	else{
		alert("unmuted");
		Footer.display(false);
	}
	
};


