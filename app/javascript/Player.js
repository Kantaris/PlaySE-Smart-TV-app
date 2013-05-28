var buff;
var pluginAPI;
var Player =
{
    plugin : null,
    state : -1,
    skipState : -1,
    stopCallback : null,    /* Callback function to be set by client */
    originalSource : null,
    
    STOPPED : 0,
    PLAYING : 1,
    PAUSED : 2,  
    FORWARD : 3,
    REWIND : 4
}

Player.init = function()
{
    var success = true;
    
    this.state = this.STOPPED;
    pluginAPI = new Common.API.Plugin();
    this.plugin = document.getElementById("pluginPlayer");
    
    if (!this.plugin)
    {
         success = false;
    }
    else
    {
        var mwPlugin = document.getElementById("pluginTVMW");
        
        if (!mwPlugin)
        {
            success = false;
        }
        else
        {
            /* Save current TV Source */
            this.originalSource = mwPlugin.GetSource();
            
            /* Set TV source to media player plugin */
            mwPlugin.SetMediaSource();
        }
    }
    
  //  this.setWindow();
    
    this.plugin.OnCurrentPlayTime = 'Player.setCurTime';
    this.plugin.OnStreamInfoReady = 'Player.setTotalTime';
    this.plugin.OnBufferingStart = 'Player.onBufferingStart';
    this.plugin.OnBufferingProgress = 'Player.onBufferingProgress';
    this.plugin.OnBufferingComplete = 'Player.onBufferingComplete';           
            
    return success;
}

Player.deinit = function()
{
        var mwPlugin = document.getElementById("pluginTVMW");
        
        if (mwPlugin && (this.originalSource != null) )
        {
            /* Restore original TV source before closing the widget */
            mwPlugin.SetSource(this.originalSource);
            alert("Restore source to " + this.originalSource);
        }
}

Player.setWindow = function()
{
	//this.plugin.SetDisplayArea(0, 0, 960, 540);
    this.plugin.SetDisplayArea(0, 0, 1, 1);
}

Player.setFullscreen = function()
{
    this.plugin.SetDisplayArea(0, 0, 960, 540);
}

Player.setVideoURL = function(url)
{
    this.url = url;
    alert("URL = " + this.url);
}

Player.playVideo = function()
{
    if (this.url == null)
    {
        alert("No videos to play");
    }
    else
    {
		pluginAPI.setOffScreenSaver();
        this.state = this.PLAYING;
 
        this.setWindow();
        
        this.plugin.SetInitialBuffer(640*1024);
        this.plugin.SetPendingBuffer(640*1024); 
       
        this.plugin.Play( this.url );
        Audio.plugin.SetSystemMute(false);
    }
}

Player.pauseVideo = function()
{
	window.clearTimeout(timeout);
	this.showControls();
	this.showControls();
	$('.bottomoverlaybig').css("display", "block");
	$('.bottomoverlaybig').html('Pausad');

    this.state = this.PAUSED;
    this.plugin.Pause();
}

Player.stopVideo = function()
{
    if (this.state != this.STOPPED)
    {

        this.plugin.Stop();
		//pluginAPI.set0nScreenSaver(6000);
        
        if (this.stopCallback)
        {
            this.stopCallback();
        }
    }
    else
    {
        alert("Ignoring stop request, not in correct state");
    }
}

Player.stopVideoNoCallback = function()
{
    if (this.state != this.STOPPED)
    {

        this.plugin.Stop();
        
        
    }
    else
    {
        alert("Ignoring stop request, not in correct state");
    }
}

Player.resumeVideo = function()
{
    this.state = this.PLAYING;
    this.plugin.Resume();
	this.hideControls();
}

Player.skipForwardVideo = function()
{
	window.clearTimeout(timeout);
	this.showControls();
    this.skipState = this.FORWARD;
    this.plugin.JumpForward(10); 
	timeout = window.setTimeout(this.hideControls, 5000);
}

Player.skipBackwardVideo = function()
{
	window.clearTimeout(timeout);
	this.showControls();
    this.skipState = this.REWIND;
    this.plugin.JumpBackward(10);
	timeout = window.setTimeout(this.hideControls, 5000);
}

Player.getState = function()
{
    return this.state;
}

// Global functions called directly by the player 

Player.onBufferingStart = function()
{
	this.showControls();
    $('.bottomoverlaybig').css("display", "block");
	if(Language.getisSwedish()){
	buff='Buffrar';
	}else{
	buff='Buffering';
	}
	$('.bottomoverlaybig').html(buff+': 0%');
}

Player.onBufferingProgress = function(percent)
{
	if(Language.getisSwedish()){
	buff='Buffrar';
	}else{
	buff='Buffering';
	}
  this.showControls();
  $('.bottomoverlaybig').css("display", "block");
  $('.bottomoverlaybig').html(buff+': ' + percent + '%');

}

Player.onBufferingComplete = function()
{
	if(Language.getisSwedish()){
	buff='Buffrar';
	}else{
	buff='Buffering';
	}
	this.hideControls();
	$('.bottomoverlaybig').html(buff+': 100%');
	this.setFullscreen();
//	this.setWindow();
   //$('.loader').css("display", "none");
}

Player.showControls = function(){
  $('.video-wrapper').css("display", "block");				
  $('.video-footer').css("display", "block");

}

Player.hideControls = function(){
	$('.video-wrapper').css("display", "none");				
	$('.video-footer').css("display", "none");
	$('.bottomoverlaybig').css("display", "none");
}

Player.setCurTime = function(time)
{
	var tsecs = time / 1000;
	var secs = Math.floor(tsecs % 60);
	var mins = Math.floor(tsecs / 60);
	var smins;
	var ssecs;
	if(mins < 10){
		smins = '0' + mins;
	}
	else{
		smins = mins;
	}
	if(secs < 10){
		ssecs = '0' + secs;
	}
	else{
		ssecs = secs;
	}
	
	$('.currentTime').text(smins + ':' + ssecs);
	
	var progress = Math.floor(960 * time / Player.plugin.GetDuration());
	$('.progressfull').css("width", progress);
	$('.progressempty').css("width", 960 - progress);
   // Display.setTime(time);
   this.setTotalTime();
}

Player.setTotalTime = function()
{
	var tsecs = Player.plugin.GetDuration() / 1000;
	var secs = Math.floor(tsecs % 60);
	var mins = Math.floor(tsecs / 60);
	var smins;
	var ssecs;
	if(mins < 10){
		smins = '0' + mins;
	}
	else{
		smins = mins;
	}
	if(secs < 10){
		ssecs = '0' + secs;
	}
	else{
		ssecs = secs;
	}
	
	$('.totalTime').text(smins + ':' + ssecs);
    //Display.setTotalTime(Player.plugin.GetDuration());
}

onServerError = function()
{
    Display.status("Server Error!");
}

OnNetworkDisconnected = function()
{
    Display.status("Network Error!");
}

getBandwidth = function(bandwidth) { alert("getBandwidth " + bandwidth); }

onDecoderReady = function() { alert("onDecoderReady"); }

onRenderError = function() { alert("onRenderError"); }

stopPlayer = function()
{
    Player.stopVideo();
}

setTottalBuffer = function(buffer) { alert("setTottalBuffer " + buffer); }

setCurBuffer = function(buffer) { alert("setCurBuffer " + buffer); }
