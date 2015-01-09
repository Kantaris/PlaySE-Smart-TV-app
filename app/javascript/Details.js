var widgetAPI = new Common.API.Widget();
var videoUrl = '';
var isPlaying = 0;
var spinner;
var buff;
var nowPlaying;
var language;
var gurl = "";
var isLive = 0;
var airTime = 0;
var currentTime = 0;
var countd=0;
var downCounter;
var proxy = "";

var Details =
{
    duration:null

};

Details.onLoad = function()
{
	Header.display('');
	Audio.init();
	Audio.showMuteFooter();
	Search.init();
	Language.init();
	ConnectionError.init();
	PathHistory.GetPath();
	// Enable key event processing
	Language.setLang();
	Resolution.displayRes();
	Buttons.setKeyHandleID(1);					
	Buttons.enableKeys();

	
	this.loadXml();
};

Details.onUnload = function()
{
	Player.deinit();
};


Details.Geturl=function(){
    var url = document.location.href;
	var parse;
    var name="";
    if (url.indexOf("ilink=")>0)
    {
		parse = url.substring(url.indexOf("=")+1,url.length);
		if (url.indexOf("&")>0)
		{
			name = parse.substring(0,parse.indexOf("&"));
			
		}
		else{
			name = parse;
		}
	}
    return name;
};

Details.Prepare = function(){

    this.GetPlayUrl();

    // if(isLive > 0){
    //     var url= "http://188.40.102.5/CurrentTime.ashx";
    //     alert(url);
    //     $.support.cors = true;
    //     $.ajax(
    //         {
    //     	type: 'GET',
    //     	url: url,
    //     	timeout: 15000,
    //     	tryCount : 0,
    //     	retryLimit : 3,
    //     	success: function(data)
    //     	{
    //     	    alert('Success prepare');
    //     	    currentTime = +($(data).find('CurrentTime').text());
    //     	    alert("currentTime=" + currentTime);
    //     	    if(airTime > currentTime){
    //     		countd = airTime - currentTime + 60;
    //     		alert("countd = " + countd);
    //     		downCounter = setInterval(Details.CountDown, 1000); 
    //     	    }
    //     	    else{
    //     		Details.GetPlayUrl();
    //     	    }
    //     	}
    //     	, 
    //             error: function(XMLHttpRequest, textStatus, errorThrown)
    //             {
    //                 if (textStatus == 'timeout') {
    //                     this.tryCount++;
    //                     if (this.tryCount <= this.retryLimit) {
    //                         //try again
    //                         $.ajax(this);
    //                         return;
    //                     }            
    //                     return;
    //                 }
    //                 else{
    //             	alert('Failure');
    //             	ConnectionError.show();
    //                 }
	            
    //             }
    //         });	
	
    // }
    // else{
    //     this.GetPlayUrl();
    // }

};

Details.CountDown = function()
{
	  countd = countd - 1;
	  if (countd <= 0)
	  {
	     clearInterval(downCounter);
	     Details.GetPlayUrl();
	     return;
	  }
	  var secs = Math.floor(countd % 60);
	  var mins = Math.floor(countd / 60);
	  var hrs = Math.floor(mins / 60);
	  mins = Math.floor(mins % 60);
	  var smins;
	  var ssecs;
	  var shrs;
	  if(hrs < 10){
			shrs = '0' + hrs;
		}
		else{
			shrs = hrs;
		}
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
		if(Language.getisSwedish()){
			 $('.bottomoverlaybig').html("Live - börjar om: " + shrs + ":" + smins + ":" + ssecs);
		}
		else{
			$('.bottomoverlaybig').html("Live - starts in: " + shrs + ":" + smins + ":" + ssecs);
		}
};

Details.GetPlayUrl = function(){
	gurl = this.Geturl();
	if(gurl.indexOf("http://") < 0){
		gurl = 'http://www.svtplay.se' + gurl;
	}
	$.getJSON(proxy + gurl + '?output=json', function(data) {
		
		$.each(data, function(key, val) {
			if(key == 'video'){
				
				for (var i = 0; i < val.videoReferences.length; i++) {
				    alert(val.videoReferences[i].url);
				    videoUrl = val.videoReferences[i].url;
				    if(videoUrl.indexOf('.m3u8') >= 0){
				    	break;
				    }
				}
                                srtUrl="";
                                for (var i = 0; i < val.subtitleReferences.length; i++) {
				    alert(val.subtitleReferences[i].url);
				    srtUrl = val.subtitleReferences[i].url;
                                    if (srtUrl.length > 0){
				    	break;
				    }
				}
                                Player.setDuration(Details.duration);

				if(videoUrl.indexOf('.m3u8') >= 0){
				    Resolution.getCorrectStream(videoUrl, isLive, srtUrl);
				}
				else{
				    Player.stopCallback();	
					
				// 	gurl = gurl + '?type=embed';
				// 	alert(gurl);
				// 	widgetAPI.runSearchWidget('29_fullbrowser', gurl);
				// //	$('#outer').css("display", "none");
				// //	$('.video-wrapper').css("display", "none");
					
				// //	$('.video-footer').css("display", "none");

				// //	$('#flash-content').css("display", "block");
				// //	$('#iframe').attr('src', gurl);
				}
			}
		});
		
	});
};

Details.loadXml = function(){
    var url = this.Geturl();
    if (url.indexOf("http://") == -1)
        url = "http://www.svtplay.se" + url
    var playDirectly = document.location.href.search("\\?play") != -1;

    alert(url);
    alert(playDirectly);
    $.support.cors = true;
    $.ajax(
        {
            type: 'GET',
            url: url,
	    timeout: 15000,
	    tryCount : 0,
	    retryLimit : 3,
            success: function(data)
            {
                alert('Success:' + this.url);

                var Name;
		var DetailsImgLink;
		var DetailsPlayTime;
                var VideoLength = "";
                var AvailDate="";
		var Description;
		var onlySweden;
                var isLive = false;


                if (this.url.indexOf("/kanaler/") > -1) {
                    var $video = $(data).find('div').filter(function() {
                        return $(this).attr('class') == "play_channels";
                    });

                    Name = $video.find('a').attr('data-title');
		    DetailsImgLink = $video.find('img').attr('data-imagename');
                    if (DetailsImgLink.indexOf("http") == -1)
                        DetailsImgLink = "http://www.svtplay.se" + DetailsImgLink;
                    pattern = new RegExp("\\b" + Name + "\\b", "i");
	            var $info = $(data).find('div').filter(function() {
                        
                        return ($(this).attr('class').indexOf("play_channels__active-video-info") > -1 &&
                                pattern.test($(this).attr('data-channel')));
                    });
                    Name = Name + " - " + $($info.children()[0]).text();
                    VideoLength = $($($info.find('p')[1]).children()[1]).text();
		    Description = $($info.find('p')[0]).text();
                    DetailsPlayTime = tsToClock($info.find('div').filter(function() {
                        if ($(this).attr('data-starttime'))
                            return true;
                        else 
                            return false;
                    }).attr('data-starttime')*1);

                } else if (url.indexOf("oppetarkiv") == -1) {
                    var $video = $(data).find('div').filter(function() {
                        return $(this).attr('class') == "play_container";
                    });

                    if ($video.find('section').find('a').attr('data-livestart'))
		        isLive = true;

                    Name = $($video.find('h1')[0]).text().trim();
		    DetailsImgLink = $video.find('img').attr('data-imagename');
		    DetailsPlayTime = $video.find('time').text();
                    if (isLive) {
                        var duration = $video.find('section').find('a').attr('data-length');
                        var hours = Math.floor(duration/3600);
                        if (hours > 0) {
                            VideoLength = hours + " h "
                            duration = duration - (hours*3600)
                        }
                        var minutes = Math.floor(duration/60);
                        if (minutes > 0) {
                            VideoLength = VideoLength + minutes + " min "
                            duration = duration - (minutes*60)
                        }
                        var seconds = Math.floor(duration/60);
                        if (seconds > 0) {
                            VideoLength = VideoLength + seconds + " sek"
                        }                        
                    } else {
		        AvailDate  = $($video.find('p')[1]).text().replace("Tillgänglig till ", "");
                        VideoLength = $video.find('h2').html().replace(/.+span> /,"");
                    }
		    Description = $($video.find('p')[0]).text();
		    onlySweden = $video.find('section').find('a').attr('data-only-available-in-sweden');

                } else {
                    Name = $($(data).find('img')[1]).attr('alt');
		    DetailsImgLink = $($(data).find('img')[1]).attr('data-imagename');
		    DetailsPlayTime = $($(data).find('strong')[0]).text();
                    VideoLength = $($(data).find('strong')[1]).text();

                    Description = $(data).find('div').filter(function() {
                        return $(this).attr('class') == "svt-text-bread svt-text-margin-large";
                    }).text();

		    onlySweden = ($(data).find('span').filter(function() {
                        return $(this).attr('class') == "svtoa-icon-geoblock svtIcon";
                    }).length > 0);
                }
                // alert("Name:" + Name);
                // alert("DetailsImgLink:" + DetailsImgLink);
                // alert("Description:" + Description);
                // alert("DetailsPlayTime:" + DetailsPlayTime);
                // alert("VideoLength:" + VideoLength);
                // alert("onlySweden:" + onlySweden);


		if(Language.getisSwedish()){
		    nowPlaying='Nu visas';
		}else{
		    nowPlaying='Now playing';
		    DetailsPlayTime=DetailsPlayTime.replace("igår","yesterday");
		    DetailsPlayTime=DetailsPlayTime.replace("idag","today");
		}

                Details.duration = VideoLength;
                // alert('JTDEBUG:Details.duration set:' + Details.duration);

                airTime = DetailsPlayTime;
		// alert("isLive=" + isLive);
		// alert("airTime=" + airTime);
		if (onlySweden != "false" && onlySweden != false) {
		    //proxy = 'http://playse.kantaris.net/?mode=native&url=';
		    $.getJSON( "http://smart-ip.net/geoip-json?callback=?",
			       function(data){
				   if(data.countryCode != 'SE'){
				       
				       //Geofilter.show();	
				   }
			       }
			     );
		}
		if(Name.length > 47){
		    Name = Name.substring(0, 47)+ "...";
		}
		$('.topoverlaybig').html(nowPlaying+': ' + Name);////
		var html = '<div class="project-text">';
		html+='<div class="project-name">';
		html+='<h1>'+Name+'</h1>';
		html+='<div class="project-meta border"><a id="aired" type="text">Sändes: </a><a>'+DetailsPlayTime+'</a></div>';
		html+='<div class="project-meta border"><a id="available" type="text">Tillgänglig till </a><a>'+AvailDate+'</a></div>';
		html+='<div class="project-meta"><a id="duration" type="text">Längd: </a><a>'+VideoLength+'</a></div>';
		html+='<div class="project-desc">'+Description+'</div>';
		html+='<div class="bottom-buttons">';
                html+='<a href="#" id="playButton" class="link-button selected">Spela upp</a> ';
                html+='<a href="#" id="backButton" class="link-button">Tillbaka</a>';
                html+=' </div>';
		html+=' </div>';
		
                html+='</div>';
		html+='<img class="imagestyle" src="'+DetailsImgLink+'" alt="Image" />';
            	$('#projdetails').html(html);
		
		Language.setDetailLang();

                if (playDirectly)
                    Details.startPlayer();
                    
            },
            error: function(XMLHttpRequest, textStatus, errorThrown)
            {
          	if (textStatus == 'timeout') {
                    this.tryCount++;
                    if (this.tryCount <= this.retryLimit) {
                        //try again
                        $.ajax(this);
                        return;
                    }            
                    return;
                }
        	else{
        	    alert('Failure');
        	    ConnectionError.show();
        	}
                
            }
        });

};


Details.startPlayer = function()
{
    var playDirectly = document.location.href.search("\\?play") != -1;
		
    if(Language.getisSwedish()){
	buff='Buffrar';
    }else{
	buff='Buffering';
    }
    $('#outer').css("display", "none");
    $('.video-wrapper').css("display", "block");
    $('.video-footer').css("display", "block");
    $('.bottomoverlaybig').css("display", "block");
    $('.bottomoverlaybig').html(buff+': 0%');
    

    Buttons.setKeyHandleID(2);
    
    if ( Player.init() && Audio.init())
    {
	
	Player.stopCallback = function()
	{
	    isPlaying = 0;
	    $('#outer').css("display", "block");
	    $('.video-wrapper').css("display", "none");
	    
	    $('.video-footer').css("display", "none");
	    
	    Buttons.setKeyHandleID(1);
	    /* Return to windowed mode when video is stopped
	       (by choice or when it reaches the end) */
	    //   Main.setWindowMode();
            if (playDirectly)
                history.go(-1);
	};

	//Player.setVideoURL("http://svt10hls-lh.akamaihd.net/i/svt10hls_0@78142/master.m3u8?__b__=563&bkup=off"  + "|COMPONENT=HLS");
	isPlaying = 1;
	this.Prepare();
    }
    
};

function tsToClock(ts)
{
    var time = new Date(ts *1);
    var hour = time.getHours();
    var minutes = time.getMinutes();
    if (hour < 10) hour = "0" + hour;
    if (minutes < 10) minutes = "0" + minutes;
    return hour + ":" + minutes;
};

String.prototype.trim = function () {
    return this.replace(/^\s*/, "").replace(/\s*$/, "");
};
