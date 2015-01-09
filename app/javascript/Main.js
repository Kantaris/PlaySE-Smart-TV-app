var widgetAPI = new Common.API.Widget();
var pluginAPI = new Common.API.Plugin();

var fired = false;
var itemCounter = 0;
var columnCounter = 0;
var language;
var result="error";
var Main =
{

};

Main.onLoad = function()
{
	Header.display('Populärt');
	Audio.init();
	Audio.showMuteFooter();
	Search.init();
	Language.init();
	ConnectionError.init();
	widgetAPI.sendReadyEvent();
        pluginAPI.registIMEKey();
	Language.setLang();
	Resolution.displayRes();
	this.loadXml();	
	// Enable key event processing
	Buttons.enableKeys();
	
};

Main.onUnload = function()
{

};


Main.loadXml = function(){
	$.support.cors = true;
	
	  $.ajax(
    {
        type: 'GET',
        // url: 'http://188.40.102.5/recommended.ashx',
        url: 'http://www.svtplay.se/populara?sida=1',
        tryCount : 0,
        retryLimit : 3,
	timeout: 15000,
        success: function(data)
        {
            alert('Success:' + this.url);
            $(data).find('article').each(function(){
	        var $video = $(this); 
                var Name = $video.attr('data-title');
		var Link = $video.find('a').attr('href');
		var Description = $video.attr('data-description');
	        var ImgLink  = $video.find('img').attr('data-imagename');
		var Live = $video.find('Live').text();
		var starttime = $video.find('Startime').text();
		var html;

		if(Description.length > 47){
		    Description = Description.substring(0, 47)+ "...";
		}

		if(itemCounter % 2 == 0){
		    if(itemCounter > 0){
			html = '<div class="scroll-content-item topitem">';
		    }
		    else{
			html = '<div class="scroll-content-item selected topitem">';
		    }
		}
		else{
		    html = '<div class="scroll-content-item bottomitem">';
		}
		html += '<div class="scroll-item-img">';
		html += '<a href="details.html?ilink=' + Link + '&history=Populärt/' + Name +'/" class="ilink"><img src="' + ImgLink + '" width="240" height="135" alt="'+ Name + '" /></a>';
		if(Live == 1){
		    html += '<span class="topoverlay">LIVE</span>';
		    html += '<span class="bottomoverlay">' + starttime + '</span>';
		}
		else if(Live == 2){
		    html += '<span class="topoverlayred">LIVE</span>';
		    html += '<span class="bottomoverlayred">' + starttime + '</span>';
		}
		html += '</div>';
		html += '<div class="scroll-item-name">';
		html +=	'<p><a href="#">' + Name + '</a></p>';
		html += '<span class="item-date">' + Description + '</span>';
		html += '</div>';
		html += '</div>';
		if(itemCounter % 2 == 0){
		    $('#topRow').append($(html));
		}
		else{
		    $('#bottomRow').append($(html));
		}
		itemCounter++;
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
        		alert('Failure:' + textStatus);
        		ConnectionError.show();
        	}
         
        }
    });
};

