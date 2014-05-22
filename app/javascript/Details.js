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

	if(isLive > 0){
			var url= "http://188.40.102.5/CurrentTime.ashx";
			alert(url);
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
		            alert('Success prepare');
		            currentTime = +($(data).find('CurrentTime').text());
		            alert("currentTime=" + currentTime);
		            if(airTime > currentTime){
						 countd = airTime - currentTime + 60;
						 alert("countd = " + countd);
						 downCounter = setInterval(Details.CountDown, 1000); 
					 }
					 else{
						 Details.GetPlayUrl();
					 }
		        }
		    , 
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
			 
	}
	else{
		 this.GetPlayUrl();
	 }

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

				if(videoUrl.indexOf('.m3u8') >= 0){
					 Resolution.getCorrectStream(videoUrl, isLive);
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
	var url= "http://188.40.102.5/details.ashx?link="+this.Geturl();
	var playDirectly = document.location.href.search("\\?play") != -1;
	alert(url);
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
            alert('Success');
        $(data).find('VideoInfo').each(function(){
			
				
            var $video = $(this); 
            var Name = $video.find('Name').text();
			var DetailsImgLink = $video.find('DetailsImgLink').text();
			var DetailsPlayTime = $video.find('DetailsPlayTime').text();
			if(Language.getisSwedish()){
				nowPlaying='Nu visas';
			}else{
				nowPlaying='Now playing';
				DetailsPlayTime=DetailsPlayTime.replace("igår","yesterday");
				DetailsPlayTime=DetailsPlayTime.replace("idag","today");
			}
			var Date  = $video.find('Date').text();
			var VideoLength=$video.find('VideoLength').text();
			var Description=$video.find('Description').text();
			var onlySweden = $video.find('OnlySweden').text();
			isLive = +($video.find('Live').text());
			airTime = +($video.find('AirTime').text());
			alert("isLive=" + isLive);
			alert("airTime=" + airTime);
			alert(onlySweden);
			if(onlySweden == "True"){
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
		        html+='<div class="project-meta border"><a id="available" type="text">Tillgänglig till: </a><a>'+Date+'</a></div>';
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
        });
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