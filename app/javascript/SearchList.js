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
	Header.display('Populärt');
	Audio.init();
	Audio.showMuteFooter();
	Search.init();
	Language.init();
	ConnectionError.init();
	Language.setLang();
	Resolution.displayRes();
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
};

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
	$('.content-holder').animate({ marginLeft: xaxis});
	 
};

SearchList.loadXml = function(){
    $.support.cors = true;
    $.ajax(
        {
            type: 'GET',
            url: 'http://www.svtplay.se/sok?q='+this.Geturl(),
            tryCount : 0,
            retryLimit : 3,
	    timeout: 15000,
            success: function(data)
            {
                alert('Success:' + this.url);

                $(data).find('div').filter(function() {
                    return ($(this).attr('id') == "search-titles" ||
                            $(this).attr('id') == "search-episodes" ||
                            $(this).attr('id') == "search-oppetarkiv" ||
                            $(this).attr('id') == "search-clips")
                }).find('article').each(function(){
                    var $video = $(this); 
                    var Name = $video.attr('data-title');
	            var Link = $video.find('a').attr('href');
		    // alert(Link);
		    var Description = $video.attr('data-description');
	            var ImgLink  = $video.find('img').attr('data-imagename');
                    if (!ImgLink) ImgLink = $video.find('img').attr('src');
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

                    var LinkPrefx = '<a href="showList.html?name=';
                    if (Link.search("/klipp/") != -1 || Link.search("/video/") != -1) {
                        LinkPrefx = '<a href="details.html?ilink=';
                    }
                    else {
                        Link = "http://svtplay.se" + Link
                    }
		    html += '<div class="scroll-item-img">';
		    html += LinkPrefx + Link + '&history=' + document.title  + Name + '/" class="ilink"><img src="' + ImgLink + '" width="240" height="135" alt="" /></a>';
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
