var buff;
var skipTime = 0;
var timeoutS;
var pluginAPI;
var ccTime = 0;
var lastPos = 0;
var videoUrl;

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
};

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
    this.plugin.OnRenderingComplete  = 'Player.onRenderingComplete'; 
    this.plugin.OnNetworkDisconnected = 'Player.OnNetworkDisconnected';
    this.plugin.OnConnectionFailed = 'Player.OnNetworkDisconnected';
    return success;
};

Player.deinit = function()
{
        var mwPlugin = document.getElementById("pluginTVMW");
        
        if (mwPlugin && (this.originalSource != null) )
        {
            /* Restore original TV source before closing the widget */
            mwPlugin.SetSource(this.originalSource);
            alert("Restore source to " + this.originalSource);
        }
};

Player.setWindow = function()
{
	//this.plugin.SetDisplayArea(0, 0, 960, 540);
    this.plugin.SetDisplayArea(0, 0, 1, 1);
};

Player.setFullscreen = function()
{
    this.plugin.SetDisplayArea(0, 0, 960, 540);
};

Player.setVideoURL = function(url)
{
    videoUrl = url;
    alert("URL = " + url);
};

Player.playVideo = function()
{
    if (videoUrl == null)
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
       
        this.plugin.Play( videoUrl );
        Audio.plugin.SetUserMute(false);
    }
};

Player.pauseVideo = function()
{
	window.clearTimeout(timeout);
	this.showControls();
	$('.bottomoverlaybig').css("display", "block");
	var pp;
	if(Language.getisSwedish()){
		pp='Pausad';
	}else{
		pp='Pause';
	}
	$('.bottomoverlaybig').html(pp);

    this.state = this.PAUSED;
    this.plugin.Pause();
};

Player.stopVideo = function()
{
  
        this.plugin.Stop();
		//pluginAPI.set0nScreenSaver(6000);
        
        if (this.stopCallback)
        {
            this.stopCallback();
        }
    
};

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
};

Player.resumeVideo = function()
{
	//this.plugin.ResumePlay(vurl, time);
    this.state = this.PLAYING;
    this.plugin.Resume();
	this.hideControls();
};

Player.reloadVideo = function()
{
	this.plugin.Stop();
	lastPos = Math.floor(ccTime / 1000.0);
	this.plugin.ResumePlay(videoUrl, lastPos);
	alert("video reloaded. url = " + videoUrl + "pos " + lastPos );
    this.state = this.PLAYING;
	this.hideControls();
};

Player.skipInVideo = function()
{
	window.clearTimeout(timeout);
    Player.skipState = -1;
    var timediff = +skipTime - +ccTime;
    timediff = timediff / 1000;
    if(timediff > 0){
    	Player.plugin.JumpForward(timediff);
    	alert("forward jump: " + timediff);
    }
    else if(timediff < 0){
    	timediff = 0 - timediff;
    	Player.plugin.JumpBackward(timediff);
    }
	timeout = window.setTimeout(this.hideControls, 5000);
};

Player.skipForwardVideo = function()
{
	window.clearTimeout(timeoutS);
	this.showControls();
	if(this.skipState == -1){
		skipTime = ccTime;
	}
	skipTime = +skipTime + 30000;
	var tsecs = +this.plugin.GetDuration() - 30000;
	if(+skipTime > +tsecs){
		skipTime = tsecs;
	}
    this.skipState = this.FORWARD;
    alert("forward skipTime: " + skipTime);
    this.updateSeekBar(skipTime);
	timeoutS = window.setTimeout(this.skipInVideo, 2000);
};

Player.skipBackwardVideo = function()
{
	window.clearTimeout(timeoutS);
	this.showControls();
	if(this.skipState == -1){
		skipTime = ccTime;
	}
	skipTime = +skipTime - 30000;
	if(+skipTime < 0){
		skipTime = 0;
	}
    this.skipState = this.REWIND;
    this.updateSeekBar(skipTime);
	timeoutS = window.setTimeout(this.skipInVideo, 2000);
};

Player.getState = function()
{
    return this.state;
};

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
};

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

};

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
};

Player.onRenderingComplete = function()
{
	Player.stopVideo();
};

Player.showControls = function(){
  $('.video-wrapper').css("display", "block");				
  $('.video-footer').css("display", "block");
  alert("show controls");

};

Player.hideControls = function(){
	$('.video-wrapper').css("display", "none");				
	$('.video-footer').css("display", "none");
	$('.bottomoverlaybig').css("display", "none");
	alert("show controls");
};

Player.setCurTime = function(time)
{
	ccTime = time;
	if(this.skipState == -1){
		this.updateSeekBar(time);
	}
	
};

Player.updateSeekBar = function(time){
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
	
}; 

Player.setTotalTime = function()
{
	var tsecs = this.plugin.GetDuration() / 1000;
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
};

Player.showInfo = function()
{
	window.clearTimeout(timeout);
	this.showControls();
	//$('.bottomoverlaybig').css("display", "block");
	timeout = window.setTimeout(this.hideControls, 5000);

};

Player.OnNetworkDisconnected = function()
{
	this.showControls();
	$('.bottomoverlaybig').css("display", "block");
	$('.bottomoverlaybig').html('Network Error!');
	// just to test the network so that we know when to resume
	 $.ajax(
			    {
			        type: 'GET',
			        url: 'http://188.40.102.5/recommended.ashx',
					timeout: 10000,
			        success: function(data)
			        {
			        	
			        	var $entries = $(data).find('video');

			        	if ($entries.length > 0) {
			        		alert('Success');
			        		Player.reloadVideo();
			        	}
			        	else{
			        		alert('Failure');
			        		$.ajax(this);
			        	}
			        },
			        error: function(XMLHttpRequest, textStatus, errorThrown)
			        {
			        		alert('Failure');
			        		$.ajax(this);
         
			        }
			    });
};

