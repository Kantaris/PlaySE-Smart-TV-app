var widgetAPI = new Common.API.Widget();
var itemCounter = 0;
var columnCounter = 0;
var historyPath;
var showList =
{

};

showList.onLoad = function()
{
	Language.setLang();
	Resolution.displayRes();
	this.loadXml();
	PathHistory.GetPath();
	// Enable key event processing
	Buttons.enableKeys();
//	widgetAPI.sendReadyEvent();
};

showList.onUnload = function()
{

};


showList.Geturl=function(){
    var url = document.location.href;
    var name="";
    if (url.indexOf("=")>0)
    {
        name = url.substring(url.indexOf("=")+1,url.indexOf("&"));
    }
    return name;
};





showList.loadXml = function(){
	
	$.support.cors = true;
	 $.ajax(
    {
        type: 'GET',
        url: 'http://188.40.102.5/showList.ashx?name='+this.Geturl(),
		timeout: 15000,
        success: function(data)
        {
            alert('Success');
	
       
        $(data).find('Episode').each(function(){
			
            var $video = $(this); 
            var Name = $video.find('Name').text();
			var Link = $video.find('Link').text();
			alert(Link);
			//var Description = $video.find('Description').text();
			var ImgLink  = $video.find('ImgLink').text();
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
						html += '<a href="details.html?ilink=' + Link + '&history=' + document.title + Name + '/" class="ilink"><img src="' + ImgLink + '" width="240" height="135" alt="' + Name + '" /></a>';
					html += '</div>';
					html += '<div class="scroll-item-name">';
						html +=	'<p><a href="#">' + Name + '</a></p>';
						//html += '<span class="item-date">' + Description + '</span>';
					html += '</div>';
				html += '</div>';
	
			if(itemCounter % 2 == 0){
				$('#topRow').append($(html));
			}
			else{
				$('#bottomRow').append($(html));
			}
			
			itemCounter++;
			alert(Link);
        });
    },
        error: function(XMLHttpRequest, textStatus, errorThrown)
        {
            alert('Failure');
			ConnectionError.show();
         
        }
    });

};


//window.location = 'project.html?ilink=' + ilink + '&history=' + historyPath + iname + '/';