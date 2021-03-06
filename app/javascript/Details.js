var widgetAPI = new Common.API.Widget();
var videoUrl = '';
var isPlaying = 0;
var spinner;
var buff;
var nowPlaying;
var language;
var gurl = "";
var Details =
{

};

Details.onLoad = function()
{

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



Details.GetPlayUrl = function(){
	gurl = this.Geturl();
	if(gurl.indexOf("http://") < 0){
		gurl = 'http://www.svtplay.se' + gurl;
	}
	$.getJSON(gurl + '?output=json', function(data) {
		
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
					 Resolution.getCorrectStream(videoUrl);
				}
				else{
					
					gurl = gurl + '?type=embed';
					alert(gurl);
					widgetAPI.runSearchWidget('29_fullbrowser', gurl);
				}
			}
		});
		
	});
};

Details.loadXml = function(){
	var url= "http://188.40.102.5/details.ashx?link="+this.Geturl();
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
			var VideoLenth=$video.find('VideoLength').text();
			var Description=$video.find('Description').text();
			var onlySweden = $video.find('OnlySweden').text();
			alert(onlySweden);
			if(onlySweden == "True"){
				$.getJSON( "http://smart-ip.net/geoip-json?callback=?",
					function(data){
						if(data.countryCode != 'SE'){
							Geofilter.show();	
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
				html+='<div class="project-meta"><a id="duration" type="text">Längd: </a><a>'+VideoLenth+'</a></div>';
		        html+='<div class="project-desc"><p>'+Description+'</p></div>';
                html+='<p><a href="#" id="playButton" class="link-button selected">Spela upp</a></p> ';
                html+='<p><a href="#" id="backButton" class="link-button4">Tillbaka</a></p>';
		        html+=' </div>';
		        
                html+='</div>';
				html+='<img class="imagestyle" src="'+DetailsImgLink+'" alt="Image" /></div></div>';
            	$('#projdetails').html(html);
			
			Language.setDetailLang(language);
        });
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
		
		$('#pluginPlayer').css("display", "block");
		$('#pluginAudio').css("display", "block");
		$('#pluginTVMW').css("display", "block");
		Buttons.setKeyHandleID(2);
		
		if ( Player.init() && Audio.init())// && Display.init() )
		{
			//Display.setVolume( Audio.getVolume() );
			//Display.setTime(0);
			
			Player.stopCallback = function()
			{
				isPlaying = 0;
				$('#outer').css("display", "block");
				$('.video-wrapper').css("display", "none");
		
				$('.video-footer').css("display", "none");
				
				
				$('#pluginPlayer').css("display", "none");
				$('#pluginAudio').css("display", "none");
				$('#pluginTVMW').css("display", "none");
				Buttons.setKeyHandleID(1);
				/* Return to windowed mode when video is stopped
					(by choice or when it reaches the end) */
			 //   Main.setWindowMode();
			};

			//Player.setVideoURL("http://svt10hls-lh.akamaihd.net/i/svt10hls_0@78142/master.m3u8?__b__=563&bkup=off"  + "|COMPONENT=HLS");
			this.GetPlayUrl();

			isPlaying = 1;
			
		}
	
};