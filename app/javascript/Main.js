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
        url: 'http://188.40.102.5/recommended.ashx',
        tryCount : 0,
        retryLimit : 3,
		timeout: 15000,
        success: function(data)
        {
            alert('Success');

           $(data).find('video').each(function(){
					var $video = $(this); 
					var Name = $video.find('Name').text();
					var Link = $video.find('LinkTo').text();
					alert(Link);
					var Description = $video.find('Description').text();
					var ImgLink = $video.find('ImgLink').text();
                                        ImgLink = ImgLink.replace("/medium/", "/small/");
					var Live = $video.find('Live').text();
					var starttime = $video.find('Startime').text();
					var html;
					
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
								html += '<a href="details.html?ilink=' + Link + '&history=Rekommenderat/' + Name +'/" class="ilink"><img src="' + ImgLink + '" width="240" height="135" alt="'+ Name + '" /></a>';
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
        		alert('Failure');
        		ConnectionError.show();
        	}
         
        }
    });
	
	
};

