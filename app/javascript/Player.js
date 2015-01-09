var buff;
var skipTime = 0;
var timeoutS;
var pluginAPI;
var ccTime = 0;
var lastPos = 0;
var videoUrl;
var startup = true;
var smute = 0;

var Player =
{
    plugin : null,
    state : -1,
    skipState : -1,
    stopCallback : null,    /* Callback function to be set by client */
    originalSource : null,
    sourceDuration: 0,
    infoActive:false,
    
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

Player.setVideoURL = function(url, srtUrl)
{
    videoUrl = url;
    alert("URL = " + videoUrl);
};

Player.setDuration = function(duration)
{
    if (duration.length > 0) 
    {
        var h = GetDigits("h", duration);
        var m = GetDigits("min", duration);
        var s = GetDigits("sek", duration);
        // alert("JTDEBUG decoded duration " + h + ":" + m + ":" + s);
        this.sourceDuration = (h*3600 + m*60 + s*1) * 1000;
    }
    else
    {
        this.sourceDuration = 0;
    }
    // alert("JTDEBUG Player.sourceDuration: " + this.sourceDuration);

};

GetDigits = function(type, data)
{

    var regexp1 = new RegExp("^(\\d+) " + type + ".*");
    var regexp2 = new RegExp("^.*\\D+(\\d+) " + type + ".*");
    if (data.search(regexp1) != -1)
        return data.replace(regexp1, "$1");
    else if (data.search(regexp2) != -1)
        return data.replace(regexp2, "$1");
    else
        return "0"
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
        startup = true;
        if(Audio.plugin.GetUserMute() == 1){
        	$('.muteoverlay').css("display", "block");
        	smute = 1;
        }
        else{
            $('.muteoverlay').css("display", "none");
            smute = 0;
        }
        this.plugin.Play( videoUrl );
        // work-around for samsung bug. Video player start playing with sound independent of the value of GetUserMute() 
        // GetUserMute() will continue to have the value of 1 even though sound is playing
        // so I set SetUserMute(0) to get everything synced up again with what is really happening
        // once video has started to play I set it to the value that it should be.
        Audio.plugin.SetUserMute(0);
        
       // Audio.showMute();
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
        $('.topoverlayresolution').html("");
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

Player.skipForward = function(time)
{
    var duration = this.GetDuration();
    if(this.skipState == -1)
    {
        if (((+ccTime + time) > +duration) && (+ccTime <= +duration))
        {
            return this.showInfo(true);
        }
        skipTime = ccTime;
    }
    else if (((+skipTime + time) > +duration) && (+ccTime <= +duration))
    {
        return -1
    }
    window.clearTimeout(timeoutS);
    this.showControls();
    skipTime = +skipTime + time;
    this.skipState = this.FORWARD;
    alert("forward skipTime: " + skipTime);
    this.updateSeekBar(skipTime);
    timeoutS = window.setTimeout(this.skipInVideo, 2000);
};

Player.skipForwardVideo = function()
{
    this.skipForward(30000);
};

Player.skipLongForwardVideo = function()
{
    this.skipForward(5*60*1000);
};

Player.skipBackward = function(time)
{
    window.clearTimeout(timeoutS);
    this.showControls();
    if(this.skipState == -1){
	skipTime = ccTime;
    }
    skipTime = +skipTime - time;
    if(+skipTime < 0){
	skipTime = 0;
    }
    this.skipState = this.REWIND;
    this.updateSeekBar(skipTime);
    timeoutS = window.setTimeout(this.skipInVideo, 2000);
};

Player.skipBackwardVideo = function()
{
    this.skipBackward(30000);
};

Player.skipLongBackwardVideo = function()
{
    this.skipBackward(5*60*1000);
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
        Player.infoActive = false;
	alert("hide controls");
};

Player.setCurTime = function(time)
{
	// work-around for samsung bug. Mute sound first after the player started.
	if(startup){
		startup = false;
		Audio.setCurrentMode(smute);
	}
	ccTime = time;
	if(this.skipState == -1){
		this.updateSeekBar(time);
	}
	
};

Player.updateSeekBar = function(time){
	var tsecs = time / 1000;
	var secs  = Math.floor(tsecs % 60);
	var mins  = Math.floor(tsecs / 60);
        var hours = Math.floor(mins / 60);
	var smins;
	var ssecs;

        mins  = Math.floor(mins % 60);

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
	
	$('.currentTime').text(hours + ':' + smins + ':' + ssecs);
	
        var progressFactor = time / Player.GetDuration();
        if (progressFactor > 1)
            progressFactor = 1;
	var progress = Math.floor(960 * progressFactor);
	$('.progressfull').css("width", progress);
	$('.progressempty').css("width", 960 - progress);
   // Display.setTime(time);
   this.setTotalTime();
	
}; 

Player.setTotalTime = function()
{
	var tsecs = this.GetDuration() / 1000;
	var secs  = Math.floor(tsecs % 60);
	var mins  = Math.floor(tsecs / 60);
        var hours = Math.floor(mins / 60);
	var smins;
	var ssecs;

        mins = Math.floor(mins % 60);
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
	
	$('.totalTime').text(hours + ':' + smins + ':' + ssecs);
    //Display.setTotalTime(Player.GetDuration());
        this.setResolution(Player.plugin.GetVideoWidth(), Player.plugin.GetVideoHeight());
};

Player.showInfo = function(force)
{
    window.clearTimeout(timeout);
    if (!Player.infoActive || force) {
	this.showControls();
	//$('.bottomoverlaybig').css("display", "block");
	timeout = window.setTimeout(this.hideControls, 5000);
        Player.infoActive = true;
    }
    else
    {
        this.hideControls();
    }

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
			        // url: 'http://188.40.102.5/recommended.ashx',
                                url: 'http://www.svtplay.se/populara?sida=1',
					timeout: 10000,
			        success: function(data)
			        {
			        	
			        	var $entries = $(data).find('video');

			        	if ($entries.length > 0) {
			        		alert('Success:' + this.url);
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

Player.GetDuration = function()
{
    var duration = this.plugin.GetDuration()

    if (duration > this.sourceDuration)
        return duration;
    else
        return this.sourceDuration;
};

Player.toggleAspectRatio = function() {

    if (Player.getAspectMode() === 0) {
        Player.setAspectMode(1);
    }
    else 
    {
        Player.setAspectMode(0);
    }
    this.setAspectRatio(Player.plugin.GetVideoWidth(), Player.plugin.GetVideoHeight());

    if (this.state === this.PAUSED) {
        Player.pauseVideo();
    }
};

Player.setResolution = function (videoWidth, videoHeight) {

    if (videoWidth  > 0 && videoHeight > 0) {
        var aspect = videoWidth / videoHeight;
        if (aspect == 16/9) {
            aspect = "16:9";
        } else if (aspect == 4/3) {
            aspect = "4:3";
        }
        else {
            aspect = aspect.toFixed(2) + ":1";
        }
	$('.topoverlayresolution').html(videoWidth + "x" + videoHeight + " (" + aspect + ")" + this.getAspectModeText());
        this.setAspectRatio(videoWidth, videoHeight);
    }
};

Player.setAspectRatio = function(videoWidth, videoHeight) {

    if (videoWidth > 0 && videoHeight > 0) {
        if (Player.getAspectMode() === 1 && videoWidth/videoHeight > 4/3)
        {
            var cropX     = Math.round(videoWidth/960*120);
            var cropWidth = videoWidth-(2*cropX);
            Player.plugin.SetCropArea(cropX, 0, cropWidth, videoHeight);
        }
        else
        {
            Player.plugin.SetCropArea(0, 0, videoWidth, videoHeight);
        }
    }
};

Player.setAspectMode = function(value)
{
    var exdate=new Date();
    exdate.setDate(exdate.getDate() + 1);
    var c_value=escape(value) + "; expires="+exdate.toUTCString();
    document.cookie="aspectMode=" + c_value;
};


Player.getAspectMode = function(){
    var i,x,y,ARRcookies=document.cookie.split(";");
    for (i=0;i<ARRcookies.length;i++)
    {
        x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
        y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
        x=x.replace(/^\s+|\s+$/g,"");
        if (x=="aspectMode")
        {
            var aspectMode = unescape(y);
            if (aspectMode)
                return aspectMode*1
        }
    }
    return 0
};

Player.getAspectModeText = function()
{
    if (this.getAspectMode() === 1) {
        return " H-FIT";
    }
    else 
        return "";
};
