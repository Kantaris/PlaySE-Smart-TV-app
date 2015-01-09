var widgetAPI = new Common.API.Widget();
var fired = false;
var topItems;
var BottomItems;
var itemSelected;
var itemCounter = 0;
var columnCounter = 0;
var language;
var live =
{

};

live.onLoad = function()
{
	Header.display('Kanaler & livesändningar');
	Audio.init();
	Audio.showMuteFooter();
	Search.init();
	Language.init();
	ConnectionError.init();
	Language.setLang();
	Resolution.displayRes();
	this.getJson();
	
	//this.loadXml();
	
	// Enable key event processing
	Buttons.enableKeys();
//	widgetAPI.sendReadyEvent();
};

live.onUnload = function()
{

};




function getimg(param,arr) 
{
	param=param.substring(0,param.indexOf("-"));
	 
	
	
	for(var i=0;i<arr.length;i++)
		{
		
		alert(arr[i].title);
		alert(param);
	       if(arr[i].title.indexOf(param)==0||param.indexOf(arr[i].title)==0)
			
			{ 
	    	   
	    	   alert(arr[i].thumbnail);
			
			return arr[i].thumbnail;
		
			
			}
		
		
		}
	
	return ;
	
};
	




live.getJson = function(){
    var html;
    $.support.cors = true; 

    // CHANNELS
    $.ajax(
        {
            type: 'GET',
            // url: 'http://188.40.102.5/categoryDetail.ashx?category=live',
            url: 'http://www.svtplay.se/kanaler',
            tryCount : 0,
            retryLimit : 3,
	    timeout: 15000,
            success: function(data)
            {
                var BaseUrl = this.url;
                alert('Success:' + this.url);
	        
	        $(data).find('div').filter(function() {
                    return $(this).attr('class').indexOf("play_channels__active-video-info") > -1;
                }).each(function(){

		    var $video = $(this); 
                    var Name = $video.attr('data-channel');
	            var Link = BaseUrl + '/' + Name;
                    // alert("Link:" + Link);
	            var ImgLink  = GetChannelThumb(BaseUrl, Name);
                    // alert("ImgLink:" + ImgLink);
                    var starttime = tsToClock($video.find('div').filter(function() {
                        if ($(this).attr('data-starttime'))
                            return true;
                        else 
                            return false;
                    }).attr('data-starttime')*1);
                    Name = Name + ' - ' + starttime  + " " + $($video.children()[0]).text();
		    if(Name.length<80)
		    {
		        if(itemCounter % 2 == 1){
			    html = '<div class="scroll-content-item topitem">';
		        }
		        else{
			    html = '<div class="scroll-content-item bottomitem">';
		        }
		        
		        
		        html += '<div class="scroll-item-img">';
		        html += '<a href="details.html?ilink=' + Link + '&history=' + document.title + '/' + Name + '/" class="ilink"><img src="' + ImgLink + '" width="240" height="135" alt="" /></a>';
		        html += '</div>';
		        html += '<div class="scroll-item-name">';
		        html +=	'<p><a href="#">' + Name + '</a></p>';
		        html += '</div>';
		        html += '</div>';
		        
		        if(itemCounter % 2 == 1){
			    $('#topRow').append($(html));
		        }
		        else{
			    $('#bottomRow').append($(html));
		        }
		        
		        itemCounter++;
		    }
	        });
                // Add Live Shows
                GetLives(html);
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

function GetLives(html)
{
    $.support.cors = true; 
    $.ajax(
        {
            type: 'GET',
            // url: 'http://188.40.102.5/categoryDetail.ashx?category=live',
            url: 'http://www.svtplay.se/live',
            tryCount : 0,
            retryLimit : 3,
	    timeout: 15000,
            success: function(data)
            {
                alert('Success:' + this.url);
	        
	        $(data).find('article').each(function(){

		    var $video = $(this); 

                    if ($video.attr('data-broadcastended') == "true")
                        return true;

                    var Name = $video.attr('data-title');
	            var Link = $video.find('a').attr('href');
	            //var Description = $video.find('Description').text();
	            var ImgLink  = $video.find('img').attr('data-imagename');
		    var running = $($video.find('figure').find('span')[0]).attr('class').indexOf("play_graphics-live--inactive") == -1;
		    var starttime = $video.attr('data-broadcaststarttime');
		    // var endtime = $video.find('Endtime').text();
		    if(Name.length<80)
		    {
		        if(itemCounter % 2 == 1){
			    html = '<div class="scroll-content-item topitem">';
		        }
		        else{
			    html = '<div class="scroll-content-item bottomitem">';
		        }
		        
		        
		        html += '<div class="scroll-item-img">';
		        html += '<a href="details.html?ilink=' + Link + '&history=' + document.title + '/' + Name + '/" class="ilink"><img src="' + ImgLink + '" width="240" height="135" alt="" /></a>';
		        if(!running){
			    html += '<span class="topoverlay">LIVE</span>';
			    // html += '<span class="bottomoverlay">' + starttime + ' - ' + endtime + '</span>';
			    html += '<span class="bottomoverlay">' + starttime + '</span>';
		        }
		        else{
			    html += '<span class="topoverlayred">LIVE</span>';
			    // html += '<span class="bottomoverlayred">' + starttime + ' - ' + endtime + '</span>';
			    html += '<span class="bottomoverlayred">' + starttime + '</span>';
		        }
		        html += '</div>';
		        html += '<div class="scroll-item-name">';
		        html +=	'<p><a href="#">' + Name + '</a></p>';
		        //	html += '<span class="item-date">' + Description + '</span>';
		        html += '</div>';
		        html += '</div>';
		        
		        if(itemCounter % 2 == 1){
			    $('#topRow').append($(html));
		        }
		        else{
			    $('#bottomRow').append($(html));
		        }
		        
		        itemCounter++;
		    }
		    //
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
}

function tsToClock(ts)
{
    var time = new Date(ts *1);
    var hour = time.getHours();
    var minutes = time.getMinutes();
    if (hour < 10) hour = "0" + hour;
    if (minutes < 10) minutes = "0" + minutes;
    return hour + ":" + minutes;
};

function GetChannelThumb(url, Name) 
{
    var channels = [{"name":"svt1", "thumb":"images/svt1.jpg"},
                    {"name":"svt2", "thumb":"images/svt2.jpg"},
                    {"name":"barnkanalen", "thumb":"images/barnkanalen.jpg"},
                    {"name":"svt24", "thumb":"images/svt24.jpg"},
                    {"name":"kunskapskanalen", "thumb":"images/kunskapskanalen.jpg"}
                   ];

    pattern = new RegExp(Name, 'i');
    for (var i = 0; i < channels.length; i++) {
        if (pattern.test(channels[i].name))
            return channels[i].thumb;
    }
    return url + '/public/images/channels/backgrounds/' + Name + '-background.jpg';
};


//window.location = 'project.html?ilink=' + ilink;
