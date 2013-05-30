var widgetAPI = new Common.API.Widget();
var fired = false;
var topItems;
var BottomItems;
var itemSelected;
var itemCounter = 0;
var columnCounter = 0;
var SearchList =
{

};

SearchList.onLoad = function()
{
	
	this.loadXml();
	
	// Enable key event processing
	this.enableKeys();
//	widgetAPI.sendReadyEvent();
};

SearchList.onUnload = function()
{

};

SearchList.enableKeys = function()
{
	document.getElementById("anchor").focus();
};

SearchList.setFired = function() 
{
	fired = false;
};

SearchList.urldecode = function(str) {
   return decodeURIComponent((str+'').replace(/\+/g, '%20'));
}

SearchList.Geturl=function(){
    var url = document.location.href;
    var name="";
    if (url.indexOf("=")>0)
    {
        name = url.substring(url.indexOf("=")+1,url.length);
    }
	document.title = "Sökning: " + name + "/";
	var title = this.urldecode(name);
	var html = '<li class="root-item"><a href="index.html" class="active">Sökning: ' + title + '/</a></li>';
	$('.dropdown').html($(html));
    return name;
};

SearchList.sscroll = function(param) 
{
	var xaxis = 0;
	if(columnCounter > 0){
		xaxis = columnCounter - 1;
	}
	xaxis = -xaxis * 240;
	$('.content-holder').animate({ marginLeft: xaxis}, 500 );
	 
};

SearchList.loadXml = function(){
	$.support.cors = true;
	 $.ajax(
    {
        type: 'GET',
        url: 'http://188.40.102.5/Search.ashx?sok='+this.Geturl(),
		timeout: 15000,
        success: function(data)
        {
            alert('Success');
       
        $(data).find('video').each(function(){
		
			//var src="url(images/name.png)";//background:url(../images/name-english.png) 0 0 no-repeat
			var language=Language.checkLanguage();
			Language.setLang(language);
			
            var $video = $(this); 
            var Name = $video.find('Name').text();
			var Link = $video.find('LinkTo').text();
			alert(Link);
			var Description = $video.find('Description').text();
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
						html += '<a href="showList.html?name=' + Link + '&history=' + document.title  + Name + '/" class="ilink"><img src="' + ImgLink + '" width="240" height="135" alt="" /></a>';
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
            alert('Failure');
			ConnectionError.show();
         
        }
    });

};

