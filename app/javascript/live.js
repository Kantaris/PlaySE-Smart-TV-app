var widgetAPI = new Common.API.Widget();
var tvKey = new Common.API.TVKeyValue();
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
	language=Language.checkLanguage();
	Language.setLang(language);
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
		 $.support.cors = true; 
		  $.ajax(
    {
        type: 'GET',
        url: 'http://188.40.102.5/categoryDetail.ashx?category=live',
		timeout: 15000,
        success: function(data)
        {
            alert('Success');
		       
		        $(data).find('video').each(function(){
				
					//var src="url(images/name.png)";//background:url(../images/name-english.png) 0 0 no-repeat
					var language=Language.checkLanguage();
					Language.setLang(language);
					
					//
		            var $video = $(this); 
		            var Name = $video.find('Name').text();
					var Link = $video.find('Link').text();
					var ImgLink= $video.find('ImgLink').text();
					var pbar = $video.find('PlayBar').text();
					var starttime = $video.find('Startime').text();
					var endtime = $video.find('Endtime').text();
					if(Name.length<80)
						{
					var html;
					if(itemCounter % 2 == 1){
						html = '<div class="scroll-content-item topitem">';
					}
					else{
						html = '<div class="scroll-content-item bottomitem">';
					}
					 
			
							html += '<div class="scroll-item-img">';
								html += '<a href="details.html?ilink=' + Link + '&history=' + document.title + '/' + Name + '/" class="ilink"><img src="' + ImgLink + '" width="240" height="135" alt="" /></a>';
								if(pbar.length < 1){
									html += '<span class="topoverlay">LIVE</span>';
									html += '<span class="bottomoverlay">' + starttime + ' - ' + endtime + '</span>';
								}
								else{
									html += '<span class="topoverlayred">LIVE</span>';
									html += '<span class="bottomoverlayred">' + starttime + ' - ' + endtime + '</span>';
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
            alert('Failure');
			ConnectionError.show();
         
        }
    });
		 

};


//window.location = 'project.html?ilink=' + ilink;