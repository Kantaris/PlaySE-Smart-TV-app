var widgetAPI = new Common.API.Widget();
var videoUrl = '';
var isLeft = 1;
var isPlaying = 0;
var nowPlaying;
var spinner;
var language;

var Kanaler =
{

};

Kanaler.onLoad = function()
{
	// Enable key event processing
	Header.display('');
	Audio.init();
	Audio.showMuteFooter();
	Search.init();
	Language.init();
	ConnectionError.init();
	Language.setLang();
	Resolution.displayRes();
	Buttons.setKeyHandleID(3);					
	Buttons.enableKeys();
	var url = document.location.href;
	if (url.indexOf("direct=")>0)
	{
		Kanaler.startPlayer();
	}
	PathHistory.GetPath();
	this.loadXml();
	

};

Kanaler.onUnload = function()
{
	Player.deinit();
};


Kanaler.Geturl=function(){
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

Kanaler.startPlayer = function()
{				
		$('#outer').css("display", "none");
		$('.video-wrapper').css("display", "block");
		$('.video-footer').css("display", "block");
		$('.bottomoverlaybig').css("display", "block");
		$('.bottomoverlaybig').html('Buffrar: 0%');

		Buttons.setKeyHandleID(5);
		
		if ( Player.init() && Audio.init())
		{
			//Display.setVolume( Audio.getVolume() );
			//Display.setTime(0);
			
			Player.stopCallback = function()
			{
				isPlaying = 0;
				$('#outer').css("display", "block");
				$('.video-wrapper').css("display", "none");
		
				$('.video-footer').css("display", "none");
				
				
				Buttons.setKeyHandleID(3);
				/* Return to windowed mode when video is stopped
					(by choice or when it reaches the end) */
			 //   Main.setWindowMode();
			};

			//Player.setVideoURL("http://svt10hls-lh.akamaihd.net/i/svt10hls_0@78142/master.m3u8?__b__=563&bkup=off"  + "|COMPONENT=HLS");
			this.GetPlayUrl();
			isPlaying = 1;
			
			
		}
	
};

Kanaler.GetPlayUrl = function(){
	$.getJSON('http://www.svtplay.se/' + this.Geturl() + '?output=json', function(data) {
		
		$.each(data, function(key, val) {
			if(key == 'video'){
				alert(val.videoReferences[1].url);
				//videoUrl = 'http://kantaris.hemsida.eu/?mode=native&url=http://svt10hls-lh.akamaihd.net/i/svt10hls_0@78142/index_3_av-p.m3u8?sd=10&rebase=on&e=1';
				//videoUrl = 'http://playse.kantaris.net/?mode=native&url=' + val.videoReferences[1].url;
				videoUrl = val.videoReferences[1].url;
				videoUrl = Resolution.getCorrectStream(videoUrl, 1);
				
			}
		});
		
	});
	
};

Kanaler.loadXml = function(){
	var channel = this.Geturl();
	var url = "http://188.40.102.5/kanaler.ashx?link=" + channel;
	channel = channel.substring(channel.indexOf("/") + 1, channel.length);
	channel = channel.toUpperCase();
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
		
			
			
			if(Language.getisSwedish()){
				nowPlaying='Nu visas';
			}else{
				nowPlaying='Now playing';
			}
            var $video = $(this); 
            var Name = $video.find('Name').text();
			var DetailsImgLink = $video.find('DetailsImgLink').text();
			var DetailsPlayTime = $video.find('DetailsPlayTime').text();
			//var Date  = $video.find('Date').text();
			var VideoLenth=$video.find('VideoLength').text();
			var Description=$video.find('Description').text();
			$('.topoverlaybig').html(nowPlaying+': ' + Name);//////
			var html = '<div class="project-text">';
		        html+='<div class="project-name">';
		        html+='<h1>'+channel+'</h1>';
		        html+='<div class="project-meta border"><a id="shown_now" >Visas nu: </a><a>'+Name+'</a></div>';
		        html+='<div class="project-meta border"><a id="begins">Börjar: </a><a>'+DetailsPlayTime+'</a></div>';
				html+='<div class="project-meta"><a id="duration">Längd: </a><a>'+VideoLenth+'</a></div>';
		        html+='<div class="project-desc">'+Description+'</div>';
		        html+='<div class="bottom-buttons">';
                html+='<a href="#" id="playButton" class="link-button selected">Spela upp</a>';
                html+='<a href="#" id="backButton" class="link-button">Tillbaka</a>';
		        html+=' </div>';
		        html+=' </div>';
                html+='</div>';
				html+='<img class="imagestyle" src="'+DetailsImgLink+'" alt="Image" />';
            	$('#projdetails').html(html);
			Language.setKanalerLang();
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


